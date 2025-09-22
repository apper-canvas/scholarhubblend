import coursesData from "@/services/mockData/courses.json";

let courses = [...coursesData];
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const courseService = {
  async getAll() {
    await delay(300);
    return [...courses];
  },

  async getById(id) {
    await delay(200);
    const course = courses.find(c => c.Id === parseInt(id));
    if (!course) {
      throw new Error("Course not found");
    }
    return { ...course };
  },

  async create(courseData) {
    await delay(400);
    const newCourse = {
      ...courseData,
      Id: Math.max(...courses.map(c => c.Id)) + 1,
      currentGrade: 0
    };
    courses.push(newCourse);
    return { ...newCourse };
  },

  async update(id, courseData) {
    await delay(350);
    const index = courses.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    courses[index] = { ...courses[index], ...courseData };
    return { ...courses[index] };
  },

  async delete(id) {
    await delay(250);
    const index = courses.findIndex(c => c.Id === parseInt(id));
if (index === -1) {
      throw new Error("Course not found");
    }
    courses.splice(index, 1);
    return true;
  },

  async getAllWithSchedule() {
    await delay(300);
    return courses.map(course => ({ ...course }));
  },

  async updateSchedule(courseId, scheduleSlot) {
    await delay(300);
    const courseIndex = courses.findIndex(c => c.Id === parseInt(courseId));
    if (courseIndex === -1) {
      throw new Error("Course not found");
    }

    if (!courses[courseIndex].schedule) {
      courses[courseIndex].schedule = [];
    }

    // Remove existing schedule for same day/time
    courses[courseIndex].schedule = courses[courseIndex].schedule.filter(
      slot => !(slot.day === scheduleSlot.day && slot.startTime === scheduleSlot.startTime)
    );

    // Add new schedule slot
    courses[courseIndex].schedule.push(scheduleSlot);
    return { ...courses[courseIndex] };
  },

  async removeFromSchedule(courseId, day, startTime) {
    await delay(200);
    const courseIndex = courses.findIndex(c => c.Id === parseInt(courseId));
    if (courseIndex === -1) {
      throw new Error("Course not found");
    }

    if (courses[courseIndex].schedule) {
      courses[courseIndex].schedule = courses[courseIndex].schedule.filter(
        slot => !(slot.day === day && slot.startTime === startTime)
);
    }
    return true;
  }
};