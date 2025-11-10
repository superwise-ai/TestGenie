'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProjectSidebar from '../../../../../components/ProjectSidebar';

interface WikiPage {
  id: number;
  title: string;
  content: string;
  lastModified: string;
  createdBy: string;
  tags: string[];
}

export default function CreateWikiPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get existing wiki pages
      const savedWikiPages = localStorage.getItem(`testgenie-wiki-${projectId}`);
      const existingPages = savedWikiPages ? JSON.parse(savedWikiPages) : [];

      // Create new wiki page
      const newPage: WikiPage = {
        id: Date.now(),
        title: formData.title,
        content: formData.content,
        lastModified: new Date().toLocaleDateString(),
        createdBy: 'Current User', // You can replace this with actual user data
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };

      // Add to existing pages
      const updatedPages = [...existingPages, newPage];
      
      // Save to localStorage
      localStorage.setItem(`testgenie-wiki-${projectId}`, JSON.stringify(updatedPages));
      
      // Redirect to wiki page
      router.push(`/dashboard/project/${projectId}/wiki`);
      
    } catch (error) {
      console.error('Error creating wiki page:', error);
      alert('Error creating wiki page. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="project-detail-layout">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
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

      {/* Content Area */}
      <main className="project-content">
        <div className="content-container">
          <div className="page-header">
            <div className="header-content">
              <div className="header-left">
                <h1>Create Wiki Page</h1>
                <p>Add a new page to your project wiki</p>
              </div>
              <div className="header-right">
                <Link 
                  href={`/dashboard/project/${projectId}/wiki`}
                  className="btn-secondary"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  Back to Wiki
                </Link>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="create-form">
            <div className="form-section">
              <div className="section-header">
                <h3>Page Information</h3>
              </div>
              
              <div className="form-group">
                <label htmlFor="title">
                  Page Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  placeholder="Enter page title"
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="tags">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter tags separated by commas (e.g., documentation, guide, tutorial)"
                />
                <div className="field-help">
                  Separate multiple tags with commas
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="content">
                  Content <span className="required">*</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className={`form-textarea ${errors.content ? 'error' : ''}`}
                  placeholder="Write your wiki page content here..."
                  rows={12}
                />
                {errors.content && <span className="error-message">{errors.content}</span>}
                <div className="field-help">
                  Use markdown formatting for rich text content
                </div>
              </div>
            </div>

            <div className="form-actions">
              <Link 
                href={`/dashboard/project/${projectId}/wiki`}
                className="btn-secondary"
              >
                Cancel
              </Link>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Page'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
