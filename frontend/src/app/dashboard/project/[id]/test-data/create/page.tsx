'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProjectSidebar from '../../../../../components/ProjectSidebar';

interface TestDataProfile {
  id: number;
  name: string;
  type: 'csv' | 'json' | 'excel' | 'database' | 'api';
  description: string;
  records: number;
  lastModified: string;
  createdBy: string;
  status: 'active' | 'inactive' | 'error';
}

export default function CreateTestDataProfilePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'csv' as 'csv' | 'json' | 'excel' | 'database' | 'api',
    description: '',
    records: 0,
    status: 'active' as 'active' | 'inactive' | 'error'
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

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
    setLoading(false);
  }, [projectId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'records' ? parseInt(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.records < 0) {
      newErrors.records = 'Records count must be non-negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // Create new test data profile
      const newProfile: TestDataProfile = {
        id: Date.now(),
        name: formData.name.trim(),
        type: formData.type,
        description: formData.description.trim(),
        records: formData.records,
        lastModified: new Date().toISOString(),
        createdBy: 'Current User', // In a real app, this would come from auth context
        status: formData.status
      };

      // Load existing test data profiles
      const savedTestData = localStorage.getItem(`testgenie-test-data-${projectId}`);
      const existingProfiles = savedTestData ? JSON.parse(savedTestData) : [];

      // Add new profile
      const updatedProfiles = [...existingProfiles, newProfile];

      // Save to localStorage
      localStorage.setItem(`testgenie-test-data-${projectId}`, JSON.stringify(updatedProfiles));

      // Redirect back to test data page
      router.push(`/dashboard/project/${projectId}/test-data`);
    } catch (error) {
      console.error('Error creating test data profile:', error);
      setErrors({ submit: 'Failed to create test data profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="project-layout">
        <ProjectSidebar />
        <div className="project-main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-layout">
        <ProjectSidebar />
        <div className="project-main-content">
          <div className="error-container">
            <h2>Project not found</h2>
            <p>The requested project could not be found.</p>
            <button 
              className="btn-primary" 
              onClick={() => router.push('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-layout">
      <ProjectSidebar />
      
      {/* Main Content */}
      <div className="project-main-content">
        {/* Header */}
        <header className="project-header">
          <div className="header-content">
            <div className="header-left">
              <button 
                className="btn-back"
                onClick={() => router.push(`/dashboard/project/${projectId}/test-data`)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
              </button>
              <h1 className="project-title">Create Test Data Profile</h1>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="project-content">
          <div className="content-container">
            <div className="create-form-container">
              <form onSubmit={handleSubmit} className="create-form">
                <div className="form-section">
                  <h3>Basic Information</h3>
                  
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={errors.name ? 'error' : ''}
                      placeholder="Enter test data profile name"
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="type">Data Type *</label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                    >
                      <option value="csv">CSV</option>
                      <option value="json">JSON</option>
                      <option value="excel">Excel</option>
                      <option value="database">Database</option>
                      <option value="api">API</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className={errors.description ? 'error' : ''}
                      placeholder="Describe the test data profile"
                      rows={4}
                    />
                    {errors.description && <span className="error-message">{errors.description}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="records">Number of Records</label>
                    <input
                      type="number"
                      id="records"
                      name="records"
                      value={formData.records}
                      onChange={handleInputChange}
                      className={errors.records ? 'error' : ''}
                      placeholder="0"
                      min="0"
                    />
                    {errors.records && <span className="error-message">{errors.records}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                </div>

                {errors.submit && (
                  <div className="error-message submit-error">
                    {errors.submit}
                  </div>
                )}

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => router.push(`/dashboard/project/${projectId}/test-data`)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Creating...' : 'Create Test Data Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
