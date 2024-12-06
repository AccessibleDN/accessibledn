import { NextRequest, NextResponse } from 'next/server';
import { ServerDatabase } from '~/server/ServerDatabase';
import { ServerRatelimits } from '~/server/ServerRatelimits';
import config from '~/appconfig/config';
import { UserUtils } from '~/server/UserUtils';

export async function POST(request: NextRequest) {
    try {
        // Check if authentication is enabled
        if (!config.authentication.enabled) {
            return NextResponse.json(
                { error: 'Authentication is not enabled' },
                { status: 403 }
            );
        }

        // Check if already logged in
        const authHeader = request.headers.get('authorization');
        if (authHeader) {
            try {
                const token = UserUtils.extractBearerToken(authHeader);
                const decoded = UserUtils.validateSessionToken(token);
                
                // Verify user still exists in database
                const db = await ServerDatabase.getInstance(config.authentication.database);
                const users = await db.query<any[]>(
                    'SELECT * FROM users WHERE username = ?', 
                    [decoded.sub]
                );

                if (users.length === 0) {
                    throw new Error('User not found');
                }

                return NextResponse.json(
                    { error: 'Already logged in' },
                    { status: 400 }
                );
            } catch {
                // Token is invalid, continue with login process
            }
        }

        // Check rate limit early before any expensive operations
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('remote-addr') || 'unknown';
        const rateLimiter = ServerRatelimits.getInstance();
        if (!rateLimiter.checkRateLimit(ip)) {
            return NextResponse.json(
                { error: 'Too many requests' },
                { 
                    status: 429,
                    headers: {
                        'X-RateLimit-Remaining': rateLimiter.getRemainingRequests(ip).toString(),
                        'X-RateLimit-Reset': rateLimiter.getResetTime(ip).toString()
                    }
                }
            );
        }

        // Parse and validate request body
        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: 'Invalid JSON payload' },
                { status: 400 }
            );
        }

        const { username, password } = body;

        // Validate required fields
        if (!username?.trim() || !password?.trim()) {
            return NextResponse.json(
                { error: 'Missing username or password' },
                { status: 400 }
            );
        }

        // Get database instance
        const db = await ServerDatabase.getInstance(config.authentication.database);

        // Get user from database
        const users = await db.query<any[]>(
            'SELECT * FROM users WHERE username = ?',
            [username.toLowerCase()]
        );

        if (users.length === 0) {
            return NextResponse.json(
                { error: 'Invalid username or password' },
                { status: 401 }
            );
        }

        const user = users[0];

        // Verify password
        const passwordMatch = await UserUtils.verifyPassword(password, username, user.password);

        if (!passwordMatch) {
            return NextResponse.json(
                { error: 'Invalid username or password' },
                { status: 401 }
            );
        }

        // Generate session token
        const token = UserUtils.generateSessionToken(user.username, user.email);

        // Return sanitized user data and token
        return NextResponse.json({
            token,
            user: UserUtils.sanitizeUserData(user)
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
