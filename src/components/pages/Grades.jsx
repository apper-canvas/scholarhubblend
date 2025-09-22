import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { gradeCategoryService } from "@/services/api/gradeCategoryService";
import { getLetterGrade, calculateCourseGrade } from "@/utils/calculations";
import { toast } from "react-toastify";

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [coursesData, assignmentsData, categoriesData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll(),
        gradeCategoryService.getAll()
      ]);
      
      setCourses(coursesData);
      setAssignments(assignmentsData);
      setCategories(categoriesData);
      
      if (coursesData.length > 0 && !selectedCourse) {
setSelectedCourse(coursesData[0].Id.toString());
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentCourse = courses.find(course => course.Id === parseInt(selectedCourse));
const courseAssignments = assignments.filter(assignment => 
    (assignment.course_id_c?.Id || assignment.course_id_c) === parseInt(selectedCourse)
  );
  const courseCategories = categories.filter(category => 
    category.courseId === parseInt(selectedCourse)
  );

  const getCategoryAssignments = (categoryName) => {
    return courseAssignments.filter(assignment => assignment.category === categoryName);
  };

  const getCategoryAverage = (categoryName) => {
    const categoryAssignments = getCategoryAssignments(categoryName);
    const gradedAssignments = categoryAssignments.filter(a => a.grade > 0);
    
    if (gradedAssignments.length === 0) return 0;
    
const total = gradedAssignments.reduce((sum, assignment) => {
      return sum + ((assignment.grade_c || 0) / (assignment.max_points_c || 1) * 100);
    }, 0);
    
    return total / gradedAssignments.length;
  };

  const handleGradeUpdate = (assignmentId, newGrade) => {
    toast.success("Grade updated successfully", { position: "top-right" });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (courses.length === 0) {
    return (
      <Empty
        title="No courses found"
        description="Add some courses first to track your grades"
        actionLabel="Go to Courses"
        icon="BookOpen"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Grades</h1>
          <p className="text-secondary">
            Track your academic performance and grade breakdowns
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="min-w-[200px]"
          >
            {courses.map(course => (
<option key={course.Id} value={course.Id}>
                {course.name_c}
              </option>
            ))}
          </Select>
          
          <Button>
            <ApperIcon name="Calculator" size={20} className="mr-2" />
            Grade Calculator
          </Button>
        </div>
      </div>

      {currentCourse && (
        <>
          {/* Course Overview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl"
style={{ backgroundColor: currentCourse.color_c }}
                >
                  {currentCourse.name_c?.charAt(0) || 'C'}
                </div>
                
                <div>
<h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {currentCourse.name_c}
                  </h2>
                  <p className="text-secondary">
                    {currentCourse.instructor_c} • {currentCourse.credits_c} Credits • {currentCourse.semester_c}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-4xl font-bold gradient-text mb-1">
{getLetterGrade(currentCourse.current_grade_c || 0)}
                </div>
                <div className="text-xl text-secondary">
                  {(currentCourse.current_grade_c || 0).toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
className="h-3 rounded-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-500"
                style={{ width: `${Math.min(currentCourse.current_grade_c || 0, 100)}%` }}
              />
            </div>
          </Card>

          {/* Grade Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courseCategories.length > 0 ? (
              courseCategories.map((category) => {
                const categoryAssignments = getCategoryAssignments(category.name);
                const categoryAverage = getCategoryAverage(category.name);
                const gradedAssignments = categoryAssignments.filter(a => a.grade > 0);
                
                return (
                  <Card key={category.Id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
<h3 className="text-lg font-semibold text-gray-900">
                          {category.name_c}
                        </h3>
                        <p className="text-sm text-secondary">
                          {category.weight}% of final grade
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {categoryAverage.toFixed(1)}%
                        </div>
                        <div className="text-sm text-secondary">
                          {gradedAssignments.length}/{categoryAssignments.length} graded
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-accent to-orange-500 transition-all duration-500"
                        style={{ width: `${Math.min(categoryAverage, 100)}%` }}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      {categoryAssignments.length > 0 ? (
                        categoryAssignments.map((assignment) => (
                          <div key={assignment.Id} className="flex items-center justify-between py-2">
                            <div className="flex-1">
<h4 className="font-medium text-gray-900">
                                {assignment.title_c}
                              </h4>
                              <p className="text-sm text-secondary">
                                Max: {assignment.max_points_c} pts
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {assignment.grade > 0 ? (
                                <Badge 
variant={
                                    (assignment.grade_c || 0) / (assignment.max_points_c || 1) >= 0.9 ? "success" :
                                    (assignment.grade_c || 0) / (assignment.max_points_c || 1) >= 0.8 ? "warning" : "error"
                                  }
                                >
                                  {assignment.grade_c || 0}/{assignment.max_points_c || 0}
                                </Badge>
                              ) : (
                                <Badge variant="default">
                                  Not Graded
                                </Badge>
                              )}
                              
                              <Button variant="ghost" size="sm">
                                <ApperIcon name="Edit2" size={14} />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-secondary text-sm py-4">
                          No assignments in this category
                        </p>
                      )}
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="lg:col-span-2">
                <Empty
                  title="No grade categories found"
                  description="This course doesn't have any grade categories set up yet"
                  icon="BarChart3"
                />
              </div>
            )}
          </div>

          {/* Grade Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Grade Breakdown Summary
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">
{courseAssignments.filter(a => a.completed_c).length}
                </div>
                <div className="text-sm text-secondary">Completed</div>
              </div>
              
              <div className="text-center p-4 bg-accent/5 rounded-lg">
                <div className="text-2xl font-bold text-accent mb-1">
{courseAssignments.filter(a => (a.grade_c || 0) > 0).length}
                </div>
                <div className="text-sm text-secondary">Graded</div>
              </div>
              
              <div className="text-center p-4 bg-success/5 rounded-lg">
                <div className="text-2xl font-bold text-success mb-1">
{courseAssignments.filter(a => ((a.grade_c || 0) / (a.max_points_c || 1)) >= 0.9).length}
                </div>
                <div className="text-sm text-secondary">A Grades</div>
              </div>
              
              <div className="text-center p-4 bg-warning/5 rounded-lg">
                <div className="text-2xl font-bold text-warning mb-1">
{courseAssignments.reduce((sum, a) => sum + (a.max_points_c || 0), 0)}
                </div>
                <div className="text-sm text-secondary">Total Points</div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default Grades;