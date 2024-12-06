import { NextRequest, NextResponse } from 'next/server';
import { ServerDatabase } from '~/server/ServerDatabase';
import config from '~/appconfig/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserUtils } from '~/server/UserUtils';

export async function GET(request: NextRequest) {
    try {
        // Check if authentication is enabled
        if (!config.authentication.enabled) {
            return NextResponse.json(
                { error: 'Authentication is not enabled' },
                { status: 403 }
            );
        }

        // Get and validate token
        const authHeader = request.headers.get('authorization');
        try {
            const token = UserUtils.extractBearerToken(authHeader);
            const decoded = UserUtils.validateSessionToken(token);

            // Get user from database
            const db = await ServerDatabase.getInstance(config.authentication.database);
            const users = await db.query<any[]>(
                'SELECT * FROM users WHERE username = ?',
                [decoded.sub]
            );
            
            if (users.length === 0) {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                );
            }

            // Return sanitized user data
            return NextResponse.json(UserUtils.sanitizeUserData(users[0]));

        } catch (error) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

    } catch (error) {
        console.error('Session validation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}