'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProjectSidebar from '../../../../components/ProjectSidebar';
import apiClient from '@/services/api';

interface TestData {
  id: number;
  name: string;
  type: 'csv' | 'json' | 'excel' | 'database' | 'api';
  description: string;
  records: number;
  lastModified: string;
  createdBy: string;
  status: 'active' | 'inactive' | 'error';
}

export default function TestDataPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [testData, setTestData] = useState<TestData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load project from API first
        const projectResponse = await apiClient.getProject(parseInt(projectId));
        if (projectResponse.data) {
          setProject(projectResponse.data);
        }
        
        // Load test data from API
        const testDataResponse = await apiClient.getTestData(parseInt(projectId));
        if (testDataResponse.data) {
          setTestData(testDataResponse.data as TestData[]);
        }
      } catch (error) {
        console.error('Error loading data from API:', error);
        
        // Fallback to localStorage for project
        const savedProjects = localStorage.getItem('testgenie-projects');
        if (savedProjects) {
          try {
            const projects = JSON.parse(savedProjects);
            const projectData = projects.find((p: any) => p.id.toString() === projectId);
            if (projectData) {
              setProject(projectData);
            }
          } catch (localError) {
            console.error('Error loading project from localStorage:', localError);
          }
        }
        
        // Fallback to localStorage for test data
        const savedTestData = localStorage.getItem(`testgenie-test-data-${projectId}`);
        if (savedTestData) {
          try {
            setTestData(JSON.parse(savedTestData));
          } catch (localError) {
            console.error('Error loading test data from localStorage:', localError);
          }
        }
      }
      
      setLoading(false);
    };

    loadData();
  }, [projectId]);

  if (loading) {
    return (
      <div className="project-detail-layout">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading test data...</p>
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
            {testData.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                  </div>
                  <h3 className="empty-title">No Test Data Profiles Yet</h3>
                  <p className="empty-description">Create your first test data profile to get started.</p>
                  <button 
                    className="btn-primary"
                    onClick={() => router.push(`/dashboard/project/${projectId}/test-data/create`)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Create Test Data Profile
                  </button>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <header className="project-header">
                    <div className="header-content">
                      <div className="header-left">
                        <h1 className="project-title">Test Data</h1>
                      </div>
                      <div className="header-right">
                        <button className="btn-outline">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7,10 12,15 17,10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                          </svg>
                          Import
                        </button>
                        <button className="btn-primary" onClick={() => router.push(`/dashboard/project/${projectId}/test-data/create`)}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14"/>
                          </svg>
                          Create Test Data Profile
                        </button>
                      </div>
                    </div>
                  </header>

                  {/* Test Data Profiles */}
                  <div className="test-data-section">
                    <div className="section-header">
                      <h3>Test Data Profiles</h3>
                      <div className="section-actions">
                        <button className="btn-outline">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7,10 12,15 17,10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                          </svg>
                          Import
                        </button>
                        <button className="btn-primary" onClick={() => router.push(`/dashboard/project/${projectId}/test-data/create`)}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14"/>
                          </svg>
                          Create Test Data Profile
                        </button>
                      </div>
                    </div>

                    <div className="test-data-list">
                  {testData.map((data) => (
                    <div key={data.id} className="test-data-item">
                      <div className="test-data-main">
                        <div className="test-data-info">
                          <h4 className="test-data-name">{data.name}</h4>
                          <p className="test-data-description">{data.description}</p>
                        </div>
                        <div className="test-data-status">
                          <span className={`status-badge ${data.status}`}>
                            {data.status}
                          </span>
                          <span className={`type-badge ${data.type}`}>
                            {data.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="test-data-meta">
                        <div className="meta-item">
                          <span className="meta-label">Records:</span>
                          <span className="meta-value">{data.records.toLocaleString()}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Last Modified:</span>
                          <span className="meta-value">{data.lastModified}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Created By:</span>
                          <span className="meta-value">{data.createdBy}</span>
                        </div>
                      </div>
                      <div className="test-data-actions">
                        <button className="action-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          View
                        </button>
                        <button className="action-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                          Edit
                        </button>
                        <button className="action-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="23,4 23,10 17,10"/>
                            <polyline points="1,20 1,14 7,14"/>
                            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                          </svg>
                          Refresh
                        </button>
                        <button className="action-btn danger">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                    </div>
                  </div>
                </>
              )}
          </div>
        </main>
      </div>
    </div>
  );
}
