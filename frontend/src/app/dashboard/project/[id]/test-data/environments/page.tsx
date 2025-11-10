'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProjectSidebar from '../../../../../components/ProjectSidebar';

interface Environment {
  id: number;
  name: string;
  description: string;
  url: string;
  status: 'active' | 'inactive';
  lastModified: string;
  createdBy: string;
}

export default function EnvironmentsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnvironments, setSelectedEnvironments] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showOverflowMenu, setShowOverflowMenu] = useState<number | null>(null);

  useEffect(() => {
    // Load project from localStorage
    const savedProjects = localStorage.getItem('testgenie-projects');
    if (savedProjects) {
      try {
        const projects = JSON.parse(savedProjects);
        const projectData = projects.find((p: any) => p.id.toString() === projectId);
        if (projectData) {
          setProject(projectData);
        }
      } catch (error) {
        console.error('Error loading project:', error);
      }
    }

    // Load environments from localStorage
    const savedEnvironments = localStorage.getItem(`testgenie-environments-${projectId}`);
    if (savedEnvironments) {
      try {
        setEnvironments(JSON.parse(savedEnvironments));
      } catch (error) {
        console.error('Error loading environments from localStorage:', error);
      }
    }
    setLoading(false);
  }, [projectId]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEnvironments(environments.map(env => env.id));
    } else {
      setSelectedEnvironments([]);
    }
  };

  const handleSelectEnvironment = (envId: number, checked: boolean) => {
    if (checked) {
      setSelectedEnvironments(prev => [...prev, envId]);
    } else {
      setSelectedEnvironments(prev => prev.filter(id => id !== envId));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedEnvironments.length === 0) return;
    
    const updatedEnvironments = environments.filter(env => !selectedEnvironments.includes(env.id));
    setEnvironments(updatedEnvironments);
    localStorage.setItem(`testgenie-environments-${projectId}`, JSON.stringify(updatedEnvironments));
    setSelectedEnvironments([]);
    setShowBulkActions(false);
  };

  const handleDeleteEnvironment = (envId: number) => {
    const updatedEnvironments = environments.filter(env => env.id !== envId);
    setEnvironments(updatedEnvironments);
    localStorage.setItem(`testgenie-environments-${projectId}`, JSON.stringify(updatedEnvironments));
    setShowOverflowMenu(null);
  };

  const handleEditEnvironment = (envId: number) => {
    router.push(`/dashboard/project/${projectId}/test-data/environments/edit?id=${envId}`);
    setShowOverflowMenu(null);
  };

  // Update bulk actions visibility
  useEffect(() => {
    setShowBulkActions(selectedEnvironments.length > 0);
  }, [selectedEnvironments]);

  // Close overflow menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showOverflowMenu !== null) {
        const target = event.target as Element;
        if (!target.closest('.overflow-menu-container')) {
          setShowOverflowMenu(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOverflowMenu]);

  if (loading) {
    return (
      <div className="project-detail-layout">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading environments...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-layout">
        <div className="error-container">
          <h2>Project Not Found</h2>
          <p>The project you're looking for doesn't exist.</p>
          <Link href="/dashboard" className="btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-layout">
      {/* Sidebar */}
      <ProjectSidebar projectId={projectId} />

      {/* Main Content */}
      <div className="project-main-content">
        {/* Content Area */}
        <main className="project-content">
          <div className="content-container">
            {environments.length > 0 ? (
              <>
                {/* Header */}
                <header className="project-header">
                  <div className="header-content">
                    <div className="header-left">
                      <h1 className="project-title">Environments</h1>
                    </div>
                    <div className="header-right">
                      <button 
                        className="btn-primary"
                        onClick={() => router.push(`/dashboard/project/${projectId}/test-data/environments/create`)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14"/>
                        </svg>
                        Create Environment
                      </button>
                    </div>
                  </div>
                </header>

                {/* Environments Table */}
                <div className="environments-section">
                  {/* Bulk Actions */}
                  {showBulkActions && (
                    <div className="bulk-actions">
                      <div className="bulk-actions-content">
                        <span className="selected-count">{selectedEnvironments.length} selected</span>
                        <button 
                          className="bulk-delete-btn"
                          onClick={handleDeleteSelected}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                          </svg>
                          Delete Selected
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="environments-table">
                    <div className="table-header">
                      <div className="table-cell checkbox">
                        <input 
                          type="checkbox" 
                          checked={selectedEnvironments.length === environments.length && environments.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                      </div>
                      <div className="table-cell name">Name</div>
                      <div className="table-cell">URL</div>
                      <div className="table-cell">Status</div>
                      <div className="table-cell">Last Modified</div>
                      <div className="table-cell">Created By</div>
                      <div className="table-cell actions">Actions</div>
                    </div>
                    {environments.map((environment) => (
                      <div key={environment.id} className="table-row">
                        <div className="table-cell checkbox">
                          <input 
                            type="checkbox" 
                            checked={selectedEnvironments.includes(environment.id)}
                            onChange={(e) => handleSelectEnvironment(environment.id, e.target.checked)}
                          />
                        </div>
                        <div className="table-cell name">
                          <div className="environment-name">{environment.name}</div>
                          <div className="environment-description">{environment.description}</div>
                        </div>
                        <div className="table-cell">{environment.url}</div>
                        <div className="table-cell">
                          <span className={`status-badge ${environment.status}`}>
                            {environment.status}
                          </span>
                        </div>
                        <div className="table-cell">{environment.lastModified}</div>
                        <div className="table-cell">{environment.createdBy}</div>
                        <div className="table-cell actions">
                          <div className="overflow-menu-container">
                            <button 
                              className="more-btn"
                              onClick={() => setShowOverflowMenu(showOverflowMenu === environment.id ? null : environment.id)}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="1"/>
                                <circle cx="12" cy="5" r="1"/>
                                <circle cx="12" cy="19" r="1"/>
                              </svg>
                            </button>
                            {showOverflowMenu === environment.id && (
                              <div className="overflow-menu">
                                <button 
                                  className="menu-item"
                                  onClick={() => handleEditEnvironment(environment.id)}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                  </svg>
                                  Edit
                                </button>
                                <button 
                                  className="menu-item danger"
                                  onClick={() => handleDeleteEnvironment(environment.id)}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3,6 5,6 21,6"/>
                                    <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                </div>
                <h3 className="empty-title">No Environments Yet</h3>
                <p className="empty-description">Create your first environment to get started.</p>
                <button 
                  className="btn-primary"
                  onClick={() => router.push(`/dashboard/project/${projectId}/test-data/environments/create`)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Create Environment
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}