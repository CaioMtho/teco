import { NextResponse } from "next/server";
import { HealthResponse } from "./health-response";
import os from "os";
import { memoryUsage } from "process";

export async function GET() {
    const healthResponse : HealthResponse = {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.API_VERSION || "1.0.0",
        environment: process.env.NODE_ENV || "development",
        hostname: os.hostname(),
        memoryUsage: memoryUsage(),
        dependencies: {
            database: "unknown" 
        }
    }
    return NextResponse.json({ status: "ok", body : healthResponse });
}