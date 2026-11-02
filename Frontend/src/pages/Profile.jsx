import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserInfo from "../Components/UserProfile";
import LogoutButton from "../Components/LogoutButton";
import AppNavigation from "../Components/AppNavigation";
import "../App.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(
          "https://localhost:7025/api/Profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            toast.error("Please log in again.");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/");
            return;
          }

          throw new Error("Unable to load profile.");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        toast.error(error.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("Your new password must differ from your current password.");
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch(
        "https://localhost:7025/api/Profile/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        let message = "Unable to change password.";

        if (responseText) {
          try {
            const data = JSON.parse(responseText);
            message =
              data.message ||
              data.title ||
              data.detail ||
              message;
          } catch {
            message = responseText;
          }
        }

        throw new Error(message);
      }

      toast.success("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.message || "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <AppNavigation />
        <div className="loading-state">
          <p className="loading-spinner">Loading account profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <AppNavigation />
        <div className="task-empty-state">
          <p>Profile information could not be retrieved.</p>
          <Link to="/dashboard" className="detail-back-btn">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <AppNavigation />

      <div className="profile-page-header">
        <div className="breadcrumb-nav">
            <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Account Profile</span>
        </div>
        <h2>Account Settings</h2>
        <p className="profile-subtitle">Manage your personal credentials, identity roles, and access authentication.</p>
      </div>

      <div className="profile-sections-stack">
        <UserInfo
          user={{
            ...user,
            name: user.userName ?? user.username ?? user.name,
            role: localStorage.getItem("role") || "User",
          }}
        />

        <section className="form-section-card change-password-card">
          <div className="form-section-header">
            <h3>Authentication & Password Security</h3>
            <p>Keep your account secure by periodically updating your master password.</p>
          </div>

          <form onSubmit={handleChangePassword} className="password-form-grid">
            <div className="taskform-field">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
                required
              />
            </div>

            <div className="password-split-row">
              <div className="taskform-field">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  required
                />
              </div>

              <div className="taskform-field">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="password-submit-row">
              <button type="submit" className="btn-primary-glow" disabled={changingPassword}>
                {changingPassword ? "Updating Password..." : "Update Password"}
              </button>
            </div>
          </form>
        </section>

        <div className="profile-session-footer">
          <div className="session-info">
            <h4>Active Session</h4>
            <p>Signed into TaskFlow workspace via secure JWT bearer token.</p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default Profile;
