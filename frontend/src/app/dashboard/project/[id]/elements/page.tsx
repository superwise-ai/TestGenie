'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProjectSidebar from '../../../../components/ProjectSidebar';
import apiClient from '@/services/api';

interface Element {
  id: number;
  name: string;
  selector: string;
  type: 'button' | 'input' | 'link' | 'dropdown' | 'checkbox' | 'radio' | 'other';
  description: string;
  status: 'active' | 'inactive' | 'deprecated';
  lastModified: string;
  createdBy: string;
}

export default function ElementsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [elements, setElements] = useState<Element[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedElements, setSelectedElements] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showOverflowMenu, setShowOverflowMenu] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load project from API first
        const projectResponse = await apiClient.getProject(parseInt(projectId));
        if (projectResponse.data) {
          setProject(projectResponse.data);
        }
        
        // Load elements from API
        const elementsResponse = await apiClient.getElements(parseInt(projectId));
        if (elementsResponse.data) {
          setElements(elementsResponse.data as Element[]);
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
        
        // Fallback to localStorage for elements
        const savedElements = localStorage.getItem(`testgenie-elements-${projectId}`);
        if (savedElements) {
          try {
            setElements(JSON.parse(savedElements));
          } catch (localError) {
            console.error('Error loading elements from localStorage:', localError);
          }
        }
      }
      
      setLoading(false);
    };

    loadData();
  }, [projectId]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedElements(elements.map(el => el.id));
    } else {
      setSelectedElements([]);
    }
  };

  const handleSelectElement = (elementId: number, checked: boolean) => {
    if (checked) {
      setSelectedElements(prev => [...prev, elementId]);
    } else {
      setSelectedElements(prev => prev.filter(id => id !== elementId));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedElements.length === 0) return;
    
    const updatedElements = elements.filter(el => !selectedElements.includes(el.id));
    setElements(updatedElements);
    localStorage.setItem(`testgenie-elements-${projectId}`, JSON.stringify(updatedElements));
    setSelectedElements([]);
    setShowBulkActions(false);
  };

  const handleDeleteElement = (elementId: number) => {
    const updatedElements = elements.filter(el => el.id !== elementId);
    setElements(updatedElements);
    localStorage.setItem(`testgenie-elements-${projectId}`, JSON.stringify(updatedElements));
    setShowOverflowMenu(null);
  };

  const handleEditElement = (elementId: number) => {
    router.push(`/dashboard/project/${projectId}/elements/edit?id=${elementId}`);
    setShowOverflowMenu(null);
  };

  // Update bulk actions visibility
  useEffect(() => {
    setShowBulkActions(selectedElements.length > 0);
  }, [selectedElements]);

  // Close overflow menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showOverflowMenu !== null) {
        const target = event.target as HTMLElement;
        if (target && !target.closest('.overflow-menu-container')) {
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
          <p>Loading elements...</p>
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
            {elements.length > 0 ? (
              <>
                {/* Header */}
                <header className="project-header">
                  <div className="header-content">
                    <div className="header-left">
                      <h1 className="project-title">Elements</h1>
                    </div>
                    <div className="header-right">
                      <button 
                        className="btn-primary"
                        onClick={() => router.push(`/dashboard/project/${projectId}/elements/create`)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14"/>
                        </svg>
                        Create Element
                      </button>
                    </div>
                  </div>
                </header>

                {/* Elements Table */}
                <div className="elements-section">
                  {/* Bulk Actions */}
                  {showBulkActions && (
                    <div className="bulk-actions">
                      <div className="bulk-actions-content">
                        <span className="selected-count">{selectedElements.length} selected</span>
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

                  <div className="elements-table">
                    <div className="table-header">
                    <div className="table-cell checkbox">
                      <input 
                        type="checkbox" 
                        checked={selectedElements.length === elements.length && elements.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </div>
                    <div className="table-cell name">Element Name</div>
                    <div className="table-cell type">Type</div>
                    <div className="table-cell screen">Screen Name</div>
                    <div className="table-cell created">Created Date</div>
                    <div className="table-cell affected">Affected List</div>
                    <div className="table-cell reviewer">Reviewer</div>
                    <div className="table-cell status">Status</div>
                    <div className="table-cell actions">Actions</div>
                  </div>
                  {elements.map((element) => (
                  <div key={element.id} className="table-row">
                    <div className="table-cell checkbox">
                      <input 
                        type="checkbox" 
                        checked={selectedElements.includes(element.id)}
                        onChange={(e) => handleSelectElement(element.id, e.target.checked)}
                      />
                    </div>
                    <div className="table-cell name">
                      <div className="element-name">{element.name}</div>
                    </div>
                    <div className="table-cell type">
                      <span className="type-badge">{element.type.toUpperCase()}</span>
                    </div>
                    <div className="table-cell screen">
                      <span>testgenie.com...</span>
                    </div>
                    <div className="table-cell created">
                      <span>{element.lastModified}</span>
                      <button className="view-btn">View</button>
                    </div>
                    <div className="table-cell affected">
                      <span>-</span>
                    </div>
                    <div className="table-cell reviewer">
                      <span>-</span>
                    </div>
                    <div className="table-cell status">
                      <span className={`status-indicator ${element.status}`}>
                        <span className="status-dot"></span>
                        Ready
                      </span>
                    </div>
                    <div className="table-cell actions">
                      <div className="overflow-menu-container">
                        <button 
                          className="more-btn"
                          onClick={() => setShowOverflowMenu(showOverflowMenu === element.id ? null : element.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="1"/>
                            <circle cx="12" cy="5" r="1"/>
                            <circle cx="12" cy="19" r="1"/>
                          </svg>
                        </button>
                        {showOverflowMenu === element.id && (
                          <div className="overflow-menu">
                            <button 
                              className="menu-item"
                              onClick={() => handleEditElement(element.id)}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                              Edit
                            </button>
                            <button 
                              className="menu-item danger"
                              onClick={() => handleDeleteElement(element.id)}
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
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21,15 16,10 5,21"/>
                    </svg>
                  </div>
                  <h3 className="empty-title">No Elements Yet</h3>
                  <p className="empty-description">Add UI elements to start building your test automation</p>
                  <button 
                    className="btn-primary"
                    onClick={() => router.push(`/dashboard/project/${projectId}/elements/create`)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Create Element
                  </button>
                </div>
              )}
          </div>
        </main>
      </div>
    </div>
  );
}
