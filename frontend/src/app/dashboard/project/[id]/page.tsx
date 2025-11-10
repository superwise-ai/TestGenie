'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import ProjectSidebar from '../../../components/ProjectSidebar';
import apiClient from '../../../../services/api';

interface TestSuite {
  id: number;
  name: string;
  tests: number;
  passed: number;
  failed: number;
  status: 'success' | 'warning' | 'error';
}

interface RecentRun {
  id: number;
  timestamp: string;
  duration: string;
  status: 'success' | 'warning' | 'error';
  tests: number;
  passed: number;
  failed: number;
}

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
  testSuites: TestSuite[];
  recentRuns: RecentRun[];
}

export default function ProjectDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        // Try to load from API first
        const response = await apiClient.getProject(parseInt(projectId));
        if (response.data) {
          // Transform API data to match frontend interface
          const projectWithData: Project = {
            ...response.data,
            createdAt: response.data.created_at ? response.data.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            lastRun: response.data.last_run ? new Date(response.data.last_run).toLocaleDateString() : 'Never',
            applicationName: response.data.application_name || '',
            tests: 0, // This would need to be calculated from test cases
            testSuites: [], // This would need to be loaded separately
            recentRuns: []
          };
          setProject(projectWithData);
        }
      } catch (error) {
        console.error('Error loading project from API:', error);
        
        // Fallback to localStorage
        const savedProjects = localStorage.getItem('testgenie-projects');
        if (savedProjects) {
          try {
            const projects = JSON.parse(savedProjects);
            const projectData = projects.find((p: any) => p.id.toString() === projectId);
            
            if (projectData) {
              const testCases = JSON.parse(localStorage.getItem(`testgenie-test-cases-${projectId}`) || '[]');
              const stepGroups = JSON.parse(localStorage.getItem(`testgenie-step-groups-${projectId}`) || '[]');
              
              const projectWithData: Project = {
                ...projectData,
                tests: testCases.length,
                testSuites: stepGroups.map((group: any, index: number) => ({
                  id: index + 1,
                  name: group.name,
                  tests: group.steps ? group.steps.length : 0,
                  passed: 0,
                  failed: 0,
                  status: 'success' as const
                })),
                recentRuns: []
              };
              setProject(projectWithData);
            }
          } catch (localError) {
            console.error('Error loading project from localStorage:', localError);
          }
        }
      }
      setLoading(false);
    };
    
    loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="project-detail-layout">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading project dashboard...</p>
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
              <h1 className="project-title">{project.name}</h1>
            </div>
            <div className="header-right">
              <Link href="/dashboard" className="btn-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Projects
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="project-content">
          <div className="content-container">
            {/* Dashboard Overview */}
            <div className="dashboard-overview">
              <div className="overview-header">
                <h2>Dashboard</h2>
              </div>

              {/* Main Dashboard Content */}
              <div className="dashboard-content">
                {/* Top Row - Metric Cards */}
                <div className="dashboard-metrics">
                  <div className="metric-card">
                    <div className="metric-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12l2 2 4-4"/>
                        <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                        <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                        <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
                        <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"/>
                      </svg>
                    </div>
                    <div className="metric-content">
                      <div className="metric-number">{project.tests}</div>
                      <div className="metric-label">Total</div>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-icon passed">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12l2 2 4-4"/>
                      </svg>
                    </div>
                    <div className="metric-content">
                      <div className="metric-number">0</div>
                      <div className="metric-label">Passed</div>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-icon failed">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </div>
                    <div className="metric-content">
                      <div className="metric-number">4</div>
                      <div className="metric-label">Failed</div>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-icon not-executed">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M8 12h8"/>
                      </svg>
                    </div>
                    <div className="metric-content">
                      <div className="metric-number">21</div>
                      <div className="metric-label">Not Executed</div>
                    </div>
                  </div>
                </div>

                {/* Latest Runs Section */}
                <div className="latest-runs-section">
                  <div className="runs-header">
                    <h3>Latest Runs</h3>
                    <div className="runs-tabs">
                      <button className="tab active">Today 1</button>
                      <button className="tab">This week 1</button>
                      <button className="tab">This month 2</button>
                      <button className="tab">This quarter 7</button>
                    </div>
                  </div>
                  <div className="runs-content">
                    <div className="runs-list">
                      <div className="run-item">
                        <span className="run-name">• Regression Testing...</span>
                        <a href="#" className="view-reports">View Reports</a>
                      </div>
                    </div>
                    <div className="runs-chart">
                      <div className="donut-chart">
                        <div className="chart-center">14 Total</div>
                      </div>
                      <div className="chart-legend">
                        <div className="legend-item">
                          <span className="legend-dot passed"></span>
                          <span>Passed: 0</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-dot failed"></span>
                          <span>Failed: 0</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-dot queued"></span>
                          <span>Queued: 4</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-dot stopped"></span>
                          <span>Stopped: 0</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-dot running"></span>
                          <span>Running: 10</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-dot not-executed"></span>
                          <span>Not executed: 0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Sections */}
                <div className="dashboard-sections">
                  <div className="dashboard-section">
                    <div className="section-tabs">
                      <button className="tab active">Test Cases</button>
                      <button className="tab">Elements</button>
                    </div>
                    <div className="section-content">
                      <div className="empty-state">
                        <p>No test cases submitted for review</p>
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-section">
                    <div className="section-tabs">
                      <button className="tab active">Test Cases</button>
                      <button className="tab">Elements</button>
                    </div>
                    <div className="section-content">
                      <div className="empty-state">
                        <p>No test cases assigned for your review</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}