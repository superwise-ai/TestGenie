'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ProjectSidebar from '../../../../../components/ProjectSidebar';

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

interface TestCase {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft' | 'deprecated';
  priority: 'high' | 'medium' | 'low';
  lastModified: string;
  createdBy: string;
}

export default function EditTestSuitePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params.id as string;
  const testSuiteId = searchParams.get('id');
  
  const [project, setProject] = useState<any>(null);
  const [testSuite, setTestSuite] = useState<TestSuite | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'draft' as const
  });
  const [selectedTestCases, setSelectedTestCases] = useState<number[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (!testSuiteId) {
      router.push(`/dashboard/project/${projectId}/test-suites`);
      return;
    }

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

    // Load test suite from localStorage
    const savedTestSuites = localStorage.getItem(`testgenie-test-suites-${projectId}`);
    if (savedTestSuites) {
      try {
        const testSuites = JSON.parse(savedTestSuites);
        const testSuiteData = testSuites.find((ts: any) => ts.id.toString() === testSuiteId);
        if (testSuiteData) {
          setTestSuite(testSuiteData);
          setFormData({
            name: testSuiteData.name,
            description: testSuiteData.description,
            status: testSuiteData.status
          });
        }
      } catch (error) {
        console.error('Error loading test suite from localStorage:', error);
      }
    }

    // Load test cases from localStorage
    const savedTestCases = localStorage.getItem(`testgenie-test-cases-${projectId}`);
    if (savedTestCases) {
      try {
        setTestCases(JSON.parse(savedTestCases));
      } catch (error) {
        console.error('Error loading test cases from localStorage:', error);
      }
    }
    setLoading(false);
  }, [projectId, testSuiteId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleTestCaseSelect = (testCaseId: number, checked: boolean) => {
    if (checked) {
      setSelectedTestCases(prev => [...prev, testCaseId]);
    } else {
      setSelectedTestCases(prev => prev.filter(id => id !== testCaseId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTestCases(testCases.map(tc => tc.id));
    } else {
      setSelectedTestCases([]);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Test suite name is required';
    }

    if (selectedTestCases.length === 0) {
      newErrors.testCases = 'Please select at least one test case';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Update test suite
    const updatedTestSuite = {
      ...testSuite,
      ...formData,
      testCases: selectedTestCases.length,
      lastModified: new Date().toLocaleDateString()
    };

    // Save to localStorage
    const savedTestSuites = localStorage.getItem(`testgenie-test-suites-${projectId}`);
    const existingTestSuites = savedTestSuites ? JSON.parse(savedTestSuites) : [];
    const updatedTestSuites = existingTestSuites.map((ts: any) => 
      ts.id.toString() === testSuiteId ? updatedTestSuite : ts
    );
    localStorage.setItem(`testgenie-test-suites-${projectId}`, JSON.stringify(updatedTestSuites));

    // Redirect back to test suites page
    router.push(`/dashboard/project/${projectId}/test-suites`);
  };

  if (loading) {
    return (
      <div className="project-detail-layout">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading test suite...</p>
        </div>
      </div>
    );
  }

  if (!project || !testSuite) {
    return (
      <div className="project-detail-layout">
        <div className="error-container">
          <h2>Test Suite Not Found</h2>
          <p>The test suite you're looking for doesn't exist.</p>
          <Link href={`/dashboard/project/${projectId}/test-suites`} className="btn-primary">Back to Test Suites</Link>
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
              <h1 className="project-title">Edit Test Suite</h1>
            </div>
            <div className="header-right">
              <Link 
                href={`/dashboard/project/${projectId}/test-suites`}
                className="btn-outline"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Test Suites
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="project-content">
          <div className="content-container">
            <form onSubmit={handleSubmit} className="create-form">
              {/* Test Suite Details */}
              <div className="form-section">
                <h3>Test Suite Details</h3>
                <div className="form-group">
                  <label htmlFor="name">Test Suite Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter test suite name"
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
                    placeholder="Enter test suite description"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>

              {/* Test Cases Selection */}
              <div className="form-section">
                <h3>Select Test Cases *</h3>
                {errors.testCases && <span className="error-message">{errors.testCases}</span>}
                
                {testCases.length === 0 ? (
                  <div className="empty-steps">
                    <p>No test cases available. Create test cases first.</p>
                    <Link 
                      href={`/dashboard/project/${projectId}/test-cases/create`}
                      className="btn-primary"
                    >
                      Create Test Case
                    </Link>
                  </div>
                ) : (
                  <div className="test-cases-selection">
                    <div className="selection-header">
                      <div className="selection-info">
                        <input
                          type="checkbox"
                          checked={selectedTestCases.length === testCases.length && testCases.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                        <span>Select All ({testCases.length} test cases)</span>
                      </div>
                      <div className="selected-count">
                        {selectedTestCases.length} selected
                      </div>
                    </div>
                    
                    <div className="test-cases-list">
                      {testCases.map((testCase) => (
                        <div key={testCase.id} className="test-case-item">
                          <div className="test-case-checkbox">
                            <input
                              type="checkbox"
                              checked={selectedTestCases.includes(testCase.id)}
                              onChange={(e) => handleTestCaseSelect(testCase.id, e.target.checked)}
                            />
                          </div>
                          <div className="test-case-info">
                            <div className="test-case-name">{testCase.name}</div>
                            <div className="test-case-description">{testCase.description}</div>
                            <div className="test-case-meta">
                              <span className={`priority-badge ${testCase.priority}`}>
                                {testCase.priority}
                              </span>
                              <span className="status-badge">{testCase.status}</span>
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
                  href={`/dashboard/project/${projectId}/test-suites`}
                  className="btn-outline"
                >
                  Cancel
                </Link>
                <button type="submit" className="btn-primary">
                  Update Test Suite
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
