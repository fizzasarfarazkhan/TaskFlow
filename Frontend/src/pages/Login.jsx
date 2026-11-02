import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import LoginForm from "../Components/loginForm";

const Login = () => {
    return (
        <main className="login-page">
            <section className="login-panel">
                <div className="login-brand">
                    <div className="brand-icon">✓</div>
                    <span>TaskFlow</span>
                </div>

                <h1 className="page-title">Welcome back</h1>
                <p className="login-subtitle">
                    Sign in to manage your tasks and stay productive.
                </p>

                <LoginForm />

                <p className="signup-prompt">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </section>

            <p className="login-footer">Stay organized. Get things done.</p>
        </main>
    );
};

export default Login;