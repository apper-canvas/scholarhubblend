import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { getLetterGrade } from "@/utils/calculations";

const CourseCard = ({ course, assignmentCount = 0, onClick }) => {
  const gradeColor = course.currentGrade >= 90 ? "success" : 
                    course.currentGrade >= 80 ? "warning" : "error";

  return (
    <Card hover onClick={onClick} className="p-6 group">
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: course.color }}
        >
          {course.name.charAt(0)}
        </div>
        
        <Badge variant={gradeColor} className="font-semibold">
          {getLetterGrade(course.currentGrade)}
        </Badge>
      </div>
      
      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200">
        {course.name}
      </h3>
      
      <p className="text-secondary text-sm mb-4">
        {course.instructor} • {course.credits} Credits
      </p>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-secondary">Current Grade</span>
          <span className="font-semibold text-gray-900">
            {course.currentGrade.toFixed(1)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-500"
            style={{ width: `${Math.min(course.currentGrade, 100)}%` }}
          />
        </div>
        
        <div className="flex items-center text-sm text-secondary">
          <ApperIcon name="BookOpen" size={16} className="mr-2" />
          <span>{assignmentCount} assignments</span>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;