import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, title, subtitle }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden mr-3"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold gradient-text">{title}</h1>
            {subtitle && (
              <p className="text-secondary text-sm">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" size={20} />
          </Button>
          
          <Button variant="ghost" size="sm">
            <ApperIcon name="Settings" size={20} />
          </Button>
          
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;