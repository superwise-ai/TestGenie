'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProjectSidebar from '../../../../components/ProjectSidebar';

interface TestSuite {
  id: number;
  name: string;
  description: string;
  testCases: number;
  status: 'active' | 'draft';
  lastRun: string;
  lastModified: string;
  createdBy: string;
}

export default function TestSuitesPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSuites, setSelectedSuites] = useState<number[]>([]);
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

    // Load test suites from localStorage
    const savedTestSuites = localStorage.getItem(`testgenie-test-suites-${projectId}`);
    if (savedTestSuites) {
      try {
        setTestSuites(JSON.parse(savedTestSuites));
      } catch (error) {
        console.error('Error loading test suites from localStorage:', error);
      }
    }
    setLoading(false);
  }, [projectId]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSuites(testSuites.map(suite => suite.id));
    } else {
      setSelectedSuites([]);
    }
  };

  const handleSelectSuite = (suiteId: number, checked: boolean) => {
    if (checked) {
      setSelectedSuites(prev => [...prev, suiteId]);
    } else {
      setSelectedSuites(prev => prev.filter(id => id !== suiteId));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedSuites.length === 0) return;
    
    const updatedSuites = testSuites.filter(suite => !selectedSuites.includes(suite.id));
    setTestSuites(updatedSuites);
    localStorage.setItem(`testgenie-test-suites-${projectId}`, JSON.stringify(updatedSuites));
    setSelectedSuites([]);
    setShowBulkActions(false);
  };

  const handleDeleteSuite = (suiteId: number) => {
    const updatedSuites = testSuites.filter(suite => suite.id !== suiteId);
    setTestSuites(updatedSuites);
    localStorage.setItem(`testgenie-test-suites-${projectId}`, JSON.stringify(updatedSuites));
    setShowOverflowMenu(null);
  };

  const handleEditSuite = (suiteId: number) => {
    router.push(`/dashboard/project/${projectId}/test-suites/edit?id=${suiteId}`);
    setShowOverflowMenu(null);
  };

  // Update bulk actions visibility
  useEffect(() => {
    setShowBulkActions(selectedSuites.length > 0);
  }, [selectedSuites]);

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
          <p>Loading test suites...</p>
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
            {testSuites.length > 0 ? (
              <>
                {/* Header */}
                <header className="project-header">
                  <div className="header-content">
                    <div className="header-left">
                      <h1 className="project-title">Test Suites</h1>
                    </div>
                    <div className="header-right">
                      <button 
                        className="btn-primary"
                        onClick={() => router.push(`/dashboard/project/${projectId}/test-suites/create`)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14"/>
                        </svg>
                        Create Test Suite
                      </button>
                    </div>
                  </div>
                </header>

                {/* Test Suites Table */}
                <div className="test-suites-section">
                  {/* Bulk Actions */}
                  {showBulkActions && (
                    <div className="bulk-actions">
                      <div className="bulk-actions-content">
                        <span className="selected-count">{selectedSuites.length} selected</span>
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

                  <div className="test-suites-table">
                    <div className="table-header">
                    <div className="table-cell checkbox">
                      <input 
                        type="checkbox" 
                        checked={selectedSuites.length === testSuites.length && testSuites.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </div>
                    <div className="table-cell name">Test Suite Name</div>
                    <div className="table-cell test-cases">Test Cases</div>
                    <div className="table-cell status">Status</div>
                    <div className="table-cell last-run">Last Run</div>
                    <div className="table-cell last-modified">Last Modified</div>
                    <div className="table-cell created-by">Created By</div>
                    <div className="table-cell actions">Actions</div>
                  </div>
                  {testSuites.map((suite) => (
                  <div key={suite.id} className="table-row">
                    <div className="table-cell checkbox">
                      <input 
                        type="checkbox" 
                        checked={selectedSuites.includes(suite.id)}
                        onChange={(e) => handleSelectSuite(suite.id, e.target.checked)}
                      />
                    </div>
                    <div className="table-cell name">
                      <div className="suite-name">{suite.name}</div>
                      <div className="suite-description">{suite.description}</div>
                    </div>
                    <div className="table-cell test-cases">
                      <span>{suite.testCases}</span>
                    </div>
                    <div className="table-cell status">
                      <span className={`status-indicator ${suite.status}`}>
                        <span className="status-dot"></span>
                        {suite.status === 'active' ? 'Active' : 'Draft'}
                      </span>
                    </div>
                    <div className="table-cell last-run">
                      <span>{suite.lastRun}</span>
                    </div>
                    <div className="table-cell last-modified">
                      <span>{suite.lastModified}</span>
                    </div>
                    <div className="table-cell created-by">
                      <span>{suite.createdBy}</span>
                    </div>
                    <div className="table-cell actions">
                      <button className="run-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="5,3 19,12 5,21"/>
                        </svg>
                        Run
                      </button>
                      <div className="overflow-menu-container">
                        <button 
                          className="more-btn"
                          onClick={() => setShowOverflowMenu(showOverflowMenu === suite.id ? null : suite.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="1"/>
                            <circle cx="12" cy="5" r="1"/>
                            <circle cx="12" cy="19" r="1"/>
                          </svg>
                        </button>
                        {showOverflowMenu === suite.id && (
                          <div className="overflow-menu">
                            <button 
                              className="menu-item"
                              onClick={() => handleEditSuite(suite.id)}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                              Edit
                            </button>
                            <button 
                              className="menu-item danger"
                              onClick={() => handleDeleteSuite(suite.id)}
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
                  <h3 className="empty-title">No Test Suites Yet</h3>
                  <p className="empty-description">Create your first test suite to get started.</p>
                  <button 
                    className="btn-primary"
                    onClick={() => router.push(`/dashboard/project/${projectId}/test-suites/create`)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Create Test Suite
                  </button>
                </div>
              )}
          </div>
        </main>
      </div>
    </div>
  );
}