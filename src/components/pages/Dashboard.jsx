import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import UpcomingAssignments from "@/components/organisms/UpcomingAssignments";
import GradeOverview from "@/components/organisms/GradeOverview";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { calculateGPA } from "@/utils/calculations";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll()
      ]);
      
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading variant="dashboard" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const gpa = calculateGPA(courses);
const totalCredits = courses.reduce((sum, course) => sum + (course.credits_c || 0), 0);
const upcomingAssignments = assignments.filter(assignment => {
    const dueDate = new Date(assignment.due_date_c);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return !assignment.completed_c && dueDate >= today && dueDate <= nextWeek;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Academic Dashboard
        </h1>
        <p className="text-secondary text-lg">
          Track your progress and stay on top of your coursework
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Current GPA"
          value={gpa}
          icon="Target"
          color="primary"
          subtitle="Overall Performance"
        />
        
        <StatCard
          title="Total Credits"
          value={totalCredits}
          icon="BookOpen"
          color="accent"
          subtitle={`${courses.length} Active Courses`}
        />
        
        <StatCard
          title="Due This Week"
          value={upcomingAssignments.length}
          icon="Clock"
          color={upcomingAssignments.length > 5 ? "warning" : "success"}
          subtitle="Upcoming Assignments"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <UpcomingAssignments />
        </div>
        
        <div className="space-y-6">
          <GradeOverview />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;