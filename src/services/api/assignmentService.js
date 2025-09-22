import { toast } from "react-toastify";

export const assignmentService = {
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "course_id_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords("assignment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error);
      toast.error("Failed to fetch assignments");
      return [];
    }
  },

  async getByCourse(courseId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "course_id_c"}}
        ],
        where: [{"FieldName": "course_id_c", "Operator": "EqualTo", "Values": [parseInt(courseId)]}]
      };
      
      const response = await apperClient.fetchRecords("assignment_c", params);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching assignments by course:", error?.response?.data?.message || error);
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "course_id_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById("assignment_c", id, params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(assignmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: assignmentData.title,
          title_c: assignmentData.title,
          description_c: assignmentData.description || "",
          due_date_c: assignmentData.dueDate,
          priority_c: assignmentData.priority || "Medium",
          completed_c: assignmentData.completed || false,
          grade_c: assignmentData.grade || 0,
          max_points_c: assignmentData.maxPoints || 100,
          category_c: assignmentData.category || "",
          course_id_c: parseInt(assignmentData.courseId)
        }]
      };
      
      const response = await apperClient.createRecord("assignment_c", params);
      
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
      console.error("Error creating assignment:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, assignmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateFields = { Id: id };
      if (assignmentData.title) {
        updateFields.Name = assignmentData.title;
        updateFields.title_c = assignmentData.title;
      }
      if (assignmentData.description !== undefined) updateFields.description_c = assignmentData.description;
      if (assignmentData.dueDate) updateFields.due_date_c = assignmentData.dueDate;
      if (assignmentData.priority) updateFields.priority_c = assignmentData.priority;
      if (assignmentData.completed !== undefined) updateFields.completed_c = assignmentData.completed;
      if (assignmentData.grade !== undefined) updateFields.grade_c = assignmentData.grade;
      if (assignmentData.maxPoints !== undefined) updateFields.max_points_c = assignmentData.maxPoints;
      if (assignmentData.category !== undefined) updateFields.category_c = assignmentData.category;
      if (assignmentData.courseId) updateFields.course_id_c = parseInt(assignmentData.courseId);
      
      const params = { records: [updateFields] };
      const response = await apperClient.updateRecord("assignment_c", params);
      
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
      console.error("Error updating assignment:", error?.response?.data?.message || error);
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
      const response = await apperClient.deleteRecord("assignment_c", params);
      
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
      console.error("Error deleting assignment:", error?.response?.data?.message || error);
      return false;
    }
  },

  async toggleComplete(id) {
    try {
      // First get current status
      const assignment = await this.getById(id);
      if (!assignment) throw new Error("Assignment not found");
      
      // Toggle completion status
      const newCompleted = !assignment.completed_c;
      return await this.update(id, { completed: newCompleted });
    } catch (error) {
      console.error("Error toggling assignment completion:", error?.response?.data?.message || error);
      throw error;
    }
  }
};