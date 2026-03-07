import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // frontend-service — served via ALB
  // Backend service base URLs (set via environment variables in production)
  env: {
    NEXT_PUBLIC_AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://auth-service:4001',
    NEXT_PUBLIC_PROJECTS_SERVICE_URL: process.env.PROJECTS_SERVICE_URL || 'http://projects-service:4002',
    NEXT_PUBLIC_TASKS_SERVICE_URL: process.env.TASKS_SERVICE_URL || 'http://tasks-service:4003',
    NEXT_PUBLIC_ANALYTICS_SERVICE_URL: process.env.ANALYTICS_SERVICE_URL || 'http://analytics-service:4004',
  },
};

export default nextConfig;
