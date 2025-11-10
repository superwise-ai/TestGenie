'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProjectSidebar from '../../../../components/ProjectSidebar';

export default function SettingsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [applicationName, setApplicationName] = useState('');
  const [version, setVersion] = useState('');

  useEffect(() => {
    // Load project from localStorage
    const savedProjects = localStorage.getItem('testgenie-projects');
    if (savedProjects) {
      try {
        const projects = JSON.parse(savedProjects);
        const projectData = projects.find((p: any) => p.id.toString() === projectId);
        if (projectData) {
          setProject(projectData);
          setProjectName(projectData.name);
          setProjectDescription(projectData.description);
          setApplicationName(projectData.applicationName);
          setVersion(projectData.version);
        }
      } catch (error) {
        console.error('Error loading project:', error);
      }
    }
    setLoading(false);
  }, [projectId]);

  const handleUpdateProject = () => {
    const savedProjects = localStorage.getItem('testgenie-projects');
    if (savedProjects) {
      try {
        const projects = JSON.parse(savedProjects);
        const updatedProjects = projects.map((p: any) => 
          p.id.toString() === projectId 
            ? { ...p, name: projectName, description: projectDescription, applicationName, version }
            : p
        );
        localStorage.setItem('testgenie-projects', JSON.stringify(updatedProjects));
        setProject({ ...project, name: projectName, description: projectDescription, applicationName, version });
        alert('Project updated successfully!');
      } catch (error) {
        console.error('Error updating project:', error);
        alert('Error updating project');
      }
    }
  };

  const handleDeleteProject = () => {
    const savedProjects = localStorage.getItem('testgenie-projects');
    if (savedProjects) {
      try {
        const projects = JSON.parse(savedProjects);
        const updatedProjects = projects.filter((p: any) => p.id.toString() !== projectId);
        localStorage.setItem('testgenie-projects', JSON.stringify(updatedProjects));
        router.push('/dashboard');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project');
      }
    }
  };

  if (loading) {
    return (
      <div className="project-detail-layout">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading settings...</p>
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
        {/* Header */}
        <header className="project-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="project-title">Settings</h1>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="project-content">
          <div className="content-container">
            {/* Project Details */}
            <div className="settings-section">
              <div className="section-header">
                <h3>Project Details</h3>
                <p>Update your project information</p>
              </div>

              <div className="settings-form">
                <div className="form-group">
                  <label htmlFor="projectName">Project Name</label>
                  <input
                    type="text"
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="projectDescription">Description</label>
                  <textarea
                    id="projectDescription"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="form-textarea"
                    rows={4}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="applicationName">Application Name</label>
                    <input
                      type="text"
                      id="applicationName"
                      value={applicationName}
                      onChange={(e) => setApplicationName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="version">Version</label>
                    <input
                      type="text"
                      id="version"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn-primary" onClick={handleUpdateProject}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="settings-section danger-zone">
              <div className="section-header">
                <h3>Danger Zone</h3>
                <p>Irreversible and destructive actions</p>
              </div>

              <div className="danger-actions">
                <div className="danger-item">
                  <div className="danger-info">
                    <h4>Delete Project</h4>
                    <p>Permanently delete this project and all its data. This action cannot be undone.</p>
                  </div>
                  <button 
                    className="btn-danger"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                    </svg>
                    Delete Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Project</h3>
              <button 
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this project? This action cannot be undone and will permanently remove:</p>
              <ul>
                <li>All test cases and test suites</li>
                <li>All test data and configurations</li>
                <li>All test execution results</li>
                <li>All project settings</li>
              </ul>
              <p><strong>Project: {project.name}</strong></p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-danger"
                onClick={handleDeleteProject}
              >
                Yes, Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
