import { Logger } from '@nestjs/common';

const logger = new Logger('CORS');

/**
 * Log CORS configuration for debugging
 */
export const logCorsInfo = (allowedOrigins: string[] | boolean) => {
    logger.log('CORS Configuration:');

    if (Array.isArray(allowedOrigins)) {
        logger.log(`Allowed Origins: ${allowedOrigins.join(', ')}`);
    } else {
        logger.log(`Allow All Origins: ${allowedOrigins}`);
    }

    logger.log('Credentials: Enabled (for cookies)');
    logger.log('Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
};

/**
 * Get environment-specific allowed origins
 */
export const getEnvironmentOrigins = (): string[] => {
    const isDevelopment = process.env.NODE_ENV !== 'production';

    if (isDevelopment) {
        return [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:4173',
            'http://localhost:5174',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:4173',
            'http://127.0.0.1:5174',
        ];
    }

    // Production origins - should be loaded from environment variables
    const productionOrigins = process.env.ALLOWED_ORIGINS;
    if (productionOrigins) {
        return productionOrigins.split(',').map(origin => origin.trim());
    }

    // Default production origins (should be configured in production)
    return [
        'https://yourdomain.com',
        'https://www.yourdomain.com',
    ];
};

/**
 * Validate if an origin is allowed
 */
export const isOriginAllowed = (origin: string, allowedOrigins: string[]): boolean => {
    if (!origin) return true; // Allow requests with no origin (mobile apps, etc.)

    // Direct match
    if (allowedOrigins.includes(origin)) {
        return true;
    }

    // In development, allow any localhost
    if (process.env.NODE_ENV !== 'production') {
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return true;
        }
    }

    return false;
};