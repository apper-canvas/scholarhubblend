import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import FilterSelect from "@/components/molecules/FilterSelect";
import AssignmentItem from "@/components/molecules/AssignmentItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import { toast } from "react-toastify";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

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
      setFilteredAssignments(assignmentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    let filtered = assignments;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Course filter
    if (filterCourse) {
      filtered = filtered.filter(assignment => assignment.courseId === parseInt(filterCourse));
    }

    // Priority filter
    if (filterPriority) {
      filtered = filtered.filter(assignment => assignment.priority === filterPriority);
    }

    // Status filter
    if (filterStatus) {
      if (filterStatus === "completed") {
        filtered = filtered.filter(assignment => assignment.completed);
      } else if (filterStatus === "pending") {
        filtered = filtered.filter(assignment => !assignment.completed);
      } else if (filterStatus === "overdue") {
        filtered = filtered.filter(assignment => 
          !assignment.completed && new Date(assignment.dueDate) < new Date()
        );
      }
    }

    // Sort by due date
    filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    setFilteredAssignments(filtered);
  }, [assignments, searchQuery, filterCourse, filterPriority, filterStatus]);

  const handleToggleComplete = async (id) => {
    try {
      const updatedAssignment = await assignmentService.toggleComplete(id);
      setAssignments(prev => prev.map(assignment => 
        assignment.Id === id ? updatedAssignment : assignment
      ));
      
      toast.success(
        updatedAssignment.completed ? "Assignment completed!" : "Assignment marked incomplete",
        { position: "top-right" }
      );
    } catch (err) {
      toast.error("Failed to update assignment", { position: "top-right" });
    }
  };

  const handleEdit = (assignment) => {
    toast.info(`Editing ${assignment.title}`, { position: "top-right" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await assignmentService.delete(id);
        setAssignments(prev => prev.filter(assignment => assignment.Id !== id));
        toast.success("Assignment deleted successfully", { position: "top-right" });
      } catch (err) {
        toast.error("Failed to delete assignment", { position: "top-right" });
      }
    }
  };

  const getCourseById = (courseId) => {
    return courses.find(course => course.Id === courseId);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterCourse("");
    setFilterPriority("");
    setFilterStatus("");
  };

  if (loading) return <Loading variant="list" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Filter options
  const courseOptions = courses.map(course => ({
    value: course.Id.toString(),
    label: course.name
  }));

  const priorityOptions = [
    { value: "High", label: "High Priority" },
    { value: "Medium", label: "Medium Priority" },
    { value: "Low", label: "Low Priority" }
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "overdue", label: "Overdue" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Assignments</h1>
          <p className="text-secondary">
            Track and manage all your course assignments
          </p>
        </div>
        
        <Button>
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Add Assignment
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search assignments..."
          className="w-full lg:w-96"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FilterSelect
            label="Course"
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            options={courseOptions}
            placeholder="All Courses"
          />
          
          <FilterSelect
            label="Priority"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            options={priorityOptions}
            placeholder="All Priorities"
          />
          
          <FilterSelect
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={statusOptions}
            placeholder="All Statuses"
          />
          
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full"
            >
              <ApperIcon name="X" size={16} className="mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        searchQuery || filterCourse || filterPriority || filterStatus ? (
          <Empty
            title="No assignments found"
            description="No assignments match your current filters. Try adjusting your search criteria."
            icon="Search"
            actionLabel="Clear Filters"
            onAction={clearFilters}
          />
        ) : (
          <Empty
            title="No assignments yet"
            description="Start by adding your first assignment to track your coursework"
            actionLabel="Add Your First Assignment"
            icon="FileText"
          />
        )
      ) : (
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <AssignmentItem
              key={assignment.Id}
              assignment={assignment}
              course={getCourseById(assignment.courseId)}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showCourse={true}
            />
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {assignments.length > 0 && (
        <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {assignments.length}
              </div>
              <div className="text-sm text-secondary">Total Assignments</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-success mb-1">
                {assignments.filter(a => a.completed).length}
              </div>
              <div className="text-sm text-secondary">Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-warning mb-1">
                {assignments.filter(a => !a.completed).length}
              </div>
              <div className="text-sm text-secondary">Pending</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-error mb-1">
                {assignments.filter(a => 
                  !a.completed && new Date(a.dueDate) < new Date()
                ).length}
              </div>
              <div className="text-sm text-secondary">Overdue</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;