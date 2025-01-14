import rateLimit from 'express-rate-limit';
import { AppError } from './error';
import logger from '../lib/logger';

// Rate limiter for contact form
export const contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many contact requests from this IP, please try again after an hour',
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    next(new AppError(429, options.message));
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  handler: (req, res, next, options) => {
    logger.warn(`API rate limit exceeded for IP: ${req.ip}`);
    next(new AppError(429, options.message));
  },
  standardHeaders: true,
  legacyHeaders: false,
}); 
