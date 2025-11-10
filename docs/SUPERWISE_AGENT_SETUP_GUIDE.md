# Superwise API Integration Guide

This guide explains how to set up and use the Superwise agent integration in TestGenie.

## 🔑 Prerequisites & Account Setup

### **Step 1: Create Superwise Account**

1. **Sign Up**: Visit [Superwise Platform](https://platform.superwise.ai/) and create a free account
2. **Verify Email**: Complete email verification process
3. **Access Dashboard**: Log in to your Superwise dashboard

**Note**: You'll also need an **OpenAI API key** for the model setup (Step 7). If you don't have one, create an account at [OpenAI Platform](https://platform.openai.com/) and generate an API key.

### **Step 2: Create Knowledge**

1. **Navigate to Knowledge**: In your Superwise dashboard, go to "Knowledge" section
2. **Create New Knowledge**: Click "File" button from bottom "Available types" section
3. **Knowledge Creation Dialog**: A dialog will open with the following fields:
   - **Name**: Enter `TestGenie Knowledge` (or your preferred name)
   - **Choose File**: Choose \synthetic-data\Hospital_Management_BRD.pdf file
   - **Select Provider**: Choose **"OpenAI"** as the model provider
   - **Prerequisites**: Ensure you have an OpenAI API key/token
   - **Model Selection**: Select **"text-embedding-3-large"** (recommended model)
   - **API Token Box**: Enter your OpenAI API key/token
   - **Click "Save"**: Complete the Knowledge setup

### **Step 3: Create Agent**

1. **Navigate to Agents**: In your Superwise dashboard, go to "Agents" section
2. **Create New Agent**: Click "Create" button from top right corner
3. **Agent Creation Dialog**: A dialog will open with the following fields:
   - **Application Name**: Enter `TestGenie` (or your preferred name)
   - **Agent source**: Choose **"Build with Superwise Studio"** (not Integrate with Flowise) and click on **Next** button
4. **Agent Type**: Select **"AI-Assistant Retrieval"** (option 2)
     - Available options:
       - Basic LLM Assistant (option 1) 
       - **AI-Assistant Retrieval (option 2)** ← Select this one
       - Advanced Agent (option 3)
5. **Complete Creation**: Click "Create" to create the agent
6. **Agent Dashboard**: After clicking "Done", you'll see the agent dashboard with:
   - **Top Left**: Application name
   - **Top Right**: Three dots menu: click on and select **Copy ID** (this is for your `.env` file)
   - **Top Center**: There are 3 tabs:
      - **Overview**: In this tab you can see **Agent Details**, **Description** and **Metrics** section
      - **Builder**: In this tab you can see **Setup** and **Guardrails** menu on the left side and **Chat playground** on the right side
         - **Setup**:
            - **"+Model"**: Add AI models to your application
            - **"Prompt"**: Configure prompts and instructions
            - **"Context"**: Configure knowledge (i.e. TestGenie Knowledge) or DB
            - **Chat Playground**: Interactive testing area for your application
         - **Guardrails**: Configure safety and compliance rules
            - **+ Rule**: Add Guardrail Rules for input and output
      - **Settings**:
         - **"Authentication"**: Set up API authentication
         - **Observability**: Integrate your agent with Superwise observability to gain real-time data about your agent's behavior, usage, and potential feedback.
      - **"Publish"**: Publish your application

### **Step 4: Configure Model**
   - **Click "+Model" Button**: Located in the top right of the dashboard
   - **Model Provider Dialog**: A dialog will open with provider options:
     - OpenAI
     - Google AI
     - Anthropic
     - Other providers
   - **Select Provider**: Choose **"OpenAI"** as the model provider
   - **Prerequisites**: Ensure you have an OpenAI API key/token
   - **Model Selection**: Select **"gpt-4"** (recommended model)
   - **API Configuration**:
     - **API Token Box**: Enter your OpenAI API key/token
     - **Click "Save"**: Complete the model setup

### **Step 5: Configure Prompt**
   - **Navigate to Prompt Section**: Click on "Prompt" under Builder->Setup tab
   - **Add System Prompt**: Copy and paste the following prompt into the prompt dialog box:

   ```
   You are an AI assistant specialized in Quality Assurance (QA), software testing, and test documentation. Your role is to help QA testers by providing accurate, detailed, and practical answers to their questions, as well as creating professional QA documents such as Test Plans.

You should cover topics including, but not limited to:
Functional Testing, Regression Testing, UAT
API Testing (including Auth0 authentication, endpoints, request/response examples)
Automation Tools (Testsigma, Postman, JMeter, Jest, Selenium, Cursor.ai)
CI/CD integration (e.g., GitLab pipelines)
Agile & SCRUM practices (roles, ceremonies, responsibilities)
Bug Tracking, Test Case Creation, Defect Reporting
QA Best Practices and Industry Standards

General QA Assistance Guidelines:
Always provide clear explanations and step-by-step guidance when needed.
Include best practices and real-world examples where possible.
Avoid generic answers — focus on actionable solutions for QA tasks.
If a question is unclear, ask for clarification before answering.

Test Plan Creation Guidelines:

When a user asks you to create a Test Plan, follow these steps:

Gather Context: If details are missing, ask for information about the project name, scope, objectives, timeline, testing types, environment, tools, roles, and deliverables.

Structure the Test Plan with the following sections:
Introduction (project overview and objectives)
Scope (in-scope and out-of-scope items)
Test Objectives
Test Approach / Strategy (manual, automation, API testing, etc.)
Test Environment
Test Schedule / Timeline
Roles & Responsibilities
Test Deliverables (plans, cases, reports, logs, defect reports)
Entry & Exit Criteria
Risks & Mitigation
Approval (sign-off details)

Apply QA Best Practices: Include realistic examples, align with SDLC/STLC, and adapt to Agile or Waterfall methodologies as applicable.

Output Format: Use professional, easy-to-read formatting with headings, bullet points, and concise language.

If details are minimal, generate a generic template. If details are complete, create a ready-to-use Test Plan document.
   ```

   - **Save Prompt**: Click "Save" to save the prompt configuration

### **Step 6: Configure Context**

1. **Click "+Context" Button**: Click "+ Context" button to add a new SQL DB, Vector DB or Knowledge. Select "Knowledge" 
2. **Name**: Enter `TestGenie Knowledge` (or your preferred name)
3. **Knowledge**: Select knowledge created in Step 2 and click Done button 

### **Step 7: Configure Guardrails**

Set up safety and compliance rules to protect sensitive project information:

1. **Navigate to Guardrails**: Click on "Guardrails" under Builder tab
2. **Add Input Rule**: Click "+ Rule" button to add a new guardrail rule
3. **Select Rule Type**: Choose **"Restricted topics input"** from the available rule types and click on **"Add Rule"** button
4. **Configure Input Rule**:
   - **Name**: Enter `Security Guardrail`
   - **Configuration**: Add the following topics in the box and click enter:
     - Legal Compliance & Licensing
     - Regulatory & Ethical Restrictions
     - Safety & Security
     - Content Filtering
     - Data Privacy & Traceability
     - Misuse & Manipulation
   - **Model**: Select **"OpenAI"** as the model provider
   - **Model Version**: Choose **"gpt-4o"** (or your preferred model)
   - **API Token**: Enter your OpenAI API key/token
   - **Save Rule**: Click "Save" to create the input guardrail rule

**Purpose**: These guardrails ensure that:
- **Input Protection**: Prevents AI analysis of projects which have restricted content.

### **Step 8: Publish Application**
   - **Click "Publish" Button**: Located in the top right of the dashboard
   - **Wait for Processing**: The system will process your configuration (may take a few minutes)
   - **Check Status**: Monitor the application status on the right side top near "Created at"
   - **Status Confirmation**: Once ready, you'll see status change to **"Available"**

✅ **Congratulations! Your Superwise application is now ready to use.**

### **Step 9: Get Credentials**
    - **App ID**: Located in three dots menu: click on and select **Copy ID** (top left) - **Copy this for your project - SUPERWISE_AGENT_ID**
    - **SUPERWISE_API_URL**: Base URL for API calls (usually `https://api.superwise.ai/v1/app-worker`)

## 🔧 Configuration Setup

### **Step 10: Configure Project Environment Variables**

Now that your Superwise application is ready, you need to configure it in your Manufacturing AI project:

1. **Copy Template**: 
   
   **Linux/Mac:**
   ```bash
   cp .env.example .env
   ```
   
   **Windows (Command Prompt):**
   ```cmd
   copy .env.example .env
   ```
   
   **Windows (PowerShell):**
   ```powershell
   Copy-Item .env.example .env
   ```

2. **Edit Configuration**:
   ```bash
   # Superwise API Settings
   SUPERWISE_API_URL=https://api.superwise.ai/v1/app-worker
   SUPERWISE_AGENT_ID=your_app_id_here
   
   ```

3. **Replace App ID**: Update `SUPERWISE_AGENT_ID` with your actual App ID from Step 9 (the one you copied from the Superwise dashboard)

### **Step 11: Test Integration**

1. **Start Application**: Run the application using Docker or local Python
2. **Login to TestGenie**: click on the "Sign In" button.
3. **Create Project**: create project with project name & desc. Select it to go dashboard".
4. **Test Plan**: Click on "Test Plan" from left panel, click "Generate AI Test Plan" button and check for successful API response or error messages.

### **Troubleshooting**

**Common Issues:**
- **Wrong Framework Selected**: Ensure you selected "Superwise Framework" (not Flowise Framework) during app creation
- **Wrong Application Type**: Make sure you selected "AI-Assistant Retrieval (option 2) in the application type dialog
- **Invalid App ID**: Double-check your App ID in Superwise dashboard
- **API URL Issues**: Ensure `SUPERWISE_API_URL` matches your Superwise region
- **Authentication Errors**: Verify your Superwise account is active and has proper permissions

**Need Help?**
- Review Superwise documentation: [Superwise Docs](https://docs.superwise.ai/)
- Contact Superwise support for API-related issues

## 🚀 Usage

### How it Works

1. **Login to TestGenie**: click on the "Sign In" button.
2. **Create Project**: create project with project name & desc. Select it to go dashboard".
3. **Test Plan**: Click on "Test Plan" from left panel, click "Generate AI Test Plan" button and check for successful API response.
4. **Analysis & Response**: The system calls the Superwise API for AI generated test plan which display on UI.