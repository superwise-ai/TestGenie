'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CreateProjectModal from '../components/CreateProjectModal';
import apiClient from '../../services/api';
import config from '../../config';

interface Project {
  id: number;
  name: string;
  description: string;
  applicationName: string;
  version: string;
  createdAt: string;
  lastRun: string;
  status: 'healthy' | 'warning' | 'error';
  tests: number;
  color: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  // Load projects from API on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await apiClient.getProjects();
        if (response.data) {
          // Transform API data to match frontend interface
          const transformedProjects = response.data.map(project => ({
            ...project,
            createdAt: project.created_at.split('T')[0],
            lastRun: project.last_run ? new Date(project.last_run).toLocaleDateString() : 'Never',
            tests: 0, // This would need to be calculated from test cases
            color: project.color || '#F54927'
          }));
          setProjects(transformedProjects);
        }
      } catch (error) {
        console.error('Error loading projects from API:', error);
        // Fallback to localStorage if API fails
        const savedProjects = localStorage.getItem('testgenie-projects');
        if (savedProjects) {
          try {
            setProjects(JSON.parse(savedProjects));
          } catch (localError) {
            console.error('Error loading projects from localStorage:', localError);
          }
        }
      }
    };

    loadProjects();
  }, []);

  const handleProjectCreated = (newProject: any) => {
    // Transform the new project to match the frontend interface
    const transformedProject: Project = {
      ...newProject,
      createdAt: newProject.created_at.split('T')[0],
      lastRun: 'Never',
      status: 'healthy',
      tests: 0,
      color: newProject.color || '#F54927'
    };
    setProjects(prev => [...prev, transformedProject]);
  };


  return (
    <div className="dashboard-new">
      {/* Header */}
      <header className="dashboard-header-new">
        <div className="header-container">
          <div className="header-left">
            <Link href="/" className="logo">
              <span className="logo-icon">⚡</span>
              <span className="logo-text">TestGenie</span>
            </Link>
          </div>
          
          <div className="header-right">
            <Link href="#how-it-works" className="how-it-works-link">
              How It Works
            </Link>
              <div className="user-profile">
              <div className="user-avatar-new">
                <span>{config.defaultUser.initials}</span>
              </div>
              <div className="user-info-new">
                <div className="user-name-new">{config.defaultUser.fullName}</div>
                <div className="user-email-new">{config.defaultUser.email}</div>
              </div>
              <button 
                className="logout-btn-new"
                onClick={() => router.push('/')}
                title="Logout"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main-new">
        <div className="dashboard-container-new">
          {/* Welcome Section */}
          <div className="welcome-section-new">
            <div className="welcome-content">
              <h1 className="welcome-title">Welcome back, {config.defaultUser.fullName.split(' ')[0]}! 👋</h1>
              <p className="welcome-subtitle">Manage your test automation projects and track their performance</p>
            </div>
          </div>


          {/* Projects Section */}
          <div className="projects-section-new">
            <div className="section-header-new">
              <div className="section-title-new" onClick={() => router.push('/dashboard')} style={{cursor: 'pointer'}}>
                <h2>Your Projects</h2>
                <p>Manage and monitor your test automation projects</p>
              </div>
              <button 
                className="btn-create-new"
                onClick={() => setShowCreateModal(true)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Create Project
              </button>
            </div>


            {/* Projects Grid */}
            {projects.length === 0 ? (
              <div className="empty-state-new">
                <div className="empty-icon-new">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                </div>
                <h3 className="empty-title-new">No projects yet</h3>
                <p className="empty-description-new">Create your first test automation project to get started</p>
              </div>
            ) : (
              <div className="projects-grid-new">
                {projects.map((project) => (
                  <div key={project.id} className="project-card-new" onClick={() => router.push(`/dashboard/project/${project.id}`)}>
                    <div className="project-header-new">
                      <div className="project-icon-new" style={{backgroundColor: project.color}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        </svg>
                      </div>
                      <div className="project-info-new">
                        <h3 className="project-name-new">{project.name}</h3>
                        <p className="project-description-new">{project.description}</p>
                      </div>
                      <div className={`project-status-new ${project.status}`}>
                        {project.status === 'healthy' ? '✓' : '⚠'} {project.status}
                      </div>
                    </div>
                    
                    <div className="project-details-new">
                      <div className="detail-item-new">
                        <span className="detail-label-new">Application:</span>
                        <span className="detail-value-new">{project.applicationName}</span>
                      </div>
                      <div className="detail-item-new">
                        <span className="detail-label-new">Version:</span>
                        <span className="detail-value-new">{project.version}</span>
                      </div>
                      <div className="detail-item-new">
                        <span className="detail-label-new">Created:</span>
                        <span className="detail-value-new">{project.createdAt}</span>
                      </div>
                    </div>                    

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Project Modal */}
      <CreateProjectModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}