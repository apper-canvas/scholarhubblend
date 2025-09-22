import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = "primary",
  subtitle,
  trend,
  className 
}) => {
  const colorStyles = {
    primary: "text-primary bg-primary/10",
    accent: "text-accent bg-accent/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    error: "text-error bg-error/10"
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary mb-1">{title}</p>
          <p className="text-3xl font-bold gradient-text">{value}</p>
          {subtitle && (
            <p className="text-sm text-secondary mt-1">{subtitle}</p>
          )}
        </div>
        
        {icon && (
          <div className={`p-3 rounded-lg ${colorStyles[color]}`}>
            <ApperIcon name={icon} size={24} />
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center">
          <ApperIcon 
            name={trend.direction === "up" ? "TrendingUp" : "TrendingDown"} 
            size={16} 
            className={trend.direction === "up" ? "text-success" : "text-error"}
          />
          <span className={`ml-1 text-sm ${trend.direction === "up" ? "text-success" : "text-error"}`}>
            {trend.value}
          </span>
          <span className="ml-1 text-sm text-secondary">{trend.label}</span>
        </div>
      )}
    </Card>
  );
};

export default StatCard;