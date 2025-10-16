// Lightweight configurable API service
// Usage: import api from 'src/services/apiService'
// api.request('GET', '/endpoint', { headers: {...}, queryParams: {a:1}, timeout: 5000 })

import toastService from "./toastService";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const defaultConfig = {
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 0, // ms, 0 means no timeout
  // Toast behavior (can be overridden per-client or per-request)
  showToasts: false, // global default: don't show toasts automatically
  // keys to look for on successful JSON response to display as toast
  successMessageKey: "message",
  // keys to look for on error responses to display as toast
  errorMessageKey: "message",
  // Optional function to retrieve auth token dynamically (called per-request).
  // By default it will attempt to read `localStorage.getItem('token')` or `localStorage.getItem('accessToken')`.
  getAuthToken: () => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem("accessToken") || null;
      }
    } catch (e) {
      // ignore
    }
    return null;
  },
};

function buildQueryString(params) {
  if (!params) return "";
  const esc = encodeURIComponent;
  return Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null)
    .map((k) => `${esc(k)}=${esc(params[k])}`)
    .join("&");
}

function mergeHeaders(defaults, provided) {
  return Object.assign({}, defaults || {}, provided || {});
}

function timeoutPromise(ms, controller) {
  return new Promise((_, reject) => {
    if (ms <= 0) return; // no timeout
    const id = setTimeout(() => {
      try {
        controller.abort();
      } catch (e) {
        // ignore
      }
      reject(new Error("Request timed out"));
    }, ms);
    // allow consumer to clear by returning id
    // but we don't expose it here
  });
}

const createApiClient = (config = {}) => {
  const cfg = Object.assign({}, defaultConfig, config);

  async function request(method, url, opts = {}) {
    const { headers, queryParams, body, timeout = cfg.timeout } = opts;
    // toast-related options (per-request override)
    const {
      showToasts: reqShowToasts,
      successMessageKey: reqSuccessKey,
      errorMessageKey: reqErrorKey,
    } = opts;
    const mergedHeaders = mergeHeaders(cfg.headers, headers);

    // Attach Authorization header dynamically if not already provided.
    // Priority: per-request opts.getAuthToken -> global cfg.getAuthToken -> localStorage fallback.
    try {
      const tokenGetter = opts.getAuthToken || cfg.getAuthToken;
      let token = null;
      if (typeof tokenGetter === "function") {
        token = tokenGetter();
      } else if (typeof window !== "undefined" && window.localStorage) {
        token = window.localStorage.getItem("accessToken");
      }
      if (token) {
        const hasAuth = Object.keys(mergedHeaders).some(
          (k) => k.toLowerCase() === "authorization"
        );
        if (!hasAuth) {
          mergedHeaders["Authorization"] = token.startsWith("Bearer")
            ? token
            : `Bearer ${token}`;
        }
      }
    } catch (e) {
      // ignore token attach errors
    }

    let fullUrl = url;
    if (cfg.baseURL && !/^https?:\/\//i.test(url)) {
      fullUrl = `${cfg.baseURL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
    }

    const qs = buildQueryString(queryParams);
    if (qs) fullUrl += (fullUrl.includes("?") ? "&" : "?") + qs;

    const controller =
      typeof AbortController !== "undefined" ? new AbortController() : null;

    const fetchOpts = {
      method,
      headers: mergedHeaders,
      signal: controller ? controller.signal : undefined,
    };

    if (body !== undefined && body !== null) {
      // If body is a plain object and content-type is json, stringify it
      const contentType = (
        mergedHeaders["Content-Type"] ||
        mergedHeaders["content-type"] ||
        ""
      ).toLowerCase();
      if (
        typeof body === "object" &&
        !(body instanceof FormData) &&
        contentType.includes("application/json")
      ) {
        fetchOpts.body = JSON.stringify(body);
      } else {
        fetchOpts.body = body;
      }
    }

    const race = [];
    race.push(fetch(fullUrl, fetchOpts));
    if (controller && timeout > 0) {
      race.push(timeoutPromise(timeout, controller));
    }

    let resp;
    try {
      resp = await Promise.race(race);
    } catch (err) {
      // could be timeout or fetch failure
      // show error toast if enabled
      const showToasts =
        reqShowToasts !== undefined ? reqShowToasts : cfg.showToasts;
      if (
        showToasts &&
        toastService &&
        typeof toastService.showError === "function"
      ) {
        toastService.showError(err.message || "Request failed");
      }
      throw err;
    }

    if (!resp) throw new Error("No response");

    const contentType = resp.headers.get("content-type") || "";
    let data;
    if (contentType.includes("application/json")) {
      data = await resp.json();
    } else {
      data = await resp.text();
    }
    const showToasts =
      reqShowToasts !== undefined ? reqShowToasts : cfg.showToasts;

    // Helper to extract message from response data using configured keys
    function extractMessage(source, keyOrKeys) {
      if (!source) return null;
      if (!keyOrKeys) return null;
      const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
      // if source is string, return it directly for messages
      if (typeof source === "string") return source;
      for (const k of keys) {
        if (source[k] !== undefined && source[k] !== null) {
          const val = source[k];
          if (typeof val === "string" && val.trim() !== "") return val;
          if (typeof val === "object" && val.message) return val.message;
          // fallback to toString
          try {
            return String(val);
          } catch (e) {
            // continue
          }
        }
      }
      return null;
    }

    if (!resp.ok) {
      const error = new Error("HTTP error " + resp.status);
      error.status = resp.status;
      error.data = data;

      if (
        showToasts &&
        toastService &&
        typeof toastService.showError === "function"
      ) {
        const errKey = reqErrorKey || cfg.errorMessageKey;
        const msg =
          extractMessage(data, errKey) || `Request failed (${resp.status})`;
        toastService.showError(msg);
      }

      throw error;
    }

    // success path: optionally show success toast
    if (
      showToasts &&
      toastService &&
      typeof toastService.showSuccess === "function"
    ) {
      const successKey = reqSuccessKey || cfg.successMessageKey;
      const msg = extractMessage(data, successKey);
      if (msg) toastService.showSuccess(msg);
    }

    return data;
  }

  return {
    request,
    get: (url, opts) => request("GET", url, opts),
    post: (url, opts) => request("POST", url, opts),
    put: (url, opts) => request("PUT", url, opts),
    patch: (url, opts) => request("PATCH", url, opts),
    delete: (url, opts) => request("DELETE", url, opts),
    defaults: cfg,
  };
};

// default singleton client
const api = createApiClient();

// Convenience: allow updating the default singleton configuration at runtime
api.setDefaults = (newCfg = {}) => {
  const merged = Object.assign({}, api.defaults, newCfg);
  // replace internal defaults by creating a new client
  const newClient = createApiClient(merged);
  // copy methods onto api object
  Object.keys(newClient).forEach((k) => {
    api[k] = newClient[k];
  });
  api.defaults = merged;
};

// Convenience: set or clear the Authorization header on the default client.
api.setAuthToken = (token) => {
  const mergedHeaders = Object.assign({}, api.defaults.headers || {});
  if (token) {
    mergedHeaders.Authorization = token.startsWith("Bearer")
      ? token
      : `Bearer ${token}`;
  } else {
    delete mergedHeaders.Authorization;
  }
  api.setDefaults({ headers: mergedHeaders });
};

/**
 * Usage examples:
 *
 * import api, { createApiClient } from 'src/services/apiService'
 *
 * // set base URL and global header
 * api.setDefaults({ baseURL: 'https://api.example.com', headers: { Authorization: 'Bearer TOKEN' } })
 *
 * // simple GET with query params
 * api.get('/tenders', { queryParams: { page: 1, pageSize: 20 } })
 *   .then(data => console.log(data))
 *
 * // POST with JSON body and custom header
 * api.post('/tenders', {
 *   headers: { 'X-Custom': 'value' },
 *   body: { title: 'New Tender', dueDate: '2025-12-01' }
 * })
 *
 * // create an isolated client with its own defaults
 * const client = createApiClient({ baseURL: 'https://other.example', headers: { Accept: 'application/json' } });
 * client.get('/status')
 */

export default api;
export { createApiClient };
