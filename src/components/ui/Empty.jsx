import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by creating your first item",
  actionLabel = "Get Started",
  onAction,
  icon = "FileText"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-full p-8 mb-6">
        <ApperIcon name={icon} size={56} className="text-secondary" />
      </div>
      
      <h3 className="text-2xl font-bold gradient-text mb-3">
        {title}
      </h3>
      
      <p className="text-secondary text-center mb-8 max-w-md text-lg">
        {description}
      </p>
      
      {onAction && (
        <Button 
          onClick={onAction}
          className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary transform hover:scale-105 transition-all duration-300 px-8 py-3 text-lg"
        >
          <ApperIcon name="Plus" size={20} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;