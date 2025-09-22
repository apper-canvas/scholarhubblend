import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Courses", href: "/courses", icon: "BookOpen" },
    { name: "Assignments", href: "/assignments", icon: "FileText" },
    { name: "Grades", href: "/grades", icon: "BarChart3" },
    { name: "Calendar", href: "/calendar", icon: "Calendar" },
  ];

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-slate-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-primary to-blue-600 rounded-lg p-2 mr-3">
                <ApperIcon name="GraduationCap" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">ScholarHub</h1>
                <p className="text-xs text-secondary">Academic Management</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-blue-100 text-primary border-r-2 border-primary"
                      : "text-secondary hover:bg-slate-50 hover:text-gray-900"
                  }`}
                >
                  <ApperIcon
                    name={item.icon}
                    size={20}
                    className={`mr-3 flex-shrink-0 transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-secondary group-hover:text-gray-600"
                    }`}
                  />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />
          
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white z-50 lg:hidden shadow-xl"
          >
            <div className="flex items-center justify-between flex-shrink-0 px-6 py-4 border-b border-slate-200">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-primary to-blue-600 rounded-lg p-2 mr-3">
                  <ApperIcon name="GraduationCap" size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold gradient-text">ScholarHub</h1>
                  <p className="text-xs text-secondary">Academic Management</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-primary/10 to-blue-100 text-primary border-r-2 border-primary"
                        : "text-secondary hover:bg-slate-50 hover:text-gray-900"
                    }`}
                  >
                    <ApperIcon
                      name={item.icon}
                      size={20}
                      className={`mr-3 flex-shrink-0 transition-colors duration-200 ${
                        isActive ? "text-primary" : "text-secondary group-hover:text-gray-600"
                      }`}
                    />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;