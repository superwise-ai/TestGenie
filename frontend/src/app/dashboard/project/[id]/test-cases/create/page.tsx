'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProjectSidebar from '../../../../../components/ProjectSidebar';

  interface TestStep {
    id: number;
    action: string;
    element: string;
    value: string;
  }

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

interface TestCase {
  id: number;
  name: string;
  description: string;
  status: 'draft' | 'in-review' | 'ready' | 'obsolete' | 'rework';
  priority: 'critical' | 'major' | 'medium' | 'minor';
  assignee: string;
  reviewer: string;
  browsers: string[];
  environment: string;
  lastModified: string;
  createdBy: string;
  steps: TestStep[];
}

export default function CreateTestCasePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [elements, setElements] = useState<Element[]>([]);
  const [environments, setEnvironments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'draft' as 'draft' | 'in-review' | 'ready' | 'obsolete' | 'rework',
    priority: 'medium' as 'critical' | 'major' | 'medium' | 'minor',
    assignee: '',
    reviewer: '',
    browsers: ['chrome'] as string[],
    environment: ''
  });
  const [steps, setSteps] = useState<TestStep[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<{[key: string]: boolean}>({});
  const [searchTerms, setSearchTerms] = useState<{[key: string]: string}>({});
  const [elementDisplayNames, setElementDisplayNames] = useState<{[key: string]: string}>({});
  const [actionDisplayNames, setActionDisplayNames] = useState<{[key: string]: string}>({});
  const [draggedStepId, setDraggedStepId] = useState<number | null>(null);

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

    // Load elements from localStorage
    const savedElements = localStorage.getItem(`testgenie-elements-${projectId}`);
    if (savedElements) {
      try {
        setElements(JSON.parse(savedElements));
      } catch (error) {
        console.error('Error loading elements:', error);
      }
    }

    // Load environments from localStorage
    const savedEnvironments = localStorage.getItem(`testgenie-environments-${projectId}`);
    if (savedEnvironments) {
      try {
        setEnvironments(JSON.parse(savedEnvironments));
      } catch (error) {
        console.error('Error loading environments:', error);
      }
    }

    setLoading(false);
  }, [projectId]);

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

  const handleBrowserChange = (browser: string) => {
    setFormData(prev => ({
      ...prev,
      browsers: [browser]
    }));
  };

  const addStep = () => {
    const newStep: TestStep = {
      id: Date.now(),
      action: '',
      element: '',
      value: ''
    };
    setSteps(prev => [...prev, newStep]);
  };

  const updateStep = (stepId: number, field: keyof TestStep, value: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, [field]: value } : step
    ));
  };

  const removeStep = (stepId: number) => {
    setSteps(prev => prev.filter(step => step.id !== stepId));
  };

  const handleDragStart = (e: React.DragEvent, stepId: number) => {
    setDraggedStepId(stepId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStepId: number) => {
    e.preventDefault();
    
    if (draggedStepId === null || draggedStepId === targetStepId) {
      setDraggedStepId(null);
      return;
    }

    const draggedIndex = steps.findIndex(step => step.id === draggedStepId);
    const targetIndex = steps.findIndex(step => step.id === targetStepId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedStepId(null);
      return;
    }

    const newSteps = [...steps];
    const draggedStep = newSteps[draggedIndex];
    
    // Remove the dragged step
    newSteps.splice(draggedIndex, 1);
    
    // Insert at the target position
    newSteps.splice(targetIndex, 0, draggedStep);
    
    setSteps(newSteps);
    setDraggedStepId(null);
  };

  const handleDragEnd = () => {
    setDraggedStepId(null);
  };

  const toggleDropdown = (stepId: number, field: string) => {
    const key = `${stepId}-${field}`;
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSearchChange = (stepId: number, field: string, value: string) => {
    const key = `${stepId}-${field}`;
    setSearchTerms(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const selectOption = (stepId: number, field: keyof TestStep, value: string, displayName?: string) => {
    updateStep(stepId, field, value);
    const key = `${stepId}-${field}`;
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: false
    }));
    setSearchTerms(prev => ({
      ...prev,
      [key]: ''
    }));
    if (displayName) {
      if (field === 'element') {
        setElementDisplayNames(prev => ({
          ...prev,
          [key]: displayName
        }));
      } else if (field === 'action') {
        setActionDisplayNames(prev => ({
          ...prev,
          [key]: displayName
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Test case name is required';
    }
    if (!formData.assignee.trim()) {
      newErrors.assignee = 'Assignee is required';
    }
    if (!formData.reviewer.trim()) {
      newErrors.reviewer = 'Reviewer is required';
    }
    if (formData.browsers.length === 0) {
      newErrors.browsers = 'Please select a browser';
    }
    if (!formData.environment) {
      newErrors.environment = 'Environment is required';
    }

    if (steps.length === 0) {
      newErrors.steps = 'At least one test step is required';
    }

    // Validate steps
    steps.forEach((step, index) => {
      if (!step.action.trim()) {
        newErrors[`step_${index}_action`] = 'Action is required';
      }
      if (!step.element.trim()) {
        newErrors[`step_${index}_element`] = 'Element is required';
      }
    });

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
      // Create new test case
      const newTestCase: TestCase = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assignee: formData.assignee,
        reviewer: formData.reviewer,
        browsers: formData.browsers,
        environment: formData.environment,
        lastModified: new Date().toISOString().split('T')[0],
        createdBy: 'Admin',
        steps: steps
      };

      // Load existing test cases
      const savedTestCases = localStorage.getItem(`testgenie-test-cases-${projectId}`);
      const existingTestCases = savedTestCases ? JSON.parse(savedTestCases) : [];
      
      // Add new test case
      const updatedTestCases = [...existingTestCases, newTestCase];
      
      // Save to localStorage
      localStorage.setItem(`testgenie-test-cases-${projectId}`, JSON.stringify(updatedTestCases));

      // Navigate back to test cases list
      router.push(`/dashboard/project/${projectId}/test-cases`);
    } catch (error) {
      console.error('Error creating test case:', error);
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

      {/* Main Content */}
      <div className="project-main-content">
        {/* Header */}
        <header className="project-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="project-title">Create Test Case</h1>
            </div>
            <div className="header-right">
              <Link 
                href={`/dashboard/project/${projectId}/test-cases`}
                className="btn-outline"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Test Cases
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="project-content">
          <div className="content-container">
            <form onSubmit={handleSubmit} className="create-form">
              {/* Basic Information */}
              <div className="form-section">
                <div className="section-header">
                  <h3>Test Case Information</h3>
                </div>
                <div className="form-content">
                  <div className="form-group">
                  <label htmlFor="name">
                    Test Case Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter test case name"
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`form-textarea ${errors.description ? 'error' : ''}`}
                    placeholder="Enter test case description"
                    rows={3}
                  />
                  {errors.description && <span className="error-message">{errors.description}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="status">
                      Status <span className="required">*</span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="draft">Draft</option>
                      <option value="in-review">In Review</option>
                      <option value="ready">Ready</option>
                      <option value="obsolete">Obsolete</option>
                      <option value="rework">Rework</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="priority">
                      Priority <span className="required">*</span>
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="critical">Critical</option>
                      <option value="major">Major</option>
                      <option value="medium">Medium</option>
                      <option value="minor">Minor</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="assignee">
                      Assignee <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="assignee"
                      name="assignee"
                      value={formData.assignee}
                      onChange={handleInputChange}
                      className={`form-input ${errors.assignee ? 'error' : ''}`}
                      placeholder="Enter assignee name"
                    />
                    {errors.assignee && <span className="error-message">{errors.assignee}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="reviewer">
                      Reviewer <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="reviewer"
                      name="reviewer"
                      value={formData.reviewer}
                      onChange={handleInputChange}
                      className={`form-input ${errors.reviewer ? 'error' : ''}`}
                      placeholder="Enter reviewer name"
                    />
                    {errors.reviewer && <span className="error-message">{errors.reviewer}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Browsers <span className="required">*</span>
                  </label>
                  <div className="browser-checkboxes">
                    {['chrome', 'firefox', 'edge'].map((browser) => (
                      <label key={browser} className="checkbox-label">
                        <input
                          type="radio"
                          name="browser"
                          value={browser}
                          checked={formData.browsers.includes(browser)}
                          onChange={() => handleBrowserChange(browser)}
                          className="checkbox-input"
                        />
                        <span className="checkbox-text">
                          {browser.charAt(0).toUpperCase() + browser.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.browsers && <span className="error-message">{errors.browsers}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="environment">
                    Environment <span className="required">*</span>
                  </label>
                  <select
                    id="environment"
                    name="environment"
                    value={formData.environment}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select Environment</option>
                    {environments.map((env) => (
                      <option key={env.id} value={env.id}>
                        {env.name}
                      </option>
                    ))}
                  </select>
                  {errors.environment && <span className="error-message">{errors.environment}</span>}
                </div>
                </div>
              </div>

              {/* Test Steps */}
              <div className="form-section test-steps-section">
                <div className="section-header">
                  <h3>Test Steps</h3>
                </div>
                <div className="form-content">
                  {errors.steps && <span className="error-message">{errors.steps}</span>}

                {steps.length === 0 ? (
                  <div className="empty-steps">
                    <div className="empty-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 12l2 2 4-4"/>
                        <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                        <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                        <path d="M13 12h3"/>
                        <path d="M8 12h3"/>
                      </svg>
                    </div>
                    <h4>No Test Steps Yet</h4>
                    <p>Add your first test step to define the test case behavior</p>
                    <button type="button" onClick={addStep} className="btn-primary">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                      Add First Step
                    </button>
                  </div>
                ) : (
                  <div className="steps-container">
                    {steps.map((step, index) => (
                      <div 
                        key={step.id} 
                        className={`step-item ${draggedStepId === step.id ? 'dragging' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, step.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, step.id)}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="step-fields">
                          <div className="drag-handle">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="9" cy="12" r="1"/>
                              <circle cx="9" cy="5" r="1"/>
                              <circle cx="9" cy="19" r="1"/>
                              <circle cx="20" cy="12" r="1"/>
                              <circle cx="20" cy="5" r="1"/>
                              <circle cx="20" cy="19" r="1"/>
                            </svg>
                          </div>
                          <div className="field-group">
                            <label>
                              Action <span className="required">*</span>
                            </label>
                            <div className="custom-dropdown">
                              <div 
                                className={`dropdown-trigger ${errors[`step_${index}_action`] ? 'error' : ''}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleDropdown(step.id, 'action');
                                }}
                              >
                                <span className={step.action ? 'selected-value' : 'placeholder'}>
                                  {actionDisplayNames[`${step.id}-action`] || step.action || 'Select Action'}
                                </span>
                                <svg 
                                  className={`dropdown-arrow ${openDropdowns[`${step.id}-action`] ? 'open' : ''}`}
                                  width="16" 
                                  height="16" 
                                  viewBox="0 0 24 24" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  strokeWidth="2"
                                >
                                  <polyline points="6,9 12,15 18,9"></polyline>
                                </svg>
                              </div>
                              {openDropdowns[`${step.id}-action`] && (
                                <div className="dropdown-content">
                                  <div className="search-container">
                                    <input
                                      type="text"
                                      placeholder="Type an action"
                                      value={searchTerms[`${step.id}-action`] || ''}
                                      onChange={(e) => handleSearchChange(step.id, 'action', e.target.value)}
                                      className="search-input"
                                    />
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <circle cx="11" cy="11" r="8"></circle>
                                      <path d="m21 21-4.35-4.35"></path>
                                    </svg>
                                  </div>
                                  <div className="options-label">Please select:</div>
                                  <div className="options-list">
                                    {['click', 'type', 'select', 'verify', 'wait', 'navigate']
                                      .filter(action => 
                                        action.toLowerCase().includes((searchTerms[`${step.id}-action`] || '').toLowerCase())
                                      )
                                      .map((action) => (
                                        <div
                                          key={action}
                                          className={`option-item ${step.action === action ? 'selected' : ''}`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            selectOption(step.id, 'action', action, action.charAt(0).toUpperCase() + action.slice(1));
                                          }}
                                        >
                                          {action.charAt(0).toUpperCase() + action.slice(1)}
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            {errors[`step_${index}_action`] && <span className="error-message">{errors[`step_${index}_action`]}</span>}
                          </div>

                            <div className="field-group">
                              <label>
                                Element <span className="required">*</span>
                              </label>
                            <div className="custom-dropdown">
                              <div 
                                className={`dropdown-trigger ${errors[`step_${index}_element`] ? 'error' : ''}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleDropdown(step.id, 'element');
                                }}
                              >
                                <span className={step.element ? 'selected-value' : 'placeholder'}>
                                  {elementDisplayNames[`${step.id}-element`] || step.element || 'Select Element'}
                                </span>
                                <svg 
                                  className={`dropdown-arrow ${openDropdowns[`${step.id}-element`] ? 'open' : ''}`}
                                  width="16" 
                                  height="16" 
                                  viewBox="0 0 24 24" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  strokeWidth="2"
                                >
                                  <polyline points="6,9 12,15 18,9"></polyline>
                                </svg>
                              </div>
                              {openDropdowns[`${step.id}-element`] && (
                                <div className="dropdown-content">
                                  <div className="search-container">
                                    <input
                                      type="text"
                                      placeholder="Type an element"
                                      value={searchTerms[`${step.id}-element`] || ''}
                                      onChange={(e) => handleSearchChange(step.id, 'element', e.target.value)}
                                      className="search-input"
                                    />
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <circle cx="11" cy="11" r="8"></circle>
                                      <path d="m21 21-4.35-4.35"></path>
                                    </svg>
                                  </div>
                                  <div className="options-label">Please select:</div>
                                  <div className="options-list">
                                    {elements
                                      .filter(element => 
                                        element.name.toLowerCase().includes((searchTerms[`${step.id}-element`] || '').toLowerCase()) ||
                                        element.selector.toLowerCase().includes((searchTerms[`${step.id}-element`] || '').toLowerCase())
                                      )
                                      .map((element) => (
                                        <div
                                          key={element.id}
                                          className={`option-item ${step.element === element.selector ? 'selected' : ''}`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            selectOption(step.id, 'element', element.selector, element.name);
                                          }}
                                        >
                                          {element.name}
                                        </div>
                                      ))}
                                    {elements.length === 0 && (
                                      <div className="option-item disabled">
                                        No elements available. <Link href={`/dashboard/project/${projectId}/elements/create`} className="text-link">Create element</Link>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            {errors[`step_${index}_element`] && <span className="error-message">{errors[`step_${index}_element`]}</span>}
                          </div>

                          <div className="field-group value-field-group">
                            <label>Value</label>
                            <div className="value-input-container">
                              <input
                                type="text"
                                value={step.value}
                                onChange={(e) => updateStep(step.id, 'value', e.target.value)}
                                className="form-input"
                                placeholder="Value to enter or verify"
                              />
                              <button
                                type="button"
                                onClick={addStep}
                                className="btn-add-inline"
                                title="Add Step"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 5v14M5 12h14"/>
                                </svg>
                              </button>
                              {steps.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeStep(step.id)}
                                  className="btn-remove-inline"
                                  title="Remove Step"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12"/>
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/project/${projectId}/test-cases`)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Creating...' : 'Create Test Case'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
