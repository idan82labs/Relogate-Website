/**
 * Server-side logging utility with session-specific file output
 * Logs are written to /logs/<session-id>.log
 */

import { appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const LOGS_DIR = join(process.cwd(), 'logs');

// Ensure logs directory exists
function ensureLogsDir(): void {
  if (!existsSync(LOGS_DIR)) {
    mkdirSync(LOGS_DIR, { recursive: true });
  }
}

// Generate a unique session ID
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
}

// Format log entry
function formatLogEntry(
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG',
  source: string,
  message: string,
  data?: Record<string, unknown>
): string {
  const timestamp = new Date().toISOString();
  const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
  return `[${timestamp}] [${level}] [${source}] ${message}${dataStr}\n`;
}

// Write log to session file
export function writeLog(
  sessionId: string,
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG',
  source: string,
  message: string,
  data?: Record<string, unknown>
): void {
  try {
    ensureLogsDir();
    const logFile = join(LOGS_DIR, `${sessionId}.log`);
    const entry = formatLogEntry(level, source, message, data);

    // Also log to console for immediate visibility
    console.log(`[Session: ${sessionId}] ${entry.trim()}`);

    // Append to session log file
    appendFileSync(logFile, entry, 'utf-8');
  } catch (error) {
    console.error('Failed to write log:', error);
  }
}

// Convenience methods
export function logInfo(sessionId: string, source: string, message: string, data?: Record<string, unknown>): void {
  writeLog(sessionId, 'INFO', source, message, data);
}

export function logWarn(sessionId: string, source: string, message: string, data?: Record<string, unknown>): void {
  writeLog(sessionId, 'WARN', source, message, data);
}

export function logError(sessionId: string, source: string, message: string, data?: Record<string, unknown>): void {
  writeLog(sessionId, 'ERROR', source, message, data);
}

export function logDebug(sessionId: string, source: string, message: string, data?: Record<string, unknown>): void {
  writeLog(sessionId, 'DEBUG', source, message, data);
}

// Get or create session ID from cookie value
export function getSessionIdFromCookie(cookieValue: string | undefined): string {
  if (cookieValue && cookieValue.length > 0) {
    return cookieValue;
  }
  return generateSessionId();
}
