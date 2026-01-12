/**
 * API endpoint to receive client-side logs and write to session-specific files
 * POST /api/log
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeLog, generateSessionId, getSessionIdFromCookie } from '@/lib/server-logger';

interface LogRequestBody {
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  source: string;
  message: string;
  data?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    // Get or create session ID from cookie
    let sessionId = request.cookies.get('relogate_log_session')?.value;
    const isNewSession = !sessionId;

    if (!sessionId) {
      sessionId = generateSessionId();
    }

    // Parse request body
    const body: LogRequestBody = await request.json();
    const { level, source, message, data } = body;

    // Validate required fields
    if (!level || !source || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: level, source, message' },
        { status: 400 }
      );
    }

    // Add client-side indicator and request metadata
    const enrichedData = {
      ...data,
      _client: true,
      _userAgent: request.headers.get('user-agent')?.substring(0, 100),
      _url: request.headers.get('referer'),
    };

    // Write log to file
    writeLog(sessionId, level, `[CLIENT] ${source}`, message, enrichedData);

    // Create response with session cookie if new
    const response = NextResponse.json({
      success: true,
      sessionId,
      isNewSession
    });

    // Set session cookie if this is a new session
    if (isNewSession) {
      response.cookies.set('relogate_log_session', sessionId, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      });
    }

    return response;
  } catch (error) {
    console.error('Log API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process log' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve current session ID
export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get('relogate_log_session')?.value;

  return NextResponse.json({
    success: true,
    sessionId: sessionId || null,
    hasSession: !!sessionId,
  });
}
