import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AppNavigation from "../Components/AppNavigation";
import "../App.css";

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [taskCounts, setTaskCounts] = useState({
        completed: 0,
        inProgress: 0,
        pending: 0,
    });

    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            try {
                const response = await fetch(
                    "https://localhost:7025/api/Dashboard",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    }
                );

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    toast.error("Please log in again.");
                    navigate("/");
                    return;
                }

                if (!response.ok) {
                    throw new Error("Could not load dashboard.");
                }

                const data = await response.json();

                setRole(data.role || "");
                setTaskCounts({
                    completed: data.taskCounts?.completed ?? 0,
                    inProgress: data.taskCounts?.inProgress ?? 0,
                    pending: data.taskCounts?.pending ?? 0,
                });
            } catch (error) {
                console.error("Dashboard error:", error);
                toast.error(error.message || "Unable to load dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [navigate, location.key]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    };

    const totalTasks = taskCounts.completed + taskCounts.inProgress + taskCounts.pending;
    const completionRate = totalTasks > 0 ? Math.round((taskCounts.completed / totalTasks) * 100) : 0;

    return (
        <main className="dashboard-container">
            <AppNavigation />

            <div className="dashboard-hero-banner">
                <div className="dashboard-hero-content">
                    <div className="dashboard-welcome-tag">
                        <span>Workspace Overview</span>
                        {role && <span className="account-role-badge">Role: {role}</span>}
                    </div>
                    <h2>Welcome to your TaskFlow command center</h2>
                    <p>Track your project delivery, manage work pipelines, and streamline daily productivity.</p>
                </div>

                <div className="dashboard-hero-actions">
                    <Link to="/new-task" className="btn-primary-glow">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>New Task</span>
                    </Link>
                    <button type="button" className="btn-secondary-outline" onClick={handleLogout}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <p className="loading-spinner">Loading your dashboard data...</p>
                </div>
            ) : (
                <>
                    <section className="dashboard-metrics-grid" aria-label="Task statistics">
                        <div className="metric-card metric-total">
                            <div className="metric-header">
                                <span className="metric-icon">📋</span>
                                <span className="metric-badge">All</span>
                            </div>
                            <div className="metric-body">
                                <h3>Total Tasks</h3>
                                <div className="metric-value">{totalTasks}</div>
                            </div>
                            <div className="metric-footer">
                                <span>Across all active categories</span>
                            </div>
                        </div>

                        <div className="metric-card metric-pending">
                            <div className="metric-header">
                                <span className="metric-icon">⏳</span>
                                <span className="metric-badge">Awaiting</span>
                            </div>
                            <div className="metric-body">
                                <h3>Pending</h3>
                                <div className="metric-value">{taskCounts.pending}</div>
                            </div>
                            <div className="metric-footer">
                                <span>Queued for kickoff</span>
                            </div>
                        </div>

                        <div className="metric-card metric-in-progress">
                            <div className="metric-header">
                                <span className="metric-icon">⚡</span>
                                <span className="metric-badge">Active</span>
                            </div>
                            <div className="metric-body">
                                <h3>In Progress</h3>
                                <div className="metric-value">{taskCounts.inProgress}</div>
                            </div>
                            <div className="metric-footer">
                                <span>Currently being worked on</span>
                            </div>
                        </div>

                        <div className="metric-card metric-completed">
                            <div className="metric-header">
                                <span className="metric-icon">✅</span>
                                <span className="metric-badge">Done</span>
                            </div>
                            <div className="metric-body">
                                <h3>Completed</h3>
                                <div className="metric-value">{taskCounts.completed}</div>
                            </div>
                            <div className="metric-footer">
                                <span>Successfully resolved</span>
                            </div>
                        </div>
                    </section>

                    <section className="dashboard-progress-section">
                        <div className="progress-card">
                            <div className="progress-header">
                                <div>
                                    <h3>Project Completion Velocity</h3>
                                    <p>Live completion rate calculated from your current task distribution</p>
                                </div>
                                <div className="progress-percentage-pill">{completionRate}% Completed</div>
                            </div>

                            <div className="progress-bar-track">
                                <div 
                                    className="progress-bar-fill" 
                                    style={{ width: `${completionRate}%` }}
                                    role="progressbar" 
                                    aria-valuenow={completionRate} 
                                    aria-valuemin="0" 
                                    aria-valuemax="100"
                                ></div>
                            </div>

                            <div className="progress-legend">
                                <div className="legend-item">
                                    <span className="legend-dot dot-completed"></span>
                                    <span>Completed ({taskCounts.completed})</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-dot dot-progress"></span>
                                    <span>In Progress ({taskCounts.inProgress})</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-dot dot-pending"></span>
                                    <span>Pending ({taskCounts.pending})</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="dashboard-navigation-section">
                        <div className="section-title-row">
                            <h3>Workflow Shortcuts</h3>
                            <span className="section-subtext">Direct navigation for everyday actions</span>
                        </div>

                        <div className="quick-action-cards">
                            <Link to="/tasks" className="quick-action-card">
                                <div className="action-card-icon-wrap icon-purple">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>
                                </div>
                                <div className="action-card-text">
                                    <h4>View & Filter Tasks</h4>
                                    <p>Search, inspect priorities, filter statuses and edit any assigned task.</p>
                                </div>
                                <span className="action-arrow">→</span>
                            </Link>

                            <Link to="/new-task" className="quick-action-card">
                                <div className="action-card-icon-wrap icon-blue">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="16"></line>
                                        <line x1="8" y1="12" x2="16" y2="12"></line>
                                    </svg>
                                </div>
                                <div className="action-card-text">
                                    <h4>Create New Task</h4>
                                    <p>Set priorities, due dates, task details and manage workloads.</p>
                                </div>
                                <span className="action-arrow">→</span>
                            </Link>

                            <Link to="/profile" className="quick-action-card">
                                <div className="action-card-icon-wrap icon-emerald">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                                <div className="action-card-text">
                                    <h4>Account Security</h4>
                                    <p>Review credentials, account email and update your secure password.</p>
                                </div>
                                <span className="action-arrow">→</span>
                            </Link>
                        </div>
                    </section>
                </>
            )}
        </main>
    );
};

export default Dashboard;
