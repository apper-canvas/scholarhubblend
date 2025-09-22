import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";

const CourseForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    instructor: "",
    semester: "",
    credits: "",
    description: ""
  });
  const [errors, setErrors] = useState({});

  const semesterOptions = [
    { value: "Fall 2024", label: "Fall 2024" },
    { value: "Spring 2024", label: "Spring 2024" },
    { value: "Summer 2024", label: "Summer 2024" },
    { value: "Fall 2025", label: "Fall 2025" },
    { value: "Spring 2025", label: "Spring 2025" },
    { value: "Summer 2025", label: "Summer 2025" }
  ];

  const creditOptions = [
    { value: "1", label: "1 Credit" },
    { value: "2", label: "2 Credits" },
    { value: "3", label: "3 Credits" },
    { value: "4", label: "4 Credits" },
    { value: "5", label: "5 Credits" },
    { value: "6", label: "6 Credits" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Course name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Course name must be at least 3 characters";
    }
    
    if (!formData.instructor.trim()) {
      newErrors.instructor = "Instructor name is required";
    } else if (formData.instructor.trim().length < 2) {
      newErrors.instructor = "Instructor name must be at least 2 characters";
    }
    
    if (!formData.semester) {
      newErrors.semester = "Semester is required";
    }
    
    if (!formData.credits) {
      newErrors.credits = "Credits are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    try {
      setLoading(true);
      
      const courseData = {
        name: formData.name.trim(),
        instructor: formData.instructor.trim(),
        semester: formData.semester,
        credits: parseInt(formData.credits),
        description: formData.description.trim() || "",
        currentGrade: 0, // Default starting grade
        color: "#2563EB" // Default color
      };

      await courseService.create(courseData);
      
      toast.success(`Course "${courseData.name}" created successfully!`, {
        position: "top-right"
      });
      
      navigate("/courses");
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/courses");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancel}
          className="flex items-center gap-2"
        >
          <ApperIcon name="ArrowLeft" size={16} />
          Back to Courses
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Add New Course</h1>
        <p className="text-secondary">
          Create a new course to track your academic progress
        </p>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Course Name *
            </label>
            <Input
              type="text"
              placeholder="e.g., Introduction to Computer Science"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              disabled={loading}
              className="w-full"
            />
            {errors.name && (
              <p className="text-sm text-error">{errors.name}</p>
            )}
          </div>

          {/* Instructor */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Instructor *
            </label>
            <Input
              type="text"
              placeholder="e.g., Dr. Sarah Johnson"
              value={formData.instructor}
              onChange={(e) => handleInputChange("instructor", e.target.value)}
              error={errors.instructor}
              disabled={loading}
              className="w-full"
            />
            {errors.instructor && (
              <p className="text-sm text-error">{errors.instructor}</p>
            )}
          </div>

          {/* Semester and Credits Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Semester */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Semester *
              </label>
              <Select
                options={semesterOptions}
                value={formData.semester}
                onChange={(value) => handleInputChange("semester", value)}
                placeholder="Select semester"
                error={errors.semester}
                disabled={loading}
              />
              {errors.semester && (
                <p className="text-sm text-error">{errors.semester}</p>
              )}
            </div>

            {/* Credits */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Credits *
              </label>
              <Select
                options={creditOptions}
                value={formData.credits}
                onChange={(value) => handleInputChange("credits", value)}
                placeholder="Select credits"
                error={errors.credits}
                disabled={loading}
              />
              {errors.credits && (
                <p className="text-sm text-error">{errors.credits}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              placeholder="Brief description of the course content and objectives"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={loading}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  Creating Course...
                </>
              ) : (
                <>
                  <ApperIcon name="Plus" size={16} />
                  Create Course
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="flex items-center justify-center gap-2"
            >
              <ApperIcon name="X" size={16} />
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <ApperIcon name="Info" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Course Creation Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use descriptive course names that include the subject area</li>
              <li>• Include the instructor's full name and title when possible</li>
              <li>• Select the correct semester to organize your courses chronologically</li>
              <li>• Credit hours help calculate your total course load</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;