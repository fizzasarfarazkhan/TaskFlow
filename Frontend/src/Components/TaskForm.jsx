import React from "react";

const TaskForm = ({
    taskData,
    handleInputChange,
    handleFormSubmit,
    loading = false,
}) => {
    return (
        <form className="taskform-modern" onSubmit={handleFormSubmit}>
            <div className="form-section-card">
                <div className="form-section-header">
                    <h3>Basic Information</h3>
                    <p>Enter the core objective and comprehensive scope of this task</p>
                </div>

                <div className="taskform-field-group">
                    <div className="taskform-field full-width">
                        <label htmlFor="title">
                            Task Title <span className="required-star">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="e.g. Architect and deploy PostgreSQL database cluster"
                            value={taskData.title}
                            onChange={handleInputChange}
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
                            placeholder="Detail requirements, acceptance criteria, relevant context, and deliverables..."
                            value={taskData.description}
                            onChange={handleInputChange}
                            rows={4}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="form-section-card">
                <div className="form-section-header">
                    <h3>Execution & Priority Planning</h3>
                    <p>Assign lifecycle state, impact classification, and target deadlines</p>
                </div>

                <div className="taskform-field-grid">
                    <div className="taskform-field">
                        <label htmlFor="status">Pipeline Status</label>
                        <select
                            id="status"
                            name="status"
                            value={taskData.status}
                            onChange={handleInputChange}
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
                            value={taskData.priority}
                            onChange={handleInputChange}
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
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={taskData.dueDate}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="taskform-field">
                        <label htmlFor="category">Category Tag</label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            placeholder="e.g. Infrastructure, UI/UX, Security"
                            value={taskData.category}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="taskform-field full-width">
                        <label htmlFor="assignedToUserId">
                            Assigned To User ID <span className="optional-tag">(optional)</span>
                        </label>
                        <input
                            type="text"
                            id="assignedToUserId"
                            name="assignedToUserId"
                            placeholder="Leave empty to automatically assign to current user"
                            value={taskData.assignedToUserId}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>

            <div className="taskform-submit-row">
                <button
                    type="submit"
                    className="btn-primary-glow btn-submit-task"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-inline"></span>
                            <span>Saving Task...</span>
                        </>
                    ) : (
                        <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            <span>Create Task</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
