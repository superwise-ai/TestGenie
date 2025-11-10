'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProjectSidebar from '../../../../components/ProjectSidebar';
import apiClient from '@/services/api';
import ReactMarkdown from 'react-markdown';

interface TestCase {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  priority: 'high' | 'medium' | 'low';
  lastModified: string;
  createdBy: string;
}

interface AiTestCase {
  "Test Case Name": string;
  "Description": string;
  "Priority": string;
  "Browsers": string[];
  "Environment": string[];
  "Test Steps": string[];
}

export default function TestCasesPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  
  // AI Assistant states
  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTestCases, setAiTestCases] = useState<AiTestCase[]>([]);

  // AI Assistant function
  const handleAiRequest = async () => {
    setAiLoading(true);
    try {
      const response = await apiClient.getAiTestCases(parseInt(projectId));
      
      if (response.data) {
        // Extract the output from the response
        const aiOutput = (response.data as any).output || response.data;
        console.log('AI Output:', aiOutput); // Debug log
        
        try {
          // Try to extract JSON from the response (in case there's extra text)
          let jsonString = aiOutput;
          
          // Look for JSON array pattern
          const jsonMatch = aiOutput.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            jsonString = jsonMatch[0];
          }
          
          console.log('Extracted JSON:', jsonString); // Debug log
          
          // Try to parse as JSON
          const parsedData = JSON.parse(jsonString);
          console.log('Parsed Data:', parsedData); // Debug log
          
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            setAiTestCases(parsedData);
            setAiResponse(''); // Clear markdown response
            console.log('Set AI Test Cases:', parsedData); // Debug log
          } else {
            setAiResponse(aiOutput); // Fallback to markdown
            setAiTestCases([]);
            console.log('Fallback to markdown'); // Debug log
          }
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError); // Debug log
          // If not JSON, treat as markdown
          setAiResponse(aiOutput);
          setAiTestCases([]);
        }
      } else if (response.error) {
        setAiResponse(`Error: ${response.error}`);
        setAiTestCases([]);
      }
    } catch (error) {
      console.error('Error calling AI test cases API:', error);
      setAiResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setAiTestCases([]);
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
        
        // Load test cases from API
        const testCasesResponse = await apiClient.getTestCases(parseInt(projectId));
        if (testCasesResponse.data) {
          setTestCases(testCasesResponse.data as TestCase[]);
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
        
        // Fallback to localStorage for test cases
        const savedTestCases = localStorage.getItem(`testgenie-test-cases-${projectId}`);
        if (savedTestCases) {
          try {
            setTestCases(JSON.parse(savedTestCases));
          } catch (localError) {
            console.error('Error loading test cases from localStorage:', localError);
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
          <p>Loading test cases...</p>
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
           
              <>
                {/* Header */}
                <header className="project-header">
                  <div className="header-content">
                    <div className="header-left">
                      <h1 className="project-title">AI Test Cases Generator</h1>
                      <p>&nbsp;&nbsp;&nbsp; Generate comprehensive test cases using AI assistance</p>
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
                            Generate AI Test Cases
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </header>

                {/* AI Response Section */}
                {aiResponse && (
                  <div className="ai-response-container">
                    <div className="ai-response-header">
                      <h4>Generated Test Cases</h4>
                      <button 
                        className="btn-outline btn-sm"
                        onClick={() => {
                          setAiResponse('');
                          setAiTestCases([]);
                        }}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="ai-response-content">
                      <div className="ai-response-text">
                        <ReactMarkdown components={{
                          h1: ({children}) => <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937'}}>{children}</h1>,
                          h2: ({children}) => <h2 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#1f2937'}}>{children}</h2>,
                          h3: ({children}) => <h3 style={{fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937'}}>{children}</h3>,
                          p: ({children}) => <p style={{marginBottom: '0.75rem'}}>{children}</p>,
                          ul: ({children}) => <ul style={{marginBottom: '0.75rem', paddingLeft: '1.5rem'}}>{children}</ul>,
                          ol: ({children}) => <ol style={{marginBottom: '0.75rem', paddingLeft: '1.5rem'}}>{children}</ol>,
                          li: ({children}) => <li style={{marginBottom: '0.25rem'}}>{children}</li>,
                          code: ({children}) => <code style={{backgroundColor: '#f3f4f6', padding: '0.125rem 0.25rem', borderRadius: '0.25rem', fontSize: '0.875rem', fontFamily: 'monospace'}}>{children}</code>,
                          pre: ({children}) => <pre style={{backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto', marginBottom: '0.75rem'}}>{children}</pre>,
                          blockquote: ({children}) => <blockquote style={{borderLeft: '4px solid #d1d5db', paddingLeft: '1rem', marginBottom: '0.75rem', fontStyle: 'italic'}}>{children}</blockquote>
                        }}>
                          {aiResponse}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Generated Test Cases Table */}
                {aiTestCases.length > 0 && (
                  <div className="ai-test-cases-section" style={{ marginBottom: '2rem' }}>
                    <div className="ai-test-cases-header" style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: '1rem',
                      padding: '1rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '0.5rem',
                      border: '1px solid #e2e8f0'
                    }}>
                      <h4 style={{ margin: 0, color: '#1f2937' }}>AI Generated Test Cases</h4>
                      <span className="test-cases-count" style={{ 
                        backgroundColor: '#3b82f6', 
                        color: 'white', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '1rem', 
                        fontSize: '0.875rem' 
                      }}>
                        {aiTestCases.length} test cases generated
                      </span>
                    </div>
                    <div style={{ overflowX: 'auto', borderRadius: '0.5rem' }}>
                    <div className="ai-test-cases-table" style={{
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      border: '1px solid #e2e8f0',
                      overflow: 'auto',
                      maxWidth: '100%'
                    }}>
                      <div className="table-header" style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 2fr 0.8fr 1.2fr 1.2fr 2fr',
                        gap: '1rem',
                        padding: '1rem',
                        backgroundColor: '#f8fafc',
                        borderBottom: '1px solid #e2e8f0',
                        fontWeight: '600',
                        color: '#374151',
                        minWidth: '1200px'
                      }}>
                        <div className="table-cell name">Test Case Name</div>
                        <div className="table-cell description">Description</div>
                        <div className="table-cell priority">Priority</div>
                        <div className="table-cell browsers">Browsers</div>
                        <div className="table-cell environment">Environment</div>
                        <div className="table-cell test-steps">Test Steps</div>
                      </div>
                      {aiTestCases.map((testCase, index) => (
                        <div key={index} className="table-row" style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 2fr 0.8fr 1.2fr 1.2fr 2fr',
                          gap: '1rem',
                          padding: '1rem',
                          borderBottom: index < aiTestCases.length - 1 ? '1px solid #f1f5f9' : 'none',
                          alignItems: 'start',
                          minWidth: '1200px'
                        }}>
                          <div className="table-cell name" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                            <div className="test-case-name" style={{ 
                              fontWeight: '500', 
                              color: '#1f2937',
                              wordBreak: 'break-word',
                              lineHeight: '1.4'
                            }}>
                              {testCase["Test Case Name"]}
                            </div>
                          </div>
                          <div className="table-cell description" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                            <div className="test-case-description" style={{ 
                              color: '#6b7280', 
                              fontSize: '0.875rem',
                              wordBreak: 'break-word',
                              lineHeight: '1.4',
                              whiteSpace: 'normal'
                            }}>
                              {testCase["Description"]}
                            </div>
                          </div>
                          <div className="table-cell priority">
                            <span className={`priority-indicator ${testCase["Priority"].toLowerCase()}`} style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              backgroundColor: testCase["Priority"].toLowerCase() === 'high' ? '#fef2f2' : 
                                             testCase["Priority"].toLowerCase() === 'medium' ? '#fef3c7' : '#f0fdf4',
                              color: testCase["Priority"].toLowerCase() === 'high' ? '#dc2626' : 
                                     testCase["Priority"].toLowerCase() === 'medium' ? '#d97706' : '#16a34a'
                            }}>
                              {testCase["Priority"]}
                            </span>
                          </div>
                          <div className="table-cell browsers">
                            <div className="browsers-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                              {testCase["Browsers"].map((browser, idx) => (
                                <span key={idx} className="browser-tag" style={{
                                  backgroundColor: '#e0e7ff',
                                  color: '#3730a3',
                                  padding: '0.125rem 0.375rem',
                                  borderRadius: '0.25rem',
                                  fontSize: '0.75rem'
                                }}>
                                  {browser}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="table-cell environment">
                            <div className="environment-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                              {testCase["Environment"].map((env, idx) => (
                                <span key={idx} className="environment-tag" style={{
                                  backgroundColor: '#f0fdf4',
                                  color: '#166534',
                                  padding: '0.125rem 0.375rem',
                                  borderRadius: '0.25rem',
                                  fontSize: '0.75rem'
                                }}>
                                  {env}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="table-cell test-steps" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                            <div className="test-steps-list">
                              <ol style={{ 
                                margin: 0, 
                                paddingLeft: '1rem', 
                                fontSize: '0.875rem', 
                                color: '#6b7280',
                                wordBreak: 'break-word',
                                lineHeight: '1.4'
                              }}>
                                {testCase["Test Steps"].map((step, idx) => (
                                  <li key={idx} style={{ 
                                    marginBottom: '0.5rem',
                                    wordBreak: 'break-word',
                                    whiteSpace: 'normal'
                                  }}>
                                    {step}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    </div>
                  </div>
                )}

                </>          
                
              
          </div>
        </main>
      </div>
    </div>
  );
}
