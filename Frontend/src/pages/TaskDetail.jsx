import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import TaskDetailCard from "../Components/TaskDetailCard";
import AppNavigation from "../Components/AppNavigation";
import ConfirmationModal from "../Components/ConfirmationModal";
import "../App.css";

const TaskDetail = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchTaskDetail = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `https://localhost:7025/api/Task/${taskId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
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
                    throw new Error(
                        response.status === 404
                            ? "Task not found."
                            : `Could not load task (HTTP ${response.status}).`
                    );
                }

                const data = await response.json();
                setTask(data);
            } catch (err) {
                console.error("Fetch task detail error:", err);
                setError(err.message || "Could not load task details.");
            } finally {
                setLoading(false);
            }
        };

        fetchTaskDetail();
    }, [taskId, navigate]);

    const handleOpenDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        if (!deleting) {
            setShowDeleteModal(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (deleting) return;

        const token = localStorage.getItem("token");

        if (!token) {
            setShowDeleteModal(false);
            navigate("/");
            return;
        }

        try {
            setDeleting(true);

            const response = await fetch(
                `https://localhost:7025/api/Task/${taskId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 401 || response.status === 403) {
                setShowDeleteModal(false);
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                toast.error("Please log in again.");
                navigate("/");
                return;
            }

            if (!response.ok) {
                const message = await response.text();
                throw new Error(
                    message || `Could not delete task (HTTP ${response.status}).`
                );
            }

            setShowDeleteModal(false);
            toast.success("Task deleted successfully!");
            navigate("/tasks");
        } catch (err) {
            console.error("Delete task error:", err);
            toast.error(err.message || "Could not delete task.");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="taskdetail-container">
                <AppNavigation />
                <div className="loading-state">
                    <p className="loading-spinner">Retrieving task details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="taskdetail-container">
                <AppNavigation />
                <div className="task-error" role="alert">
                    <p>{error}</p>
                    <Link to="/tasks" className="detail-back-btn">← Back to Tasks</Link>
                </div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="taskdetail-container">
                <AppNavigation />
                <div className="task-empty-state">
                    <p>Task could not be found or has been removed.</p>
                    <Link to="/tasks" className="detail-back-btn">← Back to Tasks</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="taskdetail-container">
            <AppNavigation />

            <div className="detail-header-row">
                <div className="breadcrumb-nav">
                    <Link to="/tasks" className="breadcrumb-link">My Tasks</Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">Task #{taskId}</span>
                </div>

                <div className="taskdetail-actions">
                    <Link to={`/tasks/${taskId}/edit`} className="detail-edit-btn">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                        <span>Edit Task</span>
                    </Link>
                    <Link to="/tasks" className="detail-back-btn">
                        <span>← Back</span>
                    </Link>
                </div>
            </div>

            <TaskDetailCard
                task={task}
                onDelete={handleOpenDeleteModal}
                deleting={deleting}
            />

            <ConfirmationModal
                isOpen={showDeleteModal}
                title="Delete Task?"
                message="Are you sure you want to delete this task? This action cannot be undone."
                confirmText="Delete Task"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
                isLoading={deleting}
            />
        </div>
    );
};

export default TaskDetail;
