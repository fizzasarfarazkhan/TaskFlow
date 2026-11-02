import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import TaskForm from "../Components/TaskForm";
import AppNavigation from "../Components/AppNavigation";
import "../App.css";

const NewTask = () => {
    const navigate = useNavigate();

    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        status: "Pending",
        priority: "Medium",
        dueDate: "",
        category: "",
        assignedToUserId: "",
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setTaskData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please log in before creating a task.");
            navigate("/");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                title: taskData.title.trim(),
                description: taskData.description.trim(),
                status: taskData.status,
                priority: taskData.priority,
                dueDate: taskData.dueDate
                    ? new Date(`${taskData.dueDate}T12:00:00`).toISOString()
                    : null,
                category: taskData.category.trim(),
                assignedToUserId: taskData.assignedToUserId.trim() || null,
            };

            const response = await fetch("https://localhost:7025/api/Task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const responseText = await response.text();
            let data = {};

            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch {
                data = {};
            }

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                toast.error("Your session has expired. Please log in again.");
                navigate("/");
                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.Message ||
                    data.title ||
                    responseText ||
                    "Could not create the task."
                );
            }

            toast.success("Task created successfully!");
            navigate("/tasks");
        } catch (error) {
            console.error("Create task error:", error);

            toast.error(
                error instanceof TypeError
                    ? "Could not connect to the backend. Check that it is running."
                    : error.message || "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="newtask-container">
            <AppNavigation />

            <div className="form-page-header">
                <div className="breadcrumb-nav">
                    <Link to="/tasks" className="breadcrumb-link">My Tasks</Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">New Task</span>
                </div>
                <h2>Create New Task</h2>
                <p>Define task details, assign urgency levels, set target milestones, and assign members.</p>
            </div>

            <TaskForm
                taskData={taskData}
                handleInputChange={handleInputChange}
                handleFormSubmit={handleFormSubmit}
                loading={loading}
            />
        </div>
    );
};

export default NewTask;
