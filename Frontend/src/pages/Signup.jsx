
import React from "react";
import { Link } from "react-router-dom";
import SignupForm from "../Components/SignupForm";
import "../App.css";

const Signup = () => {
    return (
        <main className="signup-container">
            <section className="signup-panel">
                <div className="signup-brand">
                    <div className="signup-brand-icon">✓</div>
                    <span>TaskFlow</span>
                </div>

                <h1 className="signup-heading">Create your account</h1>

                <p className="signup-subtitle">
                    Sign up to organize and manage your tasks.
                </p>

                <SignupForm />

                <p className="signup-login-prompt">
                    Already have an account? <Link to="/">Login</Link>
                </p>
            </section>
        </main>
    );
};

export default Signup;
