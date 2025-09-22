import { format, isToday, isTomorrow, isThisWeek, differenceInDays, parseISO } from "date-fns";

export const formatDate = (date) => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMM dd, yyyy");
};

export const formatDateShort = (date) => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMM dd");
};

export const getRelativeDate = (date) => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  
  if (isToday(dateObj)) return "Today";
  if (isTomorrow(dateObj)) return "Tomorrow";
  
  const days = differenceInDays(dateObj, new Date());
  if (days < 0) return `${Math.abs(days)} days ago`;
  if (days <= 7) return `In ${days} days`;
  
  return formatDate(dateObj);
};

export const getDueDateColor = (dueDate) => {
  if (!dueDate) return "text-gray-500";
  
  const dateObj = typeof dueDate === "string" ? parseISO(dueDate) : dueDate;
  const days = differenceInDays(dateObj, new Date());
  
  if (days < 0) return "text-error";
  if (days === 0) return "text-warning";
  if (days === 1) return "text-accent";
  if (days <= 3) return "text-orange-500";
  if (days <= 7) return "text-primary";
  
  return "text-secondary";
};

export const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "text-error bg-red-50 border-red-200";
    case "medium":
      return "text-warning bg-yellow-50 border-yellow-200";
    case "low":
      return "text-success bg-green-50 border-green-200";
    default:
      return "text-secondary bg-gray-50 border-gray-200";
  }
};