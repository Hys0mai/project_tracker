export const STATUSES = ["Planning", "In Progress", "On Hold", "Completed"];
export const PRIORITIES = ["Low", "Medium", "High"];

export const PRIORITY_WEIGHT = { Low: 1, Medium: 2, High: 3 };
export const STATUS_ORDER = Object.fromEntries(
    STATUSES.map((s, i) => [s, i])
);