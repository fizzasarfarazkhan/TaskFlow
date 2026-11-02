import React from "react";

const UserInfo = ({ user }) => {
    const name =
        user.name ??
        user.Name ??
        user.username ??
        user.Username ??
        user.userName ??
        user.UserName ??
        "";

    const email = user.email ?? user.Email ?? "";

    const role =
        user.role ??
        user.Role ??
        user.roleName ??
        user.RoleName ??
        "";

    const initial = (name || email || "U").charAt(0).toUpperCase();

    return (
        <div className="user-profile-header-card">
            <div className="user-avatar-pill">
                <span className="avatar-letter">{initial}</span>
                <span className="online-indicator" title="Active"></span>
            </div>

            <div className="user-profile-meta">
                <div className="user-name-row">
                    <h3 className="user-display-name">{name || "Workspace Member"}</h3>
                    <span className="account-role-pill">
                        <span className="role-dot"></span>
                        {role || "User"}
                    </span>
                </div>
                <p className="user-display-email">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>{email || "No email available"}</span>
                </p>
            </div>
        </div>
    );
};

export default UserInfo;
