'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ProjectSidebar from '../../../../../components/ProjectSidebar';

interface Element {
  id: number;
  name: string;
  selector: string;
  type: 'id' | 'class' | 'xpath' | 'css';
  status: 'active' | 'inactive' | 'deprecated';
  lastModified: string;
  createdBy: string;
}

export default function EditElementPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params.id as string;
  const elementId = searchParams.get('id');
  
  const [project, setProject] = useState<any>(null);
  const [element, setElement] = useState<Element | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    selector: '',
    type: 'id' as const,
    status: 'active' as const
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (!elementId) {
      router.push(`/dashboard/project/${projectId}/elements`);
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

    // Load element from localStorage
    const savedElements = localStorage.getItem(`testgenie-elements-${projectId}`);
    if (savedElements) {
      try {
        const elements = JSON.parse(savedElements);
        const elementData = elements.find((el: any) => el.id.toString() === elementId);
        if (elementData) {
          setElement(elementData);
          setFormData({
            name: elementData.name,
            selector: elementData.selector,
            type: elementData.type,
            status: elementData.status
          });
        }
      } catch (error) {
        console.error('Error loading element from localStorage:', error);
      }
    }
    setLoading(false);
  }, [projectId, elementId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      newErrors.name = 'Element name is required';
    }

    if (!formData.selector.trim()) {
      newErrors.selector = 'Selector is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Update element
    const updatedElement = {
      ...element,
      ...formData,
      lastModified: new Date().toLocaleDateString()
    };

    // Save to localStorage
    const savedElements = localStorage.getItem(`testgenie-elements-${projectId}`);
    const existingElements = savedElements ? JSON.parse(savedElements) : [];
    const updatedElements = existingElements.map((el: any) => 
      el.id.toString() === elementId ? updatedElement : el
    );
    localStorage.setItem(`testgenie-elements-${projectId}`, JSON.stringify(updatedElements));

    // Redirect back to elements page
    router.push(`/dashboard/project/${projectId}/elements`);
  };

  if (loading) {
    return (
      <div className="project-detail-layout">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading element...</p>
        </div>
      </div>
    );
  }

  if (!project || !element) {
    return (
      <div className="project-detail-layout">
        <div className="error-container">
          <h2>Element Not Found</h2>
          <p>The element you're looking for doesn't exist.</p>
          <Link href={`/dashboard/project/${projectId}/elements`} className="btn-primary">Back to Elements</Link>
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
              <h1 className="project-title">Edit Element</h1>
            </div>
            <div className="header-right">
              <Link 
                href={`/dashboard/project/${projectId}/elements`}
                className="btn-outline"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Elements
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="project-content">
          <div className="content-container">
            <form onSubmit={handleSubmit} className="create-form">
              {/* Element Details */}
              <div className="form-section">
                <h3>Element Details</h3>
                <div className="form-group">
                  <label htmlFor="name">Element Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter element name"
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="selector">Selector *</label>
                  <input
                    type="text"
                    id="selector"
                    name="selector"
                    value={formData.selector}
                    onChange={handleInputChange}
                    className={`form-input ${errors.selector ? 'error' : ''}`}
                    placeholder="e.g., #login-button, .username-field"
                  />
                  {errors.selector && <span className="error-message">{errors.selector}</span>}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="type">Type</label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="id">ID</option>
                      <option value="class">Class</option>
                      <option value="xpath">XPath</option>
                      <option value="css">CSS Selector</option>
                    </select>
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
                      <option value="deprecated">Deprecated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <Link 
                  href={`/dashboard/project/${projectId}/elements`}
                  className="btn-outline"
                >
                  Cancel
                </Link>
                <button type="submit" className="btn-primary">
                  Update Element
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
