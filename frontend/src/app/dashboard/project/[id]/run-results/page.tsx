'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProjectSidebar from '../../../../components/ProjectSidebar';

interface RunResult {
  id: number;
  testPlan: string;
  status: 'success' | 'warning' | 'error' | 'running';
  duration: string;
  timestamp: string;
  tests: number;
  passed: number;
  failed: number;
  skipped: number;
  executedBy: string;
}

export default function RunResultsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [runResults, setRunResults] = useState<RunResult[]>([]);
  const [loading, setLoading] = useState(true);

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

    // Load run results from localStorage
    const savedRunResults = localStorage.getItem(`testgenie-run-results-${projectId}`);
    if (savedRunResults) {
      try {
        setRunResults(JSON.parse(savedRunResults));
      } catch (error) {
        console.error('Error loading run results from localStorage:', error);
      }
    }
    setLoading(false);
  }, [projectId]);

  if (loading) {
    return (
      <div className="project-detail-layout">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading run results...</p>
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
            {runResults.length > 0 ? (
              <>
                {/* Header */}
                <header className="project-header">
                  <div className="header-content">
                    <div className="header-left">
                      <h1 className="project-title">Run Results</h1>
                    </div>
                    <div className="header-right">
                      <button className="btn-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="23,4 23,10 17,10"/>
                          <polyline points="1,20 1,14 7,14"/>
                          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                        </svg>
                        Run Tests
                      </button>
                    </div>
                  </div>
                </header>

                {/* Run Results List */}
                <div className="run-results-section">
                  <div className="section-header">
                    <h3>All Test Runs ({runResults.length})</h3>
                    <div className="section-actions">
                      <button className="btn-outline">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        Export Report
                      </button>
                    </div>
                  </div>

                  <div className="run-results-table">
                    <div className="table-header">
                    <div className="table-cell">Test Plan</div>
                    <div className="table-cell">Status</div>
                    <div className="table-cell">Duration</div>
                    <div className="table-cell">Tests</div>
                    <div className="table-cell">Passed</div>
                    <div className="table-cell">Failed</div>
                    <div className="table-cell">Skipped</div>
                    <div className="table-cell">Executed By</div>
                    <div className="table-cell">Timestamp</div>
                    <div className="table-cell">Actions</div>
                  </div>
                  {runResults.map((result) => (
                  <div key={result.id} className="table-row">
                    <div className="table-cell">
                      <span className="test-plan-name">{result.testPlan}</span>
                    </div>
                    <div className="table-cell">
                      <span className={`status-badge ${result.status}`}>
                        {result.status === 'success' ? '✓' : result.status === 'warning' ? '⚠' : result.status === 'error' ? '✗' : '⏳'} {result.status}
                      </span>
                    </div>
                    <div className="table-cell">{result.duration}</div>
                    <div className="table-cell">{result.tests}</div>
                    <div className="table-cell passed">{result.passed}</div>
                    <div className="table-cell failed">{result.failed}</div>
                    <div className="table-cell skipped">{result.skipped}</div>
                    <div className="table-cell">{result.executedBy}</div>
                    <div className="table-cell">{result.timestamp}</div>
                    <div className="table-cell">
                      <button className="action-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        View
                      </button>
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
                      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                    </svg>
                  </div>
                  <h3 className="empty-title">No Test Runs Yet</h3>
                  <p className="empty-description">Run your first test to see results here</p>
                  <button className="btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23,4 23,10 17,10"/>
                      <polyline points="1,20 1,14 7,14"/>
                      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                    </svg>
                    Run Tests
                  </button>
                </div>
              )}
          </div>
        </main>
      </div>
    </div>
  );
}
