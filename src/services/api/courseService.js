import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

export const courseService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "current_grade_c"}},
          {"field": {"Name": "schedule_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords("course_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data?.message || error);
      toast.error("Failed to fetch courses");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "current_grade_c"}},
          {"field": {"Name": "schedule_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById("course_c", id, params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(courseData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: courseData.name,
          name_c: courseData.name,
          instructor_c: courseData.instructor,
          credits_c: parseInt(courseData.credits),
          semester_c: courseData.semester,
          color_c: courseData.color || "#2563EB",
          current_grade_c: courseData.currentGrade || 0,
          schedule_c: courseData.schedule ? JSON.stringify(courseData.schedule) : ""
        }]
      };
      
      const response = await apperClient.createRecord("course_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      return null;
    } catch (error) {
      console.error("Error creating course:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, courseData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateFields = { Id: id };
      if (courseData.name) {
        updateFields.Name = courseData.name;
        updateFields.name_c = courseData.name;
      }
      if (courseData.instructor) updateFields.instructor_c = courseData.instructor;
      if (courseData.credits) updateFields.credits_c = parseInt(courseData.credits);
      if (courseData.semester) updateFields.semester_c = courseData.semester;
      if (courseData.color) updateFields.color_c = courseData.color;
      if (courseData.currentGrade !== undefined) updateFields.current_grade_c = courseData.currentGrade;
      if (courseData.schedule) updateFields.schedule_c = JSON.stringify(courseData.schedule);
      
      const params = { records: [updateFields] };
      const response = await apperClient.updateRecord("course_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      return null;
    } catch (error) {
      console.error("Error updating course:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = { RecordIds: [id] };
      const response = await apperClient.deleteRecord("course_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return failed.length === 0;
      }
      return true;
    } catch (error) {
      console.error("Error deleting course:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getAllWithSchedule() {
    return await this.getAll();
  },

  async updateSchedule(courseId, scheduleSlot) {
    // Get current course data
    const course = await this.getById(courseId);
    if (!course) throw new Error("Course not found");
    
    let schedule = [];
    if (course.schedule_c) {
      try {
        schedule = JSON.parse(course.schedule_c);
      } catch (e) {
        schedule = [];
      }
    }
    
    // Remove existing schedule for same day/time
    schedule = schedule.filter(
      slot => !(slot.day === scheduleSlot.day && slot.startTime === scheduleSlot.startTime)
    );
    
    // Add new schedule slot
    schedule.push(scheduleSlot);
    
    return await this.update(courseId, { schedule });
  },

  async removeFromSchedule(courseId, day, startTime) {
    // Get current course data
    const course = await this.getById(courseId);
    if (!course) throw new Error("Course not found");
    
    let schedule = [];
    if (course.schedule_c) {
      try {
        schedule = JSON.parse(course.schedule_c);
      } catch (e) {
        schedule = [];
      }
    }
    
    // Remove matching schedule slot
    schedule = schedule.filter(
      slot => !(slot.day === day && slot.startTime === startTime)
    );
    
await this.update(courseId, { schedule });
    return true;
  }
};