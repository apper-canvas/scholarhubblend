import React, { useEffect, useState } from "react";
import ScheduleGrid from "@/components/organisms/ScheduleGrid";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Assignments from "@/components/pages/Assignments";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { getDueDateColor } from "@/utils/dateUtils";

const Calendar = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'schedule'
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);
      
      setAssignments(assignmentsData);
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

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getAssignmentsForDate = (date) => {
    return assignments.filter(assignment => {
      const assignmentDate = new Date(assignment.dueDate);
      return isSameDay(assignmentDate, date);
    });
  };

  const getCourseById = (courseId) => {
    return courses.find(course => course.Id === courseId);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const selectedDateAssignments = selectedDate ? getAssignmentsForDate(selectedDate) : [];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Calendar</h1>
          <p className="text-secondary">
            View your assignment deadlines and course schedule
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode(viewMode === 'calendar' ? 'schedule' : 'calendar')}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <ApperIcon name={viewMode === 'calendar' ? 'Grid3X3' : 'Calendar'} size={20} className="mr-2" />
            {viewMode === 'calendar' ? 'Schedule Grid' : 'Calendar View'}
          </Button>
          <Button>
            <ApperIcon name="Plus" size={20} className="mr-2" />
            Add Event
          </Button>
        </div>
</div>
      </div>

      {/* Conditional Rendering based on viewMode */}
      {viewMode === 'schedule' ? (
        <ScheduleGrid />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <ApperIcon name="Calendar" size={24} className="mr-2 text-primary" />
                    {format(currentDate, "MMMM yyyy")}
                  </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth(-1)}
                >
                  <ApperIcon name="ChevronLeft" size={16} />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth(1)}
                >
                  <ApperIcon name="ChevronRight" size={16} />
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
              {/* Day Headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-secondary">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {calendarDays.map((day) => {
                const dayAssignments = getAssignmentsForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isTodayDate = isToday(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                
                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`bg-white p-2 min-h-[100px] cursor-pointer hover:bg-slate-50 transition-colors duration-200 ${
                      !isCurrentMonth ? "opacity-40" : ""
                    } ${isTodayDate ? "bg-primary/5" : ""} ${
                      isSelected ? "ring-2 ring-primary ring-inset" : ""
                    }`}
                  >
                    <div className={`text-sm font-medium mb-2 ${
                      isTodayDate ? "text-primary" : isCurrentMonth ? "text-gray-900" : "text-gray-400"
                    }`}>
                      {format(day, "d")}
                    </div>
                    
                    <div className="space-y-1">
                      {dayAssignments.slice(0, 2).map((assignment) => {
                        const course = getCourseById(assignment.courseId);
                        return (
                          <div
                            key={assignment.Id}
                            className="text-xs p-1 rounded truncate"
                            style={{ 
                              backgroundColor: course ? `${course.color}20` : "#f1f5f9",
                              color: course?.color || "#64748b"
                            }}
                          >
                            {assignment.title}
                          </div>
                        );
                      })}
                      
                      {dayAssignments.length > 2 && (
                        <div className="text-xs text-secondary">
                          +{dayAssignments.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
</Card>
          </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Details */}
          {selectedDate && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {format(selectedDate, "MMMM d, yyyy")}
              </h3>
              
              {selectedDateAssignments.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateAssignments.map((assignment) => {
                    const course = getCourseById(assignment.courseId);
                    const dueDateColor = getDueDateColor(assignment.dueDate);
                    
                    return (
                      <div key={assignment.Id} className="p-3 rounded-lg bg-slate-50">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {assignment.title}
                          </h4>
                          <Badge variant={assignment.priority?.toLowerCase() || "default"} size="sm">
                            {assignment.priority}
                          </Badge>
                        </div>
                        
                        {course && (
                          <div className="flex items-center text-xs text-secondary">
                            <div 
                              className="w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: course.color }}
                            />
                            {course.name}
                          </div>
                        )}
                        
                        <div className="flex items-center mt-2 text-xs">
                          <ApperIcon name="Clock" size={12} className={`mr-1 ${dueDateColor}`} />
                          <span className={dueDateColor}>
                            {format(new Date(assignment.dueDate), "h:mm a")}
</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Empty 
                  title="No assignments"
                  description={`No assignments due on ${format(selectedDate, "MMMM d, yyyy")}`}
                />
              )}
            </Card>
          )}
          {/* Upcoming Assignments */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upcoming Assignments
            </h3>
            
            {assignments
              .filter(assignment => 
                !assignment.completed && new Date(assignment.dueDate) >= new Date()
              )
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .slice(0, 5)
              .map((assignment) => {
                const course = getCourseById(assignment.courseId);
                const dueDateColor = getDueDateColor(assignment.dueDate);
                
                return (
                  <div key={assignment.Id} className="mb-4 last:mb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                          {assignment.title}
                        </h4>
                        {course && (
                          <div className="flex items-center text-xs text-secondary mb-1">
                            <div 
                              className="w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: course.color }}
                            />
                            {course.name}
                          </div>
                        )}
                        <div className={`text-xs ${dueDateColor}`}>
                          {format(new Date(assignment.dueDate), "MMM d, h:mm a")}
                        </div>
                      </div>
                      
                      <Badge variant={assignment.priority?.toLowerCase() || "default"} size="sm">
                        {assignment.priority}
                      </Badge>
                    </div>
                  </div>
                );
              })}
          </Card>

          {/* Legend */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Course Colors
            </h3>
            
            <div className="space-y-2">
              {courses.map((course) => (
                <div key={course.Id} className="flex items-center text-sm">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: course.color }}
                  />
                  <span className="text-gray-700 truncate">
                    {course.name}
                  </span>
                </div>
              ))}
            </div>
</Card>
        </div>
        </div>
        </>
      )}
    </div>
  );
};

export default Calendar;