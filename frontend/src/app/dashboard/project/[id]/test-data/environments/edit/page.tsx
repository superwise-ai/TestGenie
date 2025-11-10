'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ProjectSidebar from '../../../../../../components/ProjectSidebar';

interface Environment {
  id: number;
  name: string;
  description: string;
  url: string;
  status: 'active' | 'inactive';
  lastModified: string;
  createdBy: string;
}

export default function EditEnvironmentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params.id as string;
  const environmentId = searchParams.get('id');
  
  const [project, setProject] = useState<any>(null);
  const [environment, setEnvironment] = useState<Environment | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    status: 'active' as const
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (!environmentId) {
      router.push(`/dashboard/project/${projectId}/test-data/environments`);
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

    // Load environment from localStorage
    const savedEnvironments = localStorage.getItem(`testgenie-environments-${projectId}`);
    if (savedEnvironments) {
      try {
        const environments = JSON.parse(savedEnvironments);
        const environmentData = environments.find((env: any) => env.id.toString() === environmentId);
        if (environmentData) {
          setEnvironment(environmentData);
          setFormData({
            name: environmentData.name,
            description: environmentData.description,
            url: environmentData.url,
            status: environmentData.status
          });
        }
      } catch (error) {
        console.error('Error loading environment from localStorage:', error);
      }
    }
    setLoading(false);
  }, [projectId, environmentId, router]);

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

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Environment name is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Update environment
    const updatedEnvironment = {
      ...environment,
      ...formData,
      lastModified: new Date().toLocaleDateString()
    };

    // Save to localStorage
    const savedEnvironments = localStorage.getItem(`testgenie-environments-${projectId}`);
    const existingEnvironments = savedEnvironments ? JSON.parse(savedEnvironments) : [];
    const updatedEnvironments = existingEnvironments.map((env: any) => 
      env.id.toString() === environmentId ? updatedEnvironment : env
    );
    localStorage.setItem(`testgenie-environments-${projectId}`, JSON.stringify(updatedEnvironments));

    // Redirect back to environments page
    router.push(`/dashboard/project/${projectId}/test-data/environments`);
  };

  if (loading) {
    return (
      <div className="project-detail-layout">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading environment...</p>
        </div>
      </div>
    );
  }

  if (!project || !environment) {
    return (
      <div className="project-detail-layout">
        <div className="error-container">
          <h2>Environment Not Found</h2>
          <p>The environment you're looking for doesn't exist.</p>
          <Link href={`/dashboard/project/${projectId}/test-data/environments`} className="btn-primary">Back to Environments</Link>
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
              <h1 className="project-title">Edit Environment</h1>
            </div>
            <div className="header-right">
              <Link 
                href={`/dashboard/project/${projectId}/test-data/environments`}
                className="btn-outline"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Environments
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="project-content">
          <div className="content-container">
            <form onSubmit={handleSubmit} className="create-form">
              {/* Environment Details */}
              <div className="form-section">
                <h3>Environment Details</h3>
                <div className="form-group">
                  <label htmlFor="name">Environment Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter environment name"
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
                    placeholder="Enter environment description"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="url">URL *</label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className={`form-input ${errors.url ? 'error' : ''}`}
                    placeholder="https://example.com"
                  />
                  {errors.url && <span className="error-message">{errors.url}</span>}
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <Link 
                  href={`/dashboard/project/${projectId}/test-data/environments`}
                  className="btn-outline"
                >
                  Cancel
                </Link>
                <button type="submit" className="btn-primary">
                  Update Environment
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
