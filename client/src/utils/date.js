const parse = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
};

export function todayISO() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
}

export function formatDate(iso) {
    if (!iso) return "—";
    return parse(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function daysUntil(iso) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((parse(iso) - start) / 86400000);
}

export function dueInfo(project) {
    if (project.status === "Completed" || !project.due_date) return null;
    const n = daysUntil(project.due_date);
    if (n < 0) return { label: `${Math.abs(n)}d overdue`, tone: "danger" };
    if (n === 0) return { label: "Due today", tone: "warning" };
    if (n <= 7) return { label: `${n}d left`, tone: "warning" };
    return null;
}