import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X } from "lucide-react";

const Sidebar = ({ items, basePath, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle cases where items might be undefined
  if (!items || !Array.isArray(items)) {
    return null;
  }

  const handleItemClick = (path) => {
    navigate(`${basePath}${path}`);
    // Close sidebar on mobile after navigation
    if (setSidebarOpen && typeof setSidebarOpen === "function") {
      setSidebarOpen(false);
    }
  };

  const closeSidebar = () => {
    if (setSidebarOpen && typeof setSidebarOpen === "function") {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 fixed left-0 top-16 bottom-0 z-20">
        <nav className="p-6 h-full overflow-y-auto">
          <ul className="space-y-1">
            {items.map((item, index) => {
              const isActive = location.pathname === `${basePath}${item.path}`;
              return (
                <li key={index}>
                  <button
                    onClick={() => handleItemClick(item.path)}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary-500 text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                    }`}
                  >
                    <span className={isActive ? "text-white" : "text-gray-500"}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`ml-auto px-2 py-1 text-xs rounded-full ${
                          isActive
                            ? "bg-white bg-opacity-20 text-white"
                            : "bg-primary-100 text-primary-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-lg`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={closeSidebar}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 h-full overflow-y-auto">
          <ul className="space-y-1">
            {items.map((item, index) => {
              const isActive = location.pathname === `${basePath}${item.path}`;
              return (
                <li key={index}>
                  <button
                    onClick={() => handleItemClick(item.path)}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary-500 text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                    }`}
                  >
                    <span className={isActive ? "text-white" : "text-gray-500"}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`ml-auto px-2 py-1 text-xs rounded-full ${
                          isActive
                            ? "bg-white bg-opacity-20 text-white"
                            : "bg-primary-100 text-primary-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Desktop Content Spacer */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
};

export default Sidebar;
