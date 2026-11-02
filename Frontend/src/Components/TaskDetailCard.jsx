import React from "react";

const TaskDetailCard = ({ task, onDelete, deleting = false }) => {
    if (!task) return null;

    const title = task.title ?? task.Title ?? "Untitled Task";
    const description = task.description ?? task.Description ?? "No description provided.";
    const priority = task.priority ?? task.Priority ?? "Not specified";
    const status = task.status ?? task.Status ?? "Not specified";
    const dueDate = task.dueDate ?? task.DueDate;
    const category = task.category ?? task.Category;
    const assignedTo =
        task.assignedTo ??
        task.AssignedTo ??
        task.assignedToUserId ??
        task.AssignedToUserId;

    const getStatusClass = (statusStr) => {
        const s = String(statusStr).toLowerCase().replace(/[\s_-]/g, "");
        if (s.includes("completed")) return "status-badge status-completed";
        if (s.includes("progress")) return "status-badge status-in-progress";
        return "status-badge status-pending";
    };

    const getPriorityClass = (priorityStr) => {
        const p = String(priorityStr).toLowerCase();
        if (p === "high") return "priority-badge priority-high";
        if (p === "medium") return "priority-badge priority-medium";
        return "priority-badge priority-low";
    };

    return (
        <div className="task-detail-card">
            <div className="detail-meta-header">
                <div className="detail-badges-row">
                    <span className={getPriorityClass(priority)}>
                        <span className="badge-bullet"></span>
                        {priority} Priority
                    </span>
                    <span className={getStatusClass(status)}>
                        {status}
                    </span>
                    {category && <span className="detail-category-pill">{category}</span>}
                </div>
            </div>

            <h1 className="detail-task-title">{title}</h1>

            <div className="detail-content-grid">
                <div className="detail-main-content">
                    <div className="detail-card-panel">
                        <h3 className="panel-title">Task Description</h3>
                        <p className="detail-description-text">{description}</p>
                    </div>
                </div>

                <div className="detail-sidebar-content">
                    <div className="detail-card-panel">
                        <h3 className="panel-title">Metadata & Assignment</h3>
                        
                        <div className="detail-attribute-list">
                            <div className="attribute-item">
                                <span className="attr-label">Due Date</span>
                                <span className="attr-val">
                                    {dueDate ? (
                                        <span className="attr-date-highlight">
                                            📅 {String(dueDate).slice(0, 10)}
                                        </span>
                                    ) : (
                                        <span className="attr-muted">No deadline specified</span>
                                    )}
                                </span>
                            </div>

                            <div className="attribute-item">
                                <span className="attr-label">Assigned User ID</span>
                                <span className="attr-val">
                                    {assignedTo ? (
                                        <span className="attr-id-badge">#{assignedTo}</span>
                                    ) : (
                                        <span className="attr-muted">Unassigned / Self</span>
                                    )}
                                </span>
                            </div>

                            <div className="attribute-item">
                                <span className="attr-label">Category</span>
                                <span className="attr-val">{category || "General"}</span>
                            </div>
                        </div>

                        {onDelete && (
                            <div className="detail-danger-zone">
                                <span className="danger-zone-label">Danger Zone</span>
                                <button
                                    type="button"
                                    className="btn-delete-trigger"
                                    onClick={onDelete}
                                    disabled={deleting}
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                    <span>{deleting ? "Deleting..." : "Delete This Task"}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailCard;
