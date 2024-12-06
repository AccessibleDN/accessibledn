import { NextRequest, NextResponse } from 'next/server';
import { ServerDatabase } from '~/server/ServerDatabase';
import { ServerRatelimits } from '~/server/ServerRatelimits';
import config from '~/appconfig/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
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

        const { username, password, email } = body;

        // Validate and prepare user data
        let userData;
        try {
            userData = await UserUtils.prepareUserData(username, email, password);
        } catch (error) {
            return NextResponse.json(
                { error: (error as Error).message },
                { status: 400 }
            );
        }

        // Check uniqueness
        const db = await ServerDatabase.getInstance(config.authentication.database);
        const existingUser = await db.query<any[]>(
            'SELECT username, email FROM users WHERE username = ? OR email = ?',
            [userData.username, userData.email]
        );

        if (existingUser.length > 0) {
            const field = existingUser[0].username === userData.username ? 'Username' : 'Email';
            return NextResponse.json(
                { error: `${field} already exists` },
                { status: 409 }
            );
        }

        // Create user
        await db.exec(
            'INSERT INTO users (username, password, email, created_at) VALUES (?, ?, ?, ?)',
            [userData.username, userData.hashedPassword, userData.email, userData.created_at]
        );

        // Generate session token
        const token = UserUtils.generateSessionToken(userData.username, userData.email);

        return NextResponse.json(
            { 
                message: 'User created successfully',
                token: token
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        // Check if authentication is enabled
        if (!config.authentication.enabled) {
            return NextResponse.json(
                { error: 'Authentication is not enabled' },
                { status: 403 }
            );
        }

        // Validate token
        const authHeader = request.headers.get('authorization');
        try {
            const token = UserUtils.extractBearerToken(authHeader);
            const decoded = UserUtils.validateSessionToken(token);
            
            // Check rate limit
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

            const { username } = body;

            // Validate required fields
            if (!username?.trim()) {
                return NextResponse.json(
                    { error: 'Username is required' },
                    { status: 400 }
                );
            }

            // Verify token username matches requested username for deletion
            if (decoded.username !== username) {
                return NextResponse.json(
                    { error: 'Unauthorized to delete this user' },
                    { status: 403 }
                );
            }

            // Delete user and get affected rows
            const db = await ServerDatabase.getInstance(config.authentication.database);
            const result = await db.exec(
                'DELETE FROM users WHERE username = ?',
                [username.toLowerCase()]
            );

            // Check if user was actually deleted
            if (!result) {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { message: 'User deleted successfully' },
                { status: 200 }
            );

        } catch (error) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
