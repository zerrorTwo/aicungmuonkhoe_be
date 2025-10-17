import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import {
  getEnvironmentOrigins,
  isOriginAllowed,
  logCorsInfo,
} from './cors.utils';

// CORS configuration for the application
export const corsConfig: CorsOptions = {
  origin: getEnvironmentOrigins(),

  credentials: true, // Important for cookies (refresh token)

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-CSRF-Token',
  ],

  // Optional: Set max age for preflight requests
  maxAge: 86400, // 24 hours
};

// Function to get dynamic CORS configuration based on environment
export const getDynamicCorsConfig = (): CorsOptions => {
  const allowedOrigins = getEnvironmentOrigins();

  // Log CORS info for debugging
  logCorsInfo(allowedOrigins);

  return {
    ...corsConfig,
    origin: (origin, callback) => {
      if (isOriginAllowed(origin || '', allowedOrigins)) {
        return callback(null, true);
      }

      console.warn(`CORS: Origin '${origin}' not allowed`);
      return callback(new Error('Not allowed by CORS'), false);
    },
  };
};
