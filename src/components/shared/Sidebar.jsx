import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ items, basePath }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (path) => {
    navigate(`${basePath}${path}`);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-6">
        <ul className="space-y-2">
          {items.map((item, index) => {
            const isActive = location.pathname === `${basePath}${item.path}`;
            return (
              <li key={index}>
                <button style={{fontSize:"15px"}}
                  onClick={() => handleItemClick(item.path)}
                  className={`sidebar-item w-full text-left ${isActive ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-primary-100 text-primary-600 text-xs px-2 py-1 rounded-full">
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
  );
};

export default Sidebar;