import React from "react";
import {
  FileText,
  CheckCircle,
  Users,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TenderDashboard = () => {
  // === Stats Data ===
  const stats = [
    {
      title: "Total Tenders",
      value: "2,847",
      change: "+12% from last month",
      icon: <FileText className="w-8 h-8 text-blue-600" />,
    },
    {
      title: "Closed Tenders",
      value: "1,923",
      change: "+8% from last month",
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
    },
    {
      title: "Active Vendors",
      value: "456",
      change: "+15% from last month",
      icon: <Users className="w-8 h-8 text-purple-600" />,
    },
    {
      title: "Clients",
      value: "89",
      change: "+5% from last month",
      icon: <Building2 className="w-8 h-8 text-orange-600" />,
    },
  ];

  // === Chart Data ===
  const tenderStatus = [
    { name: "Open", value: 45, color: "#3B82F6" },
    { name: "Closed", value: 32, color: "#22C55E" },
    { name: "Awarded", value: 18, color: "#8B5CF6" },
    { name: "Cancelled", value: 5, color: "#EF4444" },
  ];

  const monthlyTrend = [
    { month: "Jan", tenders: 4000 },
    { month: "Feb", tenders: 4500 },
    { month: "Mar", tenders: 4800 },
    { month: "Apr", tenders: 5200 },
    { month: "May", tenders: 5800 },
    { month: "Jun", tenders: 6500 },
    { month: "Jul", tenders: 6900 },
    { month: "Aug", tenders: 7100 },
    { month: "Sep", tenders: 7600 },
    { month: "Oct", tenders: 8200 },
    { month: "Nov", tenders: 8900 },
    { month: "Dec", tenders: 9700 },
  ];

  const stateWise = [
    { state: "Maharashtra", count: 342 },
    { state: "Karnataka", count: 298 },
    { state: "Tamil Nadu", count: 256 },
    { state: "Gujarat", count: 230 },
    { state: "Telangana", count: 280 },
  ];

  const vendors = [
    { name: "ABC Construction Ltd", wins: 89, color: "#3B82F6" },
    { name: "XYZ Infrastructure", wins: 76, color: "#22C55E" },
    { name: "Metro Engineering", wins: 64, color: "#8B5CF6" },
  ];

  const tenders = [
    {
      id: "TND001",
      title: "Construction of 4-Lane Highway from Mumbai to Pune",
      client: "Maharashtra State Road Development Corporation",
      category: "Infrastructure",
      value: "₹25.0Cr",
      location: "Mumbai, Maharashtra",
      status: "Open",
      closeDate: "28/02/2024",
    },
    {
      id: "TND004",
      title: "Solar Power Plant Installation - 50MW",
      client: "Gujarat Energy Development Agency",
      category: "Energy",
      value: "₹30.0Cr",
      location: "Ahmedabad, Gujarat",
      status: "Open",
      closeDate: "15/03/2024",
    },
    {
      id: "TND005",
      title: "Hospital Equipment Procurement",
      client: "Rajasthan Health Department",
      category: "Healthcare",
      value: "₹4.5Cr",
      location: "Jaipur, Rajasthan",
      status: "Open",
      closeDate: "20/02/2024",
    },
    {
      id: "TND006",
      title: "Educational Institution Building Construction",
      client: "Andhra Pradesh Education Board",
      category: "Education",
      value: "₹6.5Cr",
      location: "Visakhapatnam, Andhra Pradesh",
      status: "Open",
      closeDate: "05/03/2024",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tender Dashboard</h1>
          <p className="text-sm text-gray-500">
            Centralized tender management system
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-medium text-gray-900">Rajesh kumar </p>
            <p className="text-sm text-gray-500">TechBuild Construction</p>
          </div>
          <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full font-semibold">
            R
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white shadow-sm rounded-xl p-5 border border-gray-100 flex items-center gap-4"
          >
            <div className="p-3 rounded-full bg-gray-50">{stat.icon}</div>
            <div>
              <h3 className="text-gray-500 text-sm">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> {stat.change}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-8 pb-8">
        {/* Tender Status Pie */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Tender Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={tenderStatus}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
              >
                {tenderStatus.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            {tenderStatus.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-600">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: s.color }}
                ></span>
                {s.name} ({s.value}%)
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends Line */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Monthly Tender Trends
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyTrend}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tenders"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Bar Chart + Vendor */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-8 pb-8">
        {/* Statewise Bar */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            State-wise Tender Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stateWise}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Vendors */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Top Performing Vendors
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={vendors}
                dataKey="wins"
                nameKey="name"
                innerRadius={50}
                outerRadius={90}
              >
                {vendors.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-4 space-y-1 text-sm">
            {vendors.map((v, i) => (
              <li
                key={i}
                className="flex justify-between text-gray-700 border-b pb-1"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: v.color }}
                  ></span>
                  {v.name}
                </span>
                <span className="text-green-600 font-medium">
                  {v.wins} wins
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white mx-8 p-6 mb-8 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Filters</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-500 mb-1">
              Search by Tender Name / ID
            </label>
            <input
              type="text"
              placeholder="Enter tender name or ID"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">State</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option>All States</option>
              <option>Maharashtra</option>
              <option>Karnataka</option>
              <option>Tamil Nadu</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">District</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option>All Districts</option>
            </select>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            Apply Filters
          </button>
          <button className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
            Reset
          </button>
        </div>
      </section>

      {/* Tenders Table */}
      <section className="bg-white mx-8 mb-8 rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Latest Tenders
          </h2>
          <p className="text-sm text-gray-500">{tenders.length} tenders found</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Tender Details",
                  "Client",
                  "Value",
                  "Location",
                  "Status",
                  "Close Date",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tenders.map((tender) => (
                <tr key={tender.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {tender.title}
                    </div>
                    <div className="text-xs text-blue-600 font-medium mt-1">
                      {tender.category}
                    </div>
                    <div className="text-xs text-gray-400">ID: {tender.id}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {tender.client}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {tender.value}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {tender.location}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                      {tender.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {tender.closeDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-600 font-medium cursor-pointer">
                    View
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default TenderDashboard;
