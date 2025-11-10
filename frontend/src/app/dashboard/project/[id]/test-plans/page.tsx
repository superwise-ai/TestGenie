'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProjectSidebar from '../../../../components/ProjectSidebar';
import apiClient from '@/services/api';
import ReactMarkdown from 'react-markdown'

export default function TestPlansPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // AI Assistant states
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [aiInput, setAiInput] = useState('create test case plan for e-commerce business');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  // AI Assistant function
  const handleAiRequest = async () => {
    setAiLoading(true);
    try {
      const response = await apiClient.getAiTestPlans(parseInt(projectId));
      
      if (response.data) {
        // Extract the output from the response
        const aiOutput = response.data.output || response.data;
        setAiResponse(aiOutput);
      } else if (response.error) {
        setAiResponse(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error('Error calling AI test plans API:', error);
      setAiResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setAiLoading(false);
    }
  };

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
      
      setLoading(false);
    };

    loadData();
  }, [projectId]);

  if (loading) {
    return (
      <div className="project-detail-layout">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading test plans...</p>
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
                {/* Header */}
                <header className="project-header">
                  <div className="header-content">
                    <div className="header-left">
                      <h1 className="project-title">AI Test Plan Generator</h1>
                      <p>&nbsp;&nbsp;&nbsp;&nbsp;Generate comprehensive test plans using AI assistance</p>
                    </div>                    
                    <div className="header-right">
                    <button 
                        className="btn-primary ai-generate-btn"
                        onClick={handleAiRequest}
                        disabled={aiLoading}
                      >
                        {aiLoading ? (
                          <>
                            <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 12a9 9 0 11-6.219-8.56"/>
                            </svg>
                            Generating...
                          </>
                        ) : (
                          <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                            </svg>
                            Generate AI Test Plan
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </header>

                {/* AI Assistant Panel */}
                {showAiAssistant && (
                  <div className="ai-assistant-panel">
                    <div className="ai-assistant-header">
                      <h3>AI Test Plan Generator</h3>
                      <button 
                        className="close-btn"
                        onClick={() => setShowAiAssistant(false)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                    
                    <div className="ai-assistant-content">
                      <div className="ai-input-section">
                        <label htmlFor="ai-input">Describe what test plan you want to create:</label>
                        <div className="ai-input-group">
                          <input
                            id="ai-input"
                            type="text"
                            value={aiInput}
                            onChange={(e) => setAiInput(e.target.value)}
                            placeholder="e.g., create test case plan for e-commerce business"
                            className="ai-input"
                            onKeyPress={(e) => e.key === 'Enter' && handleAiRequest()}
                          />
                          <button 
                            className="ai-submit-btn"
                            onClick={handleAiRequest}
                            disabled={aiLoading || !aiInput.trim()}
                          >
                            {aiLoading ? (
                              <div className="spinner"></div>
                            ) : (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="22" y1="2" x2="11" y2="13"/>
                                <polygon points="22,2 15,22 11,13 22,2"/>
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {aiResponse && (
                        <div className="ai-response-section">
                          <h4>AI Response:</h4>
                          <div className="ai-response-content">
                            <pre>{aiResponse}</pre>
                          </div>
                        </div>
                      )}
                      
                      {chatHistory.length > 0 && (
                        <div className="chat-history-section">
                          <h4>Chat History:</h4>
                          <div className="chat-history">
                            {chatHistory.map((message, index) => (
                              <div key={index} className={`chat-message ${message.role}`}>
                                <strong>{message.role === 'user' ? 'You' : 'AI'}:</strong>
                                <p>{message.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* AI Assistant Section */}
                <div className="test-plans-section">
                  <div className="ai-assistant-container">                                       
                    <div className="ai-assistant-content">                                            
                      {aiResponse && (
                        <div className="ai-response-container">
                          <div className="ai-response-header">
                            <h4>Generated Test Plan</h4>
                            <button 
                              className="btn-outline btn-sm"
                              onClick={() => setAiResponse('')}
                            >
                              Clear
                            </button>
                          </div>
                          <div className="ai-response-content">
                            <div className="ai-response-text">
                              <ReactMarkdown>{aiResponse}</ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
          </div>
        </main>
      </div>
    </div>
  );
}