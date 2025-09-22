import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className,
  hover = false,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-xl shadow-sm border border-slate-200 transition-all duration-200";
  const hoverStyles = hover ? "hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 cursor-pointer" : "";
  
  return (
    <div
      ref={ref}
      className={cn(baseStyles, hoverStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;