import gradeCategoriesData from "@/services/mockData/gradeCategories.json";

let gradeCategories = [...gradeCategoriesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const gradeCategoryService = {
  async getAll() {
    await delay(200);
    return [...gradeCategories];
  },

  async getByCourse(courseId) {
    await delay(200);
    return gradeCategories.filter(gc => gc.courseId === parseInt(courseId));
  },

  async getById(id) {
    await delay(150);
    const category = gradeCategories.find(gc => gc.Id === parseInt(id));
    if (!category) {
      throw new Error("Grade category not found");
    }
    return { ...category };
  },

  async create(categoryData) {
    await delay(300);
    const newCategory = {
      ...categoryData,
      Id: Math.max(...gradeCategories.map(gc => gc.Id)) + 1
    };
    gradeCategories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, categoryData) {
    await delay(300);
    const index = gradeCategories.findIndex(gc => gc.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade category not found");
    }
    gradeCategories[index] = { ...gradeCategories[index], ...categoryData };
    return { ...gradeCategories[index] };
  },

  async delete(id) {
    await delay(200);
    const index = gradeCategories.findIndex(gc => gc.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade category not found");
    }
    gradeCategories.splice(index, 1);
    return true;
  }
};