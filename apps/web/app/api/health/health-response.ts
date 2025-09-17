export type HealthResponse = {
    timestamp : string,
    uptime : number,
    version : string,
    environment : string,
    hostname : string,
    memoryUsage : NodeJS.MemoryUsage,
    dependencies : {
        database: "connected" | "disconnected" | "unknown",
    }
}