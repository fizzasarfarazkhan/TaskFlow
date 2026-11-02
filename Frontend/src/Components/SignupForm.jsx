
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(
                "https://localhost:7025/api/Authentication/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: formData.username.trim(),
                        email: formData.email.trim(),
                        password: formData.password,
                    }),
                }
            );

            const responseText = await response.text();
            let data = {};

            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch {
                data = {};
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.Message ||
                    data.title ||
                    responseText ||
                    "Registration failed. Please check your details."
                );
            }

            toast.success("Account created successfully! Please log in.");
            navigate("/");
        } catch (error) {
            console.error("Signup error:", error);

            if (error instanceof TypeError) {
                toast.error(
                    "Cannot connect to the backend. Check that it is running."
                );
            } else {
                toast.error(error.message || "Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="signup-username">Username</label>
            <input
                id="signup-username"
                type="text"
                name="username"
                placeholder="Enter your username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                required
            />

            <label htmlFor="signup-email">Email</label>
            <input
                id="signup-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
            />

            <label htmlFor="signup-password">Password</label>
            <input
                id="signup-password"
                type="password"
                name="password"
                placeholder="Create a password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
            />

            <button type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
            </button>
        </form>
    );
};

export default SignupForm;
