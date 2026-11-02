import React from "react";
import { Link } from "react-router-dom";

const TaskListHeader = () => {
    return (
        <header className="tasklist-header">
            <div className="tasklist-heading">
                <h2>Task Repository</h2>
                <p>Monitor your active backlog, manage deliverables, and filter by pipeline state.</p>
            </div>

            <Link to="/new-task" className="btn-primary-glow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Create New Task</span>
            </Link>
        </header>
    );
};

export default TaskListHeader;
