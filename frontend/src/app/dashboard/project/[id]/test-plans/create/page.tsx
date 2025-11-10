'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProjectSidebar from '../../../../../components/ProjectSidebar';
import apiClient from '@/services/api';

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

export default function CreateTestPlanPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestSuites, setSelectedTestSuites] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load project from API first
        const projectResponse = await apiClient.getProject(parseInt(projectId));
        if (projectResponse.data) {
          setProject(projectResponse.data);
        }
      } catch (error) {
        console.error('Error loading project from API:', error);
        
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
      }

      // Load test suites from localStorage (for now)
      const savedTestSuites = localStorage.getItem(`testgenie-test-suites-${projectId}`);
      if (savedTestSuites) {
        try {
          setTestSuites(JSON.parse(savedTestSuites));
        } catch (error) {
          console.error('Error loading test suites from localStorage:', error);
        }
      }
      
      setLoading(false);
    };

    loadData();
  }, [projectId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTestSuiteSelect = (testSuiteId: number, checked: boolean) => {
    if (checked) {
      setSelectedTestSuites(prev => [...prev, testSuiteId]);
    } else {
      setSelectedTestSuites(prev => prev.filter(id => id !== testSuiteId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTestSuites(testSuites.map(ts => ts.id));
    } else {
      setSelectedTestSuites([]);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Test plan name is required';
    }

    if (selectedTestSuites.length === 0) {
      newErrors.testSuites = 'Please select at least one test suite';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Create new test plan
    const newTestPlan = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      testSuites: selectedTestSuites.length,
      status: 'draft' as const,
      lastRun: 'Never',
      lastModified: new Date().toLocaleDateString(),
      createdBy: 'Current User'
    };

    // Save to localStorage
    const savedTestPlans = localStorage.getItem(`testgenie-test-plans-${projectId}`);
    const existingPlans = savedTestPlans ? JSON.parse(savedTestPlans) : [];
    const updatedPlans = [...existingPlans, newTestPlan];
    localStorage.setItem(`testgenie-test-plans-${projectId}`, JSON.stringify(updatedPlans));

    // Redirect back to test plans page
    router.push(`/dashboard/project/${projectId}/test-plans`);
  };

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
        {/* Header */}
        <header className="project-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="project-title">Create Test Plan</h1>
            </div>
            <div className="header-right">
              <Link 
                href={`/dashboard/project/${projectId}/test-plans`}
                className="btn-outline"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Test Plans
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="project-content">
          <div className="content-container">
            <form onSubmit={handleSubmit} className="create-form">
              {/* Test Plan Details */}
              <div className="form-section">
                <h3>Test Plan Details</h3>
                <div className="form-group">
                  <label htmlFor="name">Test Plan Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter test plan name"
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows={4}
                    placeholder="Enter test plan description"
                  />
                </div>
              </div>

              {/* Test Suites Selection */}
              <div className="form-section">
                <h3>Select Test Suites *</h3>
                {errors.testSuites && <span className="error-message">{errors.testSuites}</span>}
                
                {testSuites.length === 0 ? (
                  <div className="empty-steps">
                    <p>No test suites available. Create test suites first.</p>
                    <Link 
                      href={`/dashboard/project/${projectId}/test-suites/create`}
                      className="btn-primary"
                    >
                      Create Test Suite
                    </Link>
                  </div>
                ) : (
                  <div className="test-suites-selection">
                    <div className="selection-header">
                      <div className="selection-info">
                        <input
                          type="checkbox"
                          checked={selectedTestSuites.length === testSuites.length && testSuites.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                        <span>Select All ({testSuites.length} test suites)</span>
                      </div>
                      <div className="selected-count">
                        {selectedTestSuites.length} selected
                      </div>
                    </div>
                    
                    <div className="test-suites-list">
                      {testSuites.map((testSuite) => (
                        <div key={testSuite.id} className="test-suite-item">
                          <div className="test-suite-checkbox">
                            <input
                              type="checkbox"
                              checked={selectedTestSuites.includes(testSuite.id)}
                              onChange={(e) => handleTestSuiteSelect(testSuite.id, e.target.checked)}
                            />
                          </div>
                          <div className="test-suite-info">
                            <div className="test-suite-name">{testSuite.name}</div>
                            <div className="test-suite-description">{testSuite.description}</div>
                            <div className="test-suite-meta">
                              <span className="test-cases-count">{testSuite.testCases} test cases</span>
                              <span className={`status-badge ${testSuite.status}`}>
                                {testSuite.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <Link 
                  href={`/dashboard/project/${projectId}/test-plans`}
                  className="btn-outline"
                >
                  Cancel
                </Link>
                <button type="submit" className="btn-primary">
                  Create Test Plan
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
