import React from "react";
import { Link, useLocation } from "react-router-dom";

const AppNavigation = () => {
    const location = useLocation();

    return (
        <header className="app-nav-wrapper">
            <nav className="app-navigation" aria-label="Main navigation">
                <Link to="/dashboard" className="app-nav-brand">
                    <span className="app-nav-logo">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </span>
                    <span className="app-nav-brandname">TaskFlow</span>
                    <span className="app-nav-tag">Workspace</span>
                </Link>

                <div className="app-nav-links">
                    <Link
                        to="/dashboard"
                        className={location.pathname === "/dashboard" ? "active" : ""}
                    >
                        <span className="nav-icon">📊</span>
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        to="/tasks"
                        className={location.pathname === "/tasks" ? "active" : ""}
                    >
                        <span className="nav-icon">📋</span>
                        <span>My Tasks</span>
                    </Link>
                    <Link
                        to="/new-task"
                        className={location.pathname === "/new-task" ? "active" : ""}
                    >
                        <span className="nav-icon">✨</span>
                        <span>Create Task</span>
                    </Link>
                    <Link
                        to="/profile"
                        className={location.pathname === "/profile" ? "active" : ""}
                    >
                        <span className="nav-icon">👤</span>
                        <span>Profile</span>
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default AppNavigation;
