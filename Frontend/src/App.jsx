
import React from "react";
import { Routes, Route } from "react-router-dom";

import Toast from "./Components/Toast";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import TaskList from "./pages/Tasklist";
import EditTask from "./pages/EditTask";
import TaskDetail from "./pages/TaskDetail";
import NewTask from "./pages/NewTask";
import Profile from "./pages/Profile";

import "./App.css";

function App() {
    return (
        <>
            <Toast />

            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks" element={<TaskList />} />
                <Route path="/tasks/:taskId" element={<TaskDetail />} />
                <Route path="/new-task" element={<NewTask />} />
                <Route
                    path="/tasks/:taskId/edit"
                    element={<EditTask />}
                />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </>
    );
}

export default App;
