"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";

const TABS = ["Profile", "Security"];

const labelCls = "prof-label";
const inputCls = "prof-input";
const alertCls = "prof-alert";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    bio: "",
    timezone: "UTC+5:30",
    avatar: "",
  });
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setFetchError("Not authenticated. Please log in.");
      setFetchLoading(false);
      return;
    }
    fetch("/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data._id)
          setProfile({
            name: data.name || "",
            email: data.email || "",
            role: data.role || "",
            bio: data.bio || "",
            timezone: data.timezone || "UTC+5:30",
            avatar: getInitials(data.name || "?"),
          });
        else setFetchError(data.message || "Failed to load profile");
      })
      .catch(() => setFetchError("Network error fetching profile"))
      .finally(() => setFetchLoading(false));
  }, []);

  const handleSave = async () => {
    setSaveError("");
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: profile.name, email: profile.email, bio: profile.bio }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      localStorage.setItem("name", profile.name);
      localStorage.setItem("email", profile.email);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handlePasswordChange = async () => {
    setPwError("");
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      setPwError("All password fields are required.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPwError("New passwords do not match.");
      return;
    }
    if (passwords.next.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.next,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Password update failed");
      setPasswords({ current: "", next: "", confirm: "" });
      setPwSaved(true);
      setTimeout(() => setPwSaved(false), 2500);
    } catch (err: unknown) {
      setPwError(err instanceof Error ? err.message : "Error");
    }
  };

  return (
    <>
      <style>{`
        :root {
          --color-bg-secondary:   #0d0f1a;
          --color-bg-card:        #0f1020;
          --color-text-primary:   #f1f5f9;
          --color-text-secondary: #94a3b8;
          --color-text-muted:     #475569;
          --color-accent-cyan:    #22d3ee;
          --color-dark-base:      #07080f;
          --color-border:         rgba(255,255,255,0.07);
        }

        /* ── Form elements ── */
        .prof-label {
          display: block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 0.375rem;
        }
        .prof-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          font-family: 'Manrope', sans-serif;
          font-size: 0.875rem;
          color: #f1f5f9;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .prof-input:focus  { border-color: rgba(34,211,238,0.5); }
        .prof-input::placeholder { color: #475569; }

        /* ── Alert base ── */
        .prof-alert {
          padding: 0.625rem 0.875rem;
          border-radius: 4px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.04em;
        }
        .prof-alert-success {
          background: rgba(52,211,153,0.08);
          border: 1px solid rgba(52,211,153,0.25);
          color: #34D399;
        }
        .prof-alert-error {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.25);
          color: #F87171;
        }

        /* ── Header card ── */
        .prof-header-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 6px;
        }

        /* ── Role badge ── */
        .prof-role-badge {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          color: #22d3ee;
          background: rgba(34,211,238,0.08);
          border: 1px solid rgba(34,211,238,0.2);
          padding: 2px 8px;
          border-radius: 2px;
        }

        /* ── Avatar edit button ── */
        .prof-avatar-edit {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #22d3ee;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Tabs ── */
        .prof-tabs {
          display: flex;
          border-bottom: 1px solid var(--color-border);
          margin-bottom: 1.75rem;
          overflow-x: auto;
        }
        .prof-tab-btn {
          padding: 0.625rem 1.25rem;
          background: transparent;
          border: none;
          font-family: 'Manrope', sans-serif;
          font-size: 0.875rem;
          cursor: pointer;
          transition: color 0.2s ease;
          white-space: nowrap;
          margin-bottom: -1px;
        }
        .prof-tab-btn-active {
          font-weight: 600;
          color: #f1f5f9;
          border-bottom: 2px solid #22d3ee;
        }
        .prof-tab-btn-inactive {
          font-weight: 400;
          color: #94a3b8;
          border-bottom: 2px solid transparent;
        }
        .prof-tab-btn-inactive:hover { color: #f1f5f9; }

        /* ── Panel ── */
        .prof-panel {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* ── Grid 2-col ── */
        .prof-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 540px) {
          .prof-grid-2 { grid-template-columns: 1fr; }
        }

        /* ── Save button ── */
        .prof-save-btn {
          align-self: flex-start;
          padding: 0.625rem 1.5rem;
          background: #22d3ee;
          border: none;
          border-radius: 4px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.875rem;
          letter-spacing: 0.05em;
          color: #07080f;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .prof-save-btn:hover { opacity: 0.88; }

        /* ── Disabled input ── */
        .prof-input-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ── Danger zone ── */
        .prof-danger-zone {
          margin-top: 0.5rem;
          padding: 1.25rem;
          background: rgba(239,68,68,0.05);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 4px;
        }
        .prof-danger-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          color: #ef4444;
          margin-bottom: 0.5rem;
        }
        .prof-danger-text {
          font-family: 'Manrope', sans-serif;
          font-size: 0.8rem;
          color: #94a3b8;
          margin-bottom: 0.75rem;
        }
        .prof-danger-btn {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid rgba(239,68,68,0.4);
          border-radius: 2px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          color: #ef4444;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .prof-danger-btn:hover { background: rgba(239,68,68,0.1); }

        /* ── Notification toggle ── */
        .prof-notif-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
        }
        .prof-notif-title {
          font-family: 'Manrope', sans-serif;
          font-weight: 500;
          font-size: 0.875rem;
          color: #f1f5f9;
          margin-bottom: 2px;
        }
        .prof-notif-desc {
          font-family: 'Manrope', sans-serif;
          font-size: 0.78rem;
          color: #475569;
        }

        /* ── API tokens ── */
        .prof-token-panel {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          overflow: hidden;
        }
        .prof-token-header {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--color-border);
        }
        .prof-token-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #475569;
        }
        .prof-token-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
        }
        .prof-token-name {
          font-family: 'Manrope', sans-serif;
          font-weight: 500;
          font-size: 0.875rem;
          color: #f1f5f9;
          margin-bottom: 2px;
        }
        .prof-token-meta {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          color: #475569;
        }
        .prof-revoke-btn {
          padding: 0.375rem 0.75rem;
          background: transparent;
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 2px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.06em;
          color: #ef4444;
          cursor: pointer;
          transition: background 0.2s ease;
          flex-shrink: 0;
        }
        .prof-revoke-btn:hover { background: rgba(239,68,68,0.1); }

        /* ── Generate token row ── */
        .prof-gen-panel {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }
        .prof-gen-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          color: #f1f5f9;
          margin-bottom: 1rem;
        }
        .prof-gen-btn {
          padding: 0.625rem 1rem;
          background: #22d3ee;
          border: none;
          border-radius: 4px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          color: #07080f;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
        }
      `}</style>

      <DashboardLayout title="Profile" subtitle="TASKMASTER / ACCOUNT SETTINGS">
        {fetchLoading && (
          <div
            style={{
              padding: "3rem 0",
              textAlign: "center",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "0.75rem",
              color: "#475569",
              letterSpacing: "0.1em",
            }}
          >
            LOADING PROFILE…
          </div>
        )}
        {fetchError && (
          <div
            className={`${alertCls} prof-alert-error`}
            style={{ marginBottom: "1.5rem" }}
          >
            {fetchError}
          </div>
        )}

        {/* Header card */}
        <div className="prof-header-card">
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "1.4rem",
                color: "#07080f",
                background: "linear-gradient(135deg, #22D3EE, #818CF8)",
              }}
            >
              {profile.avatar}
            </div>
            <button className="prof-avatar-edit">
              <svg
                width="10"
                height="10"
                fill="none"
                stroke="#07080F"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "#f1f5f9",
                marginBottom: "2px",
              }}
            >
              {profile.name}
            </h2>
            <div
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "0.72rem",
                color: "#475569",
                marginBottom: "0.375rem",
              }}
            >
              {profile.email}
            </div>
            <span className="prof-role-badge">
              {profile.role.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="prof-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`prof-tab-btn ${activeTab === tab ? "prof-tab-btn-active" : "prof-tab-btn-inactive"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: "600px" }}>
          {/* Profile tab */}
          {activeTab === "Profile" && (
            <div className="prof-panel">
              {saved && (
                <div className={`${alertCls} prof-alert-success`}>
                  ✓ Changes saved successfully
                </div>
              )}
              {saveError && (
                <div className={`${alertCls} prof-alert-error`}>
                  {saveError}
                </div>
              )}
              <div className="prof-grid-2">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, name: e.target.value }))
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, email: e.target.value }))
                    }
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, bio: e.target.value }))
                  }
                  rows={3}
                  className={inputCls}
                  style={{ resize: "vertical", lineHeight: 1.6 }}
                />
              </div>
              <button onClick={handleSave} className="prof-save-btn">
                Save Changes
              </button>
            </div>
          )}

          {/* Security tab */}
          {activeTab === "Security" && (
            <div className="prof-panel">
              <h3
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#f1f5f9",
                }}
              >
                Change Password
              </h3>
              {pwSaved && (
                <div className={`${alertCls} prof-alert-success`}>
                  ✓ Password updated successfully
                </div>
              )}
              {pwError && (
                <div className={`${alertCls} prof-alert-error`}>{pwError}</div>
              )}
              {(["current", "next", "confirm"] as const).map((field, i) => (
                <div key={field}>
                  <label className={labelCls}>
                    {
                      [
                        "Current Password",
                        "New Password",
                        "Confirm New Password",
                      ][i]
                    }
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwords[field]}
                    onChange={(e) =>
                      setPasswords((p) => ({ ...p, [field]: e.target.value }))
                    }
                    className={inputCls}
                  />
                </div>
              ))}
              <button onClick={handlePasswordChange} className="prof-save-btn">
                Update Password
              </button>
              <div className="prof-danger-zone">
                <div className="prof-danger-label">DANGER ZONE</div>
                <p className="prof-danger-text">
                  Permanently delete your account and all associated data.
                </p>
                <button className="prof-danger-btn">DELETE ACCOUNT</button>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
