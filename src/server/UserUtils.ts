import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

export class UserUtils {
    /**
     * Creates a double-hashed password using JWT-based salt and bcrypt
     */
    static async hashPassword(password: string, username: string): Promise<string> {
        const saltRounds = 12;
        
        // Create unique salt using JWT secret and timestamp
        const jwtSalt = jwt.sign({ 
            username,
            timestamp: Date.now()
        }, process.env.JWT_SECRET || 'default_secret');
        
        // First hash with JWT-based salt
        const jwtHashedPassword = await bcrypt.hash(password, jwtSalt);
        
        // Second hash with bcrypt's own salt
        return await bcrypt.hash(jwtHashedPassword, saltRounds);
    }

    /**
     * Verifies a password against a stored hash using the double-hash method
     */
    static async verifyPassword(password: string, username: string, storedHash: string): Promise<boolean> {
        // Create JWT salt for first verification step
        const jwtSalt = jwt.sign({ 
            username,
            timestamp: Date.now()
        }, process.env.JWT_SECRET || 'default_secret');

        // First hash with JWT-based salt
        const jwtHashedPassword = await bcrypt.hash(password, jwtSalt);
        
        // Then verify against the final stored hash
        return await bcrypt.compare(jwtHashedPassword, storedHash);
    }

    /**
     * Generates a JWT session token for a user
     */
    static generateSessionToken(username: string, email: string): string {
        return jwt.sign(
            {
                sub: username.toLowerCase(),
                username: username.toLowerCase(),
                email: email.toLowerCase()
            },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '24h' }
        );
    }

    /**
     * Validates an email address format
     */
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validates password strength
     */
    static isValidPassword(password: string): boolean {
        return password.length >= 8;
    }

    /**
     * Validates a session token and returns the decoded payload if valid
     */
    static validateSessionToken(token: string): JwtPayload {
        try {
            return jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as JwtPayload;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    /**
     * Validates username format and requirements
     */
    static isValidUsername(username: string): boolean {
        // Username should be 3-20 characters, alphanumeric with underscores/hyphens
        const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
        return usernameRegex.test(username);
    }

    /**
     * Prepares user data for storage by sanitizing and validating
     */
    static async prepareUserData(username: string, email: string, password: string): Promise<{
        username: string;
        email: string;
        hashedPassword: string;
        created_at: Date;
    }> {
        // Validate inputs
        if (!this.isValidUsername(username)) {
            throw new Error('Invalid username format');
        }
        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email format');
        }
        if (!this.isValidPassword(password)) {
            throw new Error('Password does not meet requirements');
        }

        // Normalize data
        const normalizedUsername = username.toLowerCase();
        const normalizedEmail = email.toLowerCase();

        // Hash password
        const hashedPassword = await this.hashPassword(password, normalizedUsername);

        return {
            username: normalizedUsername,
            email: normalizedEmail,
            hashedPassword,
            created_at: new Date()
        };
    }

    /**
     * Sanitizes user data for client response by removing sensitive fields
     */
    static sanitizeUserData(userData: any): any {
        const { password, hashedPassword, ...sanitizedData } = userData;
        return sanitizedData;
    }

    /**
     * Extracts and validates bearer token from authorization header
     */
    static extractBearerToken(authHeader: string | null): string {
        if (!authHeader?.startsWith('Bearer ')) {
            throw new Error('Missing or invalid authorization header');
        }
        return authHeader.split(' ')[1];
    }
}
