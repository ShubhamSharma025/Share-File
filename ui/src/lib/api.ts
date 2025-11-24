// API configuration for development and production environments

export const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api'  // Nginx will proxy this in production
    : '/api'; // Next.js dev server will proxy this in development

/**
 * Get the full download URL for a given port
 * In production, uses the current domain
 * In development, uses localhost
 */
export const getDownloadUrl = (port: string): string => {
    if (typeof window === 'undefined') {
        // Server-side rendering
        return `/api/download/${port}`;
    }

    if (process.env.NODE_ENV === 'production') {
        // In production, use the public domain/IP
        return `${window.location.protocol}//${window.location.host}/api/download/${port}`;
    }

    // In development, use localhost
    return `/api/download/${port}`;
};

/**
 * Get the upload endpoint URL
 */
export const getUploadUrl = (): string => {
    return `${API_BASE_URL}/upload`;
};

/**
 * Check if the application is running in production
 */
export const isProduction = (): boolean => {
    return process.env.NODE_ENV === 'production';
};

/**
 * Get the base URL for the application
 */
export const getBaseUrl = (): string => {
    if (typeof window === 'undefined') {
        // Server-side
        return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    }

    // Client-side
    return `${window.location.protocol}//${window.location.host}`;
};
