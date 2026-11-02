import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AppNavigation from "../Components/AppNavigation";
import "../App.css";

const API_URL = "https://localhost:7025/api/Task";

const EditTask = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "Pending",
        priority: "Medium",
        dueDate: "",
        category: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadTask = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/${taskId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    toast.error("Please log in again.");
                    navigate("/");
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Could not load task (HTTP ${response.status}).`);
                }

                const task = await response.json();

                setFormData({
                    title: task.title ?? task.Title ?? "",
                    description: task.description ?? task.Description ?? "",
                    status: task.status ?? task.Status ?? "Pending",
                    priority: task.priority ?? task.Priority ?? "Medium",
                    dueDate: (task.dueDate ?? task.DueDate ?? "").slice(0, 10),
                    category: task.category ?? task.Category ?? "",
                });
            } catch (err) {
                console.error("Load task error:", err);
                setError(err.message || "Could not load task.");
            } finally {
                setLoading(false);
            }
        };

        loadTask();
    }, [taskId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                status: formData.status,
                priority: formData.priority,
                dueDate: formData.dueDate
                    ? new Date(`${formData.dueDate}T12:00:00`).toISOString()
                    : null,
                category: formData.category.trim(),
            };

            const response = await fetch(`${API_URL}/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const responseText = await response.text();

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                toast.error("Please log in again.");
                navigate("/");
                return;
            }

            if (!response.ok) {
                throw new Error(
                    responseText || `Could not update task (HTTP ${response.status}).`
                );
            }

            toast.success("Task updated successfully!");
            navigate(`/tasks/${taskId}`);
        } catch (err) {
            console.error("Update task error:", err);
            setError(err.message || "Could not update task.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="newtask-container">
                <AppNavigation />
                <div className="loading-state">
                    <p className="loading-spinner">Loading task information...</p>
                </div>
            </div>
        );
    }

    if (error && !formData.title && !saving) {
        return (
            <div className="newtask-container">
                <AppNavigation />
                <div className="task-error" role="alert">
                    <p>{error}</p>
                    <Link to="/tasks" className="detail-back-btn">← Back to Tasks</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="newtask-container">
            <AppNavigation />

            <div className="form-page-header">
                <div className="breadcrumb-nav">
                    <Link to="/tasks" className="breadcrumb-link">My Tasks</Link>
                    <span className="breadcrumb-separator">/</span>
                    <Link to={`/tasks/${taskId}`} className="breadcrumb-link">Task #{taskId}</Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">Edit</span>
                </div>
                <h2>Edit Task</h2>
                <p>Modify task specifications, adjust priority, or update progression state.</p>
            </div>

            {error && <p role="alert" className="form-error-banner">{error}</p>}

            <form className="taskform-modern" onSubmit={handleSubmit}>
                <div className="form-section-card">
                    <div className="form-section-header">
                        <h3>Task Details</h3>
                        <p>Core identity and objective description</p>
                    </div>

                    <div className="taskform-field-group">
                        <div className="taskform-field full-width">
                            <label htmlFor="title">
                                Task Title <span className="required-star">*</span>
                            </label>
                            <input
                                id="title"
                                name="title"
                                placeholder="Task title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="taskform-field full-width">
                            <label htmlFor="description">
                                Description & Deliverables <span className="required-star">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Provide comprehensive details about this task"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section-card">
                    <div className="form-section-header">
                        <h3>Configuration</h3>
                        <p>Pipeline lifecycle status, priority level, and timeline</p>
                    </div>

                    <div className="taskform-field-grid">
                        <div className="taskform-field">
                            <label htmlFor="status">Pipeline Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="Pending">⏳ Pending</option>
                                <option value="In Progress">⚡ In Progress</option>
                                <option value="Completed">✅ Completed</option>
                            </select>
                        </div>

                        <div className="taskform-field">
                            <label htmlFor="priority">Urgency & Priority</label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                required
                            >
                                <option value="Low">🟢 Low Priority</option>
                                <option value="Medium">🟡 Medium Priority</option>
                                <option value="High">🔴 High Priority</option>
                            </select>
                        </div>

                        <div className="taskform-field">
                            <label htmlFor="dueDate">Target Completion Date</label>
                            <input
                                id="dueDate"
                                name="dueDate"
                                type="date"
                                value={formData.dueDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="taskform-field">
                            <label htmlFor="category">Category Tag</label>
                            <input
                                id="category"
                                name="category"
                                placeholder="e.g. Work, Marketing, Backend"
                                value={formData.category}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="taskform-submit-row">
                    <button className="btn-primary-glow btn-submit-task" type="submit" disabled={saving}>
                        {saving ? (
                            <>
                                <span className="spinner-inline"></span>
                                <span>Saving Changes...</span>
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>

                    <Link to={`/tasks/${taskId}`} className="btn-secondary-outline">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default EditTask;
