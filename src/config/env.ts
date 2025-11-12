const PORT = process.env.PORT || 3000;

export const env = {
    port: Number(PORT),
    nodeEnv: process.env.NODE_ENV || "development",
    nats: process.env.NATS,
    redis: process.env.REDIS_URL || "redis://localhost:6379",
};