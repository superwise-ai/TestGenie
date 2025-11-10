'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProjectSidebar from '../../../../components/ProjectSidebar';

export default function AIAssistantPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for iframe
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const apiToken = '7d1a71b2-e065-4336-8e65-de28c916d49b';
      
      const messageHandler = (event: MessageEvent) => {
        if (event.data.type === 'getApiToken') {
          event.source?.postMessage(
            {
              type: 'apiTokenResponse',
              apiToken,
            },
            event.origin,
          );
        }
      };

      window.addEventListener('message', messageHandler);

      return () => {
        window.removeEventListener('message', messageHandler);
      };
    }
  }, []);

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
                <h1>TestGenie AI Assistant</h1>
                <p>Get intelligent assistance with your test automation tasks</p>
              </div>
              <div className="header-right">
                <div className="ai-status">
                  <div className="status-indicator">
                    <div className="status-dot"></div>
                    <span>AI Assistant Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="ai-assistant-container">
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
                <h3>Loading AI Assistant...</h3>
                <p>Preparing your intelligent test automation assistant</p>
              </div>
            ) : (
              <div className="iframe-container">
                <iframe
                  src="https://app.superwise.ai/agent-embed/81244be2-569b-4730-af1b-f2b70d6737fa"
                  style={{ border: 0 }}
                  width="100%"
                  height="700px"
                  title="TestGenie AI Assistant"
                  allow="microphone; camera; geolocation"
                />
              </div>
            )}
          </div>

          <div className="ai-info-section">
            <div className="info-card">
              <div className="info-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <h3>How to Use the AI Assistant</h3>
              </div>
              <div className="info-content">
                <ul>
                  <li>Ask questions about test automation best practices</li>
                  <li>Get help with writing test cases and test scripts</li>
                  <li>Request assistance with debugging test failures</li>
                  <li>Learn about different testing frameworks and tools</li>
                  <li>Get recommendations for improving test coverage</li>
                </ul>
              </div>
            </div>

            <div className="info-card">
              <div className="info-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                  <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
                  <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"/>
                </svg>
                <h3>AI Capabilities</h3>
              </div>
              <div className="info-content">
                <ul>
                  <li>Natural language processing for test queries</li>
                  <li>Code generation and optimization suggestions</li>
                  <li>Test strategy and planning assistance</li>
                  <li>Integration with your current test framework</li>
                  <li>Real-time problem-solving and debugging help</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
