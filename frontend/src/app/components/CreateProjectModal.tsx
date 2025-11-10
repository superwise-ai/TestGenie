'use client';

import { useState } from 'react';
import apiClient from '../../services/api';
import { useRouter } from 'next/navigation';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: (project: any) => void;
}

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }: CreateProjectModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    applicationName: '',
    version: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.applicationName.trim()) {
      newErrors.applicationName = 'Application name is required';
    }
    
    if (!formData.version.trim()) {
      newErrors.version = 'Version is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await apiClient.createProject({
        name: formData.name,
        description: formData.description,
        application_name: formData.applicationName,
        version: formData.version
      });
      
      if (response.error) {
        setErrors({ general: response.error });
      } else if (response.data) {
        console.log('Project created:', response.data);
        
        // Notify parent component about the new project
        if (onProjectCreated) {
          onProjectCreated(response.data);
        }
        
        // Close modal
        onClose();
        
        // Reset form
        setFormData({
          name: '',
          description: '',
          applicationName: '',
          version: ''
        });
      }
    } catch (error) {
      console.error('Project creation error:', error);
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Project</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-banner">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Project Name *"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description *"
              rows={4}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                id="applicationName"
                name="applicationName"
                value={formData.applicationName}
                onChange={handleChange}
                placeholder="Application Name *"
                className={errors.applicationName ? 'error' : ''}
              />
              {errors.applicationName && <span className="error-message">{errors.applicationName}</span>}
            </div>

            <div className="form-group">
              <input
                type="text"
                id="version"
                name="version"
                value={formData.version}
                onChange={handleChange}
                placeholder="Version * (e.g., 1.0.0)"
                className={errors.version ? 'error' : ''}
              />
              {errors.version && <span className="error-message">{errors.version}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Project...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
