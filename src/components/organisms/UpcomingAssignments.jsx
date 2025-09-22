import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import { formatDateShort, getDueDateColor } from "@/utils/dateUtils";

const UpcomingAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);
      
      // Filter upcoming incomplete assignments and sort by due date
      const upcomingAssignments = assignmentsData
        .filter(assignment => !assignment.completed)
        .filter(assignment => new Date(assignment.dueDate) >= new Date())
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);
      
      setAssignments(upcomingAssignments);
      setCourses(coursesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCourseForAssignment = (courseId) => {
    return courses.find(course => course.Id === courseId);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (assignments.length === 0) {
    return (
      <Empty
        title="No Upcoming Assignments"
        description="All caught up! No pending assignments found."
        icon="CheckCircle"
      />
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Upcoming Assignments
        </h3>
        <ApperIcon name="Clock" size={20} className="text-secondary" />
      </div>
      
      <div className="space-y-4">
        {assignments.map((assignment) => {
          const course = getCourseForAssignment(assignment.courseId);
          const dueDateColor = getDueDateColor(assignment.dueDate);
          
          return (
            <div
              key={assignment.Id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3 flex-1">
                {course && (
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: course.color }}
                  />
                )}
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {assignment.title}
                  </h4>
                  <p className="text-sm text-secondary truncate">
                    {course?.name}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 flex-shrink-0">
                <Badge variant={assignment.priority?.toLowerCase() || "default"} size="sm">
                  {assignment.priority}
                </Badge>
                
                <div className={`text-sm font-medium ${dueDateColor}`}>
                  {formatDateShort(assignment.dueDate)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default UpcomingAssignments;