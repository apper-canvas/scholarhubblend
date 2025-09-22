// GPA calculation utilities
export const calculateGPA = (courses) => {
  if (!courses || courses.length === 0) return 0;
  
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  const totalPoints = courses.reduce((sum, course) => {
    const gradePoints = gradeToPoints(course.currentGrade);
    return sum + (gradePoints * course.credits);
  }, 0);
  
  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
};

export const gradeToPoints = (grade) => {
  if (grade >= 97) return 4.0;
  if (grade >= 93) return 3.7;
  if (grade >= 90) return 3.3;
  if (grade >= 87) return 3.0;
  if (grade >= 83) return 2.7;
  if (grade >= 80) return 2.3;
  if (grade >= 77) return 2.0;
  if (grade >= 73) return 1.7;
  if (grade >= 70) return 1.3;
  if (grade >= 67) return 1.0;
  if (grade >= 65) return 0.7;
  return 0.0;
};

export const getLetterGrade = (grade) => {
  if (grade >= 97) return "A+";
  if (grade >= 93) return "A";
  if (grade >= 90) return "A-";
  if (grade >= 87) return "B+";
  if (grade >= 83) return "B";
  if (grade >= 80) return "B-";
  if (grade >= 77) return "C+";
  if (grade >= 73) return "C";
  if (grade >= 70) return "C-";
  if (grade >= 67) return "D+";
  if (grade >= 65) return "D";
  return "F";
};

export const calculateCourseGrade = (assignments, categories) => {
  if (!assignments || assignments.length === 0) return 0;
  
  let totalWeightedScore = 0;
  let totalWeight = 0;
  
  categories.forEach(category => {
    const categoryAssignments = assignments.filter(a => a.category === category.name);
    if (categoryAssignments.length > 0) {
      const categoryAverage = categoryAssignments.reduce((sum, assignment) => {
        return sum + (assignment.grade / assignment.maxPoints * 100);
      }, 0) / categoryAssignments.length;
      
      totalWeightedScore += categoryAverage * (category.weight / 100);
      totalWeight += category.weight / 100;
    }
  });
  
  return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
};