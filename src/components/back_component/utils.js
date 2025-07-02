export const getRole = (role) => {
  const roles = {
    1: "Admin",
    2: "Secretarya",
    3: "Teacher",
    4: "Logistic",
    5: "Student",
    6: "Guest",
  };
  return roles[role] || "Unknown";
};

export function getWeekDayName(dateString) {
  const date = new Date(dateString);
  const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return shortDays[date.getDay()];
}
