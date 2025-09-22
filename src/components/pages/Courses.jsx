import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import CourseCard from "@/components/molecules/CourseCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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
      setFilteredCourses(coursesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
course.name_c?.toLowerCase().includes(query.toLowerCase()) ||
        course.instructor_c?.toLowerCase().includes(query.toLowerCase()) ||
        course.semester_c?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  };

  const handleCourseClick = (course) => {
toast.info(`Viewing ${course.name_c}`, {
      position: "top-right"
    });
  };

  const getAssignmentCount = (courseId) => {
return assignments.filter(assignment => assignment.course_id_c?.Id === courseId || assignment.course_id_c === courseId).length;
  };

  if (loading) return <Loading variant="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Courses</h1>
          <p className="text-secondary">
            Manage your academic courses and track performance
          </p>
        </div>
        
<Button className="lg:ml-auto" onClick={() => navigate('/courses/add')}>
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Add Course
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search courses, instructors, or semesters..."
          className="lg:w-96"
        />
        
        <div className="flex gap-2 lg:ml-auto">
          <Button variant="outline" size="sm">
            <ApperIcon name="Filter" size={16} className="mr-2" />
            Filter
          </Button>
          
          <Button variant="outline" size="sm">
            <ApperIcon name="SortDesc" size={16} className="mr-2" />
            Sort
          </Button>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        searchQuery ? (
          <Empty
            title="No courses found"
            description={`No courses match "${searchQuery}". Try adjusting your search.`}
            icon="Search"
          />
        ) : (
          <Empty
            title="No courses added yet"
            description="Start by adding your first course to track your academic progress"
            actionLabel="Add Your First Course"
            icon="BookOpen"
          />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.Id}
              course={course}
              assignmentCount={getAssignmentCount(course.Id)}
              onClick={() => handleCourseClick(course)}
            />
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {courses.length > 0 && (
        <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-xl p-6 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {courses.length}
              </div>
              <div className="text-sm text-secondary">Total Courses</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-1">
{courses.reduce((sum, course) => sum + (course.credits_c || 0), 0)}
              </div>
              <div className="text-sm text-secondary">Total Credits</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-success mb-1">
                {assignments.length}
              </div>
              <div className="text-sm text-secondary">Total Assignments</div>
            </div>
            
            <div className="text-center">
<div className="text-2xl font-bold text-warning mb-1">
                {courses.length > 0 
? (courses.reduce((sum, course) => sum + (course.current_grade_c || 0), 0) / courses.length).toFixed(1)
                  : "0.0"
                }%
              </div>
              <div className="text-sm text-secondary">Avg Grade</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;