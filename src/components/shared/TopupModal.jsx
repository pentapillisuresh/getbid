import React, { useState } from "react";
import { X, CheckCircle, XCircle } from "lucide-react";
import api from "../../services/apiService";
import toastService from "../../services/toastService";

const TopupModal = ({
  show,
  onClose,
  plans = [],
  plansLoading = false,
  plansError = null,
  onSuccess, // optional callback after successful subscription
  formatCurrency,
}) => {
  const [creatingSubscriptionFor, setCreatingSubscriptionFor] = useState(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleChoosePlan = async (plan) => {
    try {
      setCreatingSubscriptionFor(plan.id);
      const createResp = await api.post("/v1/subscriptions/create", {
        body: { planId: plan.id, currency: "INR" },
      });

      const order =
        createResp &&
        (createResp.order || createResp.data?.order || createResp.orderId
          ? createResp.order
          : null);
      const subscription =
        createResp &&
        (createResp.subscription ||
        createResp.data?.subscription ||
        createResp.subscriptionId
          ? createResp.subscription
          : null);

      const razorpayOrderId =
        (order && order.id) ||
        (subscription && subscription.razorpayOrderId) ||
        (createResp && createResp.razorpayOrderId) ||
        null;
      const amount =
        (order && (order.amount || order.amount_due || order.amount_paid)) ||
        plan.price * 100;

      if (!razorpayOrderId) {
        toastService.showError("Failed to create order");
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toastService.showError("Failed to load payment gateway");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || window?.__RAZORPAY_KEY || "",
        amount: amount || plan.price * 100,
        currency: "INR",
        name: plan.name || "Subscription",
        order_id: razorpayOrderId,
        description: `${plan.name} subscription`,
        handler: async function (response) {
          try {
            const confirmBody = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };
            await api.post("/v1/subscriptions/confirm", {
              body: confirmBody,
              showToasts: true,
            });
            toastService.showSuccess("Subscription confirmed");
            // call parent callback to refresh subscriptions or UI
            if (typeof onSuccess === "function") {
              try {
                await onSuccess();
              } catch (e) {
                // ignore parent refresh errors
                console.error("onSuccess callback failed", e);
              }
            }
            // close modal
            onClose && onClose();
          } catch (err) {
            console.error("Confirm subscription failed", err);
            toastService.showError(
              (err && err.message) || "Payment confirmation failed"
            );
          }
        },
        modal: {
          ondismiss: function () {
            toastService.showError("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Choose plan error", err);
      toastService.showError(
        (err && err.message) || "Failed to start subscription"
      );
    } finally {
      setCreatingSubscriptionFor(null);
    }
  };

  if (!show) return null;

  return (
    <div
      style={{ marginTop: "0px" }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-2">
          Choose Your Subscription Plan
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Select the plan that best fits your bidding needs
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {plansLoading && (
            <div className="col-span-3 text-center py-8">Loading plans...</div>
          )}

          {plansError && (
            <div className="col-span-3 text-center text-red-600">
              {plansError}
            </div>
          )}

          {!plansLoading && !plansError && plans.length === 0 && (
            <div className="col-span-3 text-center">No plans available</div>
          )}

          {!plansLoading &&
            !plansError &&
            plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative border-2 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all ${
                  plan.isPopular ? "border-blue-500" : "border-gray-200"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Popular
                  </div>
                )}
                <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                <h4 className="text-3xl font-bold text-blue-700 mb-2">
                  {formatCurrency(plan.price)}
                </h4>
                <p className="text-gray-600 mb-1">
                  {plan.tendersLimit} Tender Submissions
                </p>
                <p className="text-green-600 font-medium mb-4">
                  Valid for {plan.validDays} days
                </p>

                <ul className="text-sm text-gray-600 mb-6 text-left space-y-2">
                  {(plan.included || []).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                  {(plan.excluded || []).map((exclude, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      {exclude}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleChoosePlan(plan)}
                  disabled={!!creatingSubscriptionFor}
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors ${
                    creatingSubscriptionFor ? "opacity-70 cursor-wait" : ""
                  }`}
                >
                  {creatingSubscriptionFor
                    ? "Processing..."
                    : `Choose ${plan.name}`}
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TopupModal;
