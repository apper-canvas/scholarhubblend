import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { courseService } from "@/services/api/courseService";
import { getLetterGrade } from "@/utils/calculations";

const GradeOverview = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const coursesData = await courseService.getAll();
      setCourses(coursesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCourses} />;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Grade Overview
        </h3>
        <ApperIcon name="BarChart3" size={20} className="text-secondary" />
      </div>
      
      <div className="space-y-4">
        {courses.map((course) => {
const gradeColor = (course.currentGrade || 0) >= 90 ? "text-success" : 
                            (course.currentGrade || 0) >= 80 ? "text-warning" : "text-error";
          return (
            <div
              key={course.Id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div 
className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: course.color }}
                >
                  {course.name?.charAt(0) || '?'}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {course.name}
                  </h4>
                  <p className="text-sm text-secondary">
                    {course.credits} Credits
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 flex-shrink-0">
                <div className="text-right">
                  <div className={`font-bold ${gradeColor}`}>
{course.currentGrade != null ? getLetterGrade(course.currentGrade) : "N/A"}
                  </div>
                  <div className="text-sm text-secondary">
{course.currentGrade != null ? course.currentGrade.toFixed(1) : "N/A"}%
                  </div>
                </div>
                
                <div className="w-16">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-500"
style={{ width: `${Math.min(course.currentGrade || 0, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default GradeOverview;