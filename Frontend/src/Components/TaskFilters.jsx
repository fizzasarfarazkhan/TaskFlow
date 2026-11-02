// src/components/TaskFilters.jsx
import React from 'react';

const TaskFilters = ({ filters, onChange }) => {
  return (
    <div className="task-filters">
      <select name="status" value={filters.status} onChange={onChange}>
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="InProgress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <select name="priority" value={filters.priority} onChange={onChange}>
        <option value="">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div>
  );
};

export default TaskFilters;
