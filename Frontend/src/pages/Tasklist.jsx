import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TaskCard from "../Components/TaskCard";
import TaskListHeader from "../Components/TaskListHeader";
import AppNavigation from "../Components/AppNavigation";
import "../App.css";

const API_URL = "https://localhost:7025/api/Task";

const normalizeStatus = (value = "") =>
    String(value).replace(/[\s_-]/g, "").toLowerCase();

const TaskList = () => {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [filters, setFilters] = useState({
        status: "",
        priority: "",
        search: "",
        sortBy: "newest",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/", { replace: true });
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await fetch(API_URL, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    toast.error("Please log in again.");
                    navigate("/", { replace: true });
                    return;
                }

                if (!response.ok) {
                    throw new Error(
                        `Could not load tasks (HTTP ${response.status}).`
                    );
                }

                const data = await response.json();
                const taskArray = Array.isArray(data)
                    ? data
                    : data.tasks ?? data.Tasks ?? data.$values;

                if (!Array.isArray(taskArray)) {
                    throw new Error(
                        "The API response format is different from the expected task list."
                    );
                }

                setTasks(taskArray);
            } catch (err) {
                console.error("Fetch tasks error:", err);
                setError(err.message || "Could not load tasks.");
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [navigate]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        setFilters((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleClearFilters = () => {
        setFilters({ status: "", priority: "", search: "", sortBy: "newest" });
    };

    const filteredTasks = tasks.filter((task) => {
        const status = task.status ?? task.Status ?? "";
        const priority = task.priority ?? task.Priority ?? "";
        const title = task.title ?? task.Title ?? "";

        const matchesStatus =
            !filters.status ||
            normalizeStatus(status) === normalizeStatus(filters.status);

        const matchesPriority =
            !filters.priority ||
            String(priority).toLowerCase() ===
            filters.priority.toLowerCase();

        const matchesSearch = String(title)
            .toLowerCase()
            .includes(filters.search.trim().toLowerCase());

        return matchesStatus && matchesPriority && matchesSearch;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (filters.sortBy === "title") {
            const titleA = (a.title ?? a.Title ?? "").toLowerCase();
            const titleB = (b.title ?? b.Title ?? "").toLowerCase();
            return titleA.localeCompare(titleB);
        }
        if (filters.sortBy === "priority") {
            const pMap = { high: 3, medium: 2, low: 1 };
            const pA = pMap[String(a.priority ?? a.Priority ?? "").toLowerCase()] || 0;
            const pB = pMap[String(b.priority ?? b.Priority ?? "").toLowerCase()] || 0;
            return pB - pA;
        }
        // Default newest
        const idA = a.id ?? a.Id ?? 0;
        const idB = b.id ?? b.Id ?? 0;
        return idB - idA;
    });

    return (
        <main className="tasklist-container">
            <AppNavigation />
            <TaskListHeader />

            <div className="task-filters-bar">
                <div className="task-search-wrapper">
                    <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="search"
                        name="search"
                        placeholder="Search tasks by name or keyword..."
                        aria-label="Search tasks by title"
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                </div>

                <div className="task-select-filters">
                    <select
                        name="status"
                        aria-label="Filter by status"
                        value={filters.status}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>

                    <select
                        name="priority"
                        aria-label="Filter by priority"
                        value={filters.priority}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Priorities</option>
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                    </select>

                    <select
                        name="sortBy"
                        aria-label="Sort tasks"
                        value={filters.sortBy}
                        onChange={handleFilterChange}
                    >
                        <option value="newest">Sort: Newest First</option>
                        <option value="priority">Sort: Highest Priority</option>
                        <option value="title">Sort: Title (A-Z)</option>
                    </select>

                    {(filters.search || filters.status || filters.priority || filters.sortBy !== "newest") && (
                        <button
                            type="button"
                            className="clear-filters-btn"
                            onClick={handleClearFilters}
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {!loading && !error && (
                <div className="task-results-summary">
                    <span className="task-results-count" aria-live="polite">
                        Displaying <strong>{sortedTasks.length}</strong> of {tasks.length} tasks
                    </span>
                    {filters.status && <span className="active-filter-pill">Status: {filters.status}</span>}
                    {filters.priority && <span className="active-filter-pill">Priority: {filters.priority}</span>}
                </div>
            )}

            {loading ? (
                <div className="loading-state">
                    <p className="loading-spinner" role="status">Loading tasks from workspace...</p>
                </div>
            ) : error ? (
                <div className="task-error" role="alert">
                    <div className="error-icon">⚠️</div>
                    <h3>Failed to load tasks</h3>
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                    >
                        Retry Loading
                    </button>
                </div>
            ) : sortedTasks.length === 0 ? (
                <div className="task-empty-state">
                    <div className="empty-icon">📁</div>
                    <h3>
                        {tasks.length === 0
                            ? "No tasks created yet"
                            : "No tasks match your filter criteria"}
                    </h3>
                    <p>
                        {tasks.length === 0
                            ? "Get started by generating your first workspace task to manage your backlog."
                            : "Try clearing search queries or selecting different status/priority filters."}
                    </p>

                    {tasks.length === 0 ? (
                        <Link to="/new-task" className="create-task-button">
                            + Create First Task
                        </Link>
                    ) : (
                        <button
                            type="button"
                            className="clear-filters-action"
                            onClick={handleClearFilters}
                        >
                            Reset All Filters
                        </button>
                    )}
                </div>
            ) : (
                <section className="task-cards" aria-label="Your tasks">
                    {sortedTasks.map((task) => (
                        <TaskCard
                            key={task.id ?? task.Id}
                            task={task}
                        />
                    ))}
                </section>
            )}
        </main>
    );
};

export default TaskList;
