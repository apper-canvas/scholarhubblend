import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { courseService } from "@/services/api/courseService";
import { toast } from "react-toastify";

const ScheduleGrid = () => {
  const [courses, setCourses] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [draggedCourse, setDraggedCourse] = useState(null);

  const timeSlots = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
    "5:00 PM", "5:30 PM", "6:00 PM"
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    loadScheduleData();
  }, []);

  const loadScheduleData = async () => {
    try {
      setLoading(true);
      const coursesData = await courseService.getAllWithSchedule();
      setCourses(coursesData);
      
      // Build schedule grid from course data
      const scheduleGrid = {};
      coursesData.forEach(course => {
        if (course.schedule) {
          course.schedule.forEach(slot => {
            const key = `${slot.day}-${slot.startTime}`;
            scheduleGrid[key] = {
              course,
              ...slot
            };
          });
        }
      });
      setSchedule(scheduleGrid);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load schedule data");
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (course, e) => {
    setDraggedCourse(course);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (day, time, e) => {
    e.preventDefault();
    if (!draggedCourse) return;

    try {
      const scheduleSlot = {
        day,
        startTime: time,
        duration: 90, // Default 1.5 hours
        location: "TBD"
      };

      await courseService.updateSchedule(draggedCourse.Id, scheduleSlot);
      await loadScheduleData();
      toast.success(`${draggedCourse.name} scheduled for ${day} at ${time}`);
    } catch (err) {
      toast.error("Failed to update schedule");
    }
    setDraggedCourse(null);
  };

  const handleRemoveFromSchedule = async (courseId, day, time) => {
    try {
      await courseService.removeFromSchedule(courseId, day, time);
      await loadScheduleData();
      toast.success("Course removed from schedule");
    } catch (err) {
      toast.error("Failed to remove course from schedule");
    }
  };

  const getScheduleSlot = (day, time) => {
    return schedule[`${day}-${time}`];
  };

  const formatTimeRange = (startTime, duration) => {
    const start = new Date(`2024-01-01 ${startTime}`);
    const end = new Date(start.getTime() + duration * 60000);
    return `${startTime} - ${end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadScheduleData} />;

  return (
    <div className="space-y-6">
      {/* Available Courses */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <ApperIcon name="BookOpen" size={24} className="mr-2 text-primary" />
          Available Courses
        </h2>
        <div className="flex flex-wrap gap-2">
          {courses.map(course => (
            <Badge
              key={course.Id}
              draggable
              onDragStart={(e) => handleDragStart(course, e)}
              style={{ backgroundColor: course.color, cursor: 'grab' }}
              className="text-white px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="GripVertical" size={14} />
                <span>{course.name}</span>
                <span className="text-xs opacity-80">({course.credits} credits)</span>
              </div>
            </Badge>
          ))}
        </div>
        <p className="text-sm text-secondary mt-2">
          Drag courses to time slots to schedule them
        </p>
      </Card>

      {/* Schedule Grid */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <ApperIcon name="Calendar" size={24} className="mr-2 text-primary" />
            Weekly Schedule Grid
          </h2>
          <div className="flex gap-2">
            <Button
              onClick={() => loadScheduleData()}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Refresh
            </Button>
            <Button className="bg-gradient-to-r from-primary to-blue-600">
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save Schedule
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-6 gap-1 mb-2">
              <div className="p-2 text-center font-medium text-secondary text-sm">
                Time
              </div>
              {days.map(day => (
                <div key={day} className="p-2 text-center font-medium text-secondary text-sm">
                  {day}
                </div>
              ))}
            </div>

            {/* Time slots */}
            <div className="space-y-1">
              {timeSlots.map(time => (
                <div key={time} className="grid grid-cols-6 gap-1">
                  <div className="p-2 text-xs text-secondary border-r border-gray-200 font-medium">
                    {time}
                  </div>
                  {days.map(day => {
                    const slot = getScheduleSlot(day, time);
                    return (
                      <div
                        key={`${day}-${time}`}
                        className={`p-2 min-h-[50px] border border-gray-200 rounded-sm transition-colors duration-200 ${
                          selectedSlot === `${day}-${time}` 
                            ? 'bg-blue-50 border-blue-300' 
                            : 'hover:bg-gray-50'
                        }`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(day, time, e)}
                        onClick={() => setSelectedSlot(`${day}-${time}`)}
                      >
                        {slot ? (
                          <div
                            className="text-xs p-1 rounded text-white shadow-sm relative group"
                            style={{ backgroundColor: slot.course.color }}
                          >
                            <div className="font-medium truncate">
                              {slot.course.name}
                            </div>
                            <div className="opacity-90 text-xs">
                              {formatTimeRange(slot.startTime, slot.duration)}
                            </div>
                            <div className="opacity-80 text-xs">
                              {slot.location}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFromSchedule(slot.course.Id, day, time);
                              }}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-opacity duration-200"
                            >
                              <ApperIcon name="X" size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center text-gray-300 text-xs">
                            Drop here
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Schedule Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-secondary">Total Credits</div>
              <div className="text-2xl font-bold text-primary">
                {courses.reduce((sum, course) => sum + course.credits, 0)}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-secondary">Scheduled Courses</div>
              <div className="text-2xl font-bold text-success">
                {Object.keys(schedule).length}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-secondary">Average Grade</div>
              <div className="text-2xl font-bold text-accent">
                {courses.length > 0 
                  ? (courses.reduce((sum, course) => sum + course.currentGrade, 0) / courses.length).toFixed(1)
                  : '0.0'}%
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ScheduleGrid;