// Get API base URL from environment variables
const getApiBaseUrl = (): string => {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  }
  
  // For server-side rendering, use the environment variable
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.detail || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(fullName: string, email: string, password: string) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ full_name: fullName, email, password }),
    });
  }

  // Projects
  async getProjects() {
    return this.request('/api/projects');
  }

  async getProject(projectId: number) {
    return this.request(`/api/projects/${projectId}`);
  }

  async createProject(projectData: any) {
    return this.request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(projectId: number, projectData: any) {
    return this.request(`/api/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(projectId: number) {
    return this.request(`/api/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  // Test Cases
  async getTestCases(projectId: number) {
    return this.request(`/api/projects/${projectId}/test-cases`);
  }

  async getTestCase(projectId: number, testCaseId: number) {
    return this.request(`/api/projects/${projectId}/test-cases/${testCaseId}`);
  }

  async createTestCase(projectId: number, testCaseData: any) {
    return this.request(`/api/projects/${projectId}/test-cases`, {
      method: 'POST',
      body: JSON.stringify(testCaseData),
    });
  }

  async updateTestCase(projectId: number, testCaseId: number, testCaseData: any) {
    return this.request(`/api/projects/${projectId}/test-cases/${testCaseId}`, {
      method: 'PUT',
      body: JSON.stringify(testCaseData),
    });
  }

  async deleteTestCase(projectId: number, testCaseId: number) {
    return this.request(`/api/projects/${projectId}/test-cases/${testCaseId}`, {
      method: 'DELETE',
    });
  }

  // Elements
  async getElements(projectId: number) {
    return this.request(`/api/projects/${projectId}/elements`);
  }

  async createElement(projectId: number, elementData: any) {
    return this.request(`/api/projects/${projectId}/elements`, {
      method: 'POST',
      body: JSON.stringify(elementData),
    });
  }

  // Test Suites
  async getTestSuites(projectId: number) {
    return this.request(`/api/projects/${projectId}/test-suites`);
  }

  async createTestSuite(projectId: number, testSuiteData: any) {
    return this.request(`/api/projects/${projectId}/test-suites`, {
      method: 'POST',
      body: JSON.stringify(testSuiteData),
    });
  }

  // Test Plans
  async getTestPlans(projectId: number) {
    return this.request(`/api/projects/${projectId}/test-plans`);
  }

  async createTestPlan(projectId: number, testPlanData: any) {
    return this.request(`/api/projects/${projectId}/test-plans`, {
      method: 'POST',
      body: JSON.stringify(testPlanData),
    });
  }

  // Test Data
  async getTestData(projectId: number) {
    return this.request(`/api/projects/${projectId}/test-data`);
  }

  async createTestData(projectId: number, testData: any) {
    return this.request(`/api/projects/${projectId}/test-data`, {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  }

  // Environments
  async getEnvironments(projectId: number) {
    return this.request(`/api/projects/${projectId}/environments`);
  }

  async createEnvironment(projectId: number, environmentData: any) {
    return this.request(`/api/projects/${projectId}/environments`, {
      method: 'POST',
      body: JSON.stringify(environmentData),
    });
  }

  // AI Assistant
  async callAiAssistant(projectId: number, input: string, chatHistory: any[] = []) {
    return this.request(`/api/projects/${projectId}/ai-assistant`, {
      method: 'POST',
      body: JSON.stringify({ input, chat_history: chatHistory }),
    });
  }

  // AI Test Plans
  async getAiTestPlans(projectId: number) {
    return this.request(`/api/projects/${projectId}/ai-test-plans`, {
      method: 'GET',
    });
  }

  // AI Test Cases
  async getAiTestCases(projectId: number) {
    return this.request(`/api/projects/${projectId}/ai-test-cases`, {
      method: 'GET',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;