// Frontend configuration
// For client-side access, use NEXT_PUBLIC_ prefix for environment variables

export const config = {
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  
  // User Information (for UI display)
  defaultUser: {
    email: process.env.NEXT_PUBLIC_USER_EMAIL || 'admin@superwise.ai',
    fullName: process.env.NEXT_PUBLIC_USER_FULL_NAME || 'Admin',
    initials: process.env.NEXT_PUBLIC_USER_INITIALS || 'ADM',
  },
};

export default config;
