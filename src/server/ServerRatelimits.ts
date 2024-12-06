interface RateLimitConfig {
    windowMs: number;  // Time window in milliseconds
    maxRequests: number; // Maximum requests allowed in window
}

interface RateLimitRecord {
    count: number;
    resetTime: number;
}

export class ServerRatelimits {
    private static instance: ServerRatelimits;
    private limits: Map<string, RateLimitRecord>;
    private config: RateLimitConfig;

    private constructor(config: RateLimitConfig = {
        windowMs: 60 * 1000, // 1 minute default
        maxRequests: 100     // 100 requests per minute default
    }) {
        this.limits = new Map();
        this.config = config;
    }

    public static getInstance(config?: RateLimitConfig): ServerRatelimits {
        if (!ServerRatelimits.instance) {
            ServerRatelimits.instance = new ServerRatelimits(config);
        }
        return ServerRatelimits.instance;
    }

    public checkRateLimit(identifier: string): boolean {
        const now = Date.now();
        const record = this.limits.get(identifier);

        // If no record exists or window has expired, create new record
        if (!record || now > record.resetTime) {
            this.limits.set(identifier, {
                count: 1,
                resetTime: now + this.config.windowMs
            });
            return true;
        }

        // Increment count if within limits
        if (record.count < this.config.maxRequests) {
            record.count++;
            return true;
        }

        return false;
    }

    public getRemainingRequests(identifier: string): number {
        const record = this.limits.get(identifier);
        if (!record || Date.now() > record.resetTime) {
            return this.config.maxRequests;
        }
        return Math.max(0, this.config.maxRequests - record.count);
    }

    public getResetTime(identifier: string): number {
        const record = this.limits.get(identifier);
        if (!record || Date.now() > record.resetTime) {
            return Date.now() + this.config.windowMs;
        }
        return record.resetTime;
    }

    public clearRateLimit(identifier: string): void {
        this.limits.delete(identifier);
    }

    public clearAllRateLimits(): void {
        this.limits.clear();
    }
}
