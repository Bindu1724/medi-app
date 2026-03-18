// src/utils/badgeUtils.js
const getBadgeClass = (status) => {
  switch (status) {
    case "taken":
      return "badge bg-success";
    case "pending":
      return "badge bg-warning text-dark";
    case "missed":
      return "badge bg-danger";
    default:
      return "badge bg-secondary";
  }
};

export default getBadgeClass;