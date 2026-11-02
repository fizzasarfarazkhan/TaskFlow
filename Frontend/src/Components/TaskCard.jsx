import React from "react";
import { Link } from "react-router-dom";

const TaskCard = ({ task }) => {
    const id = task.id ?? task.Id;
    const title = task.title ?? task.Title ?? "Untitled Task";
    const description = task.description ?? task.Description ?? "";
    const priority = task.priority ?? task.Priority ?? "Not specified";
    const status = task.status ?? task.Status ?? "Not specified";
    const dueDate = task.dueDate ?? task.DueDate;
    const category = task.category ?? task.Category;

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

    const formattedDate = dueDate ? String(dueDate).slice(0, 10) : null;

    return (
        <div className="taskcard">
            <div className="taskcard-top">
                <div className="taskcard-badges">
                    <span className={getPriorityClass(priority)}>
                        <span className="badge-bullet"></span>
                        {priority}
                    </span>
                    <span className={getStatusClass(status)}>
                        {status}
                    </span>
                </div>
                {category && <span className="taskcard-category">{category}</span>}
            </div>

            <h3 className="taskcard-title">{title}</h3>

            {description && (
                <p className="taskcard-description">
                    {description.length > 120 ? `${description.slice(0, 120)}...` : description}
                </p>
            )}

            <div className="taskcard-footer">
                <div className="taskcard-due">
                    {formattedDate ? (
                        <>
                            <span className="due-icon">📅</span>
                            <span>Due {formattedDate}</span>
                        </>
                    ) : (
                        <span className="due-none">No deadline</span>
                    )}
                </div>

                <Link to={`/tasks/${id}`} className="task-detail-link">
                    <span>Inspect</span>
                    <span className="arrow-icon">→</span>
                </Link>
            </div>
        </div>
    );
};

export default TaskCard;
