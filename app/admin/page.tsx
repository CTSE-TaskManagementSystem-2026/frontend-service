'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from './components/AdminLayout';
import OverviewTab from './components/OverviewTab';
import UsersTab from './components/UsersTab';
import ProjectsTab from './components/ProjectsTab';
import TasksTab from './components/TasksTab';

type Tab = 'Overview' | 'Users' | 'Projects' | 'Tasks';
const TABS: Tab[] = ['Overview', 'Users', 'Projects', 'Tasks'];

const TAB_ICONS: Record<Tab, string> = {
  Overview: '◈',
  Users: '⬡',
  Projects: '▣',
  Tasks: '◇',
};

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [token, setToken] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('token') ?? '';
    const role = localStorage.getItem('role') ?? '';
    if (!t || role !== 'admin') {
      router.replace('/login');
      return;
    }
    setToken(t);
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <>
      <style>{`
        .admin-tabs {
          display: flex;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          margin-bottom: 2rem;
          gap: 0.25rem;
          overflow-x: auto;
        }
        .admin-tab-btn {
          padding: 0.625rem 1.25rem;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.2s ease;
          white-space: nowrap;
          margin-bottom: -1px;
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }
        .admin-tab-active {
          color: #22d3ee;
          border-bottom-color: #22d3ee;
          font-weight: 700;
        }
        .admin-tab-inactive {
          color: #475569;
        }
        .admin-tab-inactive:hover { color: #94a3b8; }
      `}</style>

      <AdminLayout title="Admin" subtitle="TASKMASTER / ADMIN PANEL">
        {/* Tab bar */}
        <div className="admin-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`admin-tab-btn ${activeTab === tab ? 'admin-tab-active' : 'admin-tab-inactive'}`}
            >
              <span>{TAB_ICONS[tab]}</span>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'Overview' && <OverviewTab token={token} />}
        {activeTab === 'Users' && <UsersTab token={token} />}
        {activeTab === 'Projects' && <ProjectsTab token={token} />}
        {activeTab === 'Tasks' && <TasksTab token={token} />}
      </AdminLayout>
    </>
  );
}