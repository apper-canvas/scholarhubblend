import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { formatDateShort, getDueDateColor, getPriorityColor } from "@/utils/dateUtils";

const AssignmentItem = ({ 
  assignment, 
  course, 
  onToggleComplete, 
  onEdit,
  onDelete,
  showCourse = true 
}) => {
  const dueDateColor = getDueDateColor(assignment.dueDate);
  const priorityColor = getPriorityColor(assignment.priority);

  return (
    <Card className="p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={() => onToggleComplete(assignment.Id)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
              assignment.completed
                ? "bg-success border-success text-white"
                : "border-gray-300 hover:border-primary"
            }`}
          >
            {assignment.completed && <ApperIcon name="Check" size={14} />}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-1">
              <h4 className={`font-medium ${
                assignment.completed 
                  ? "text-gray-500 line-through" 
                  : "text-gray-900"
              }`}>
                {assignment.title}
              </h4>
              
              <Badge variant={assignment.priority?.toLowerCase() || "default"} size="sm">
                {assignment.priority}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-secondary">
              {showCourse && course && (
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: course.color }}
                  />
                  <span>{course.name}</span>
                </div>
              )}
              
              <div className={`flex items-center ${dueDateColor}`}>
                <ApperIcon name="Clock" size={14} className="mr-1" />
                <span>{formatDateShort(assignment.dueDate)}</span>
              </div>
              
              <div className="flex items-center">
                <ApperIcon name="Target" size={14} className="mr-1" />
                <span>{assignment.maxPoints} pts</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {assignment.completed && assignment.grade > 0 && (
            <Badge variant="success" size="sm">
              {assignment.grade}/{assignment.maxPoints}
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(assignment)}
          >
            <ApperIcon name="Edit2" size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(assignment.Id)}
            className="text-error hover:text-error hover:bg-red-50"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AssignmentItem;