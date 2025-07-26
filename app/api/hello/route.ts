import { Hono } from "hono";

const app = new Hono();

// 🎯 Middleware de performance pour les API routes
app.use("*", async (c, next) => {
  const start = Date.now();

  await next();

  const duration = Date.now() - start;

  // Ajouter les headers de performance
  c.res.headers.set("X-Response-Time", `${duration}ms`);
  c.res.headers.set("X-Powered-By", "NOHR-Framework");

  // Log des métriques (en développement)
  if (process.env.NODE_ENV !== "production") {
    console.log(`🎯 API ${c.req.method} ${c.req.path} - ${duration}ms`);
  }
});

// 🎯 Route GET /api/hello - Optimisée avec cache headers
app.get("/", (c) => {
  const data = {
    message: "Hello from NOHR API! 🚀",
    success: true,
    timestamp: new Date().toISOString(),
    architecture: "Node.js + Hono + React",
    version: "1.0.0",
    performance: {
      framework: "NOHR",
      runtime: "Node.js",
      ssr: true,
      hydration: "optimized",
    },
    features: [
      "Server-Side Rendering",
      "API Routes intégrées",
      "TypeScript natif",
      "Performance optimale",
      "Compression Gzip",
      "Métriques temps réel",
      "pnpm package manager",
    ],
    benchmarks: {
      bundle_size: "~0.3MB",
      hydration_time: "~60ms",
      ssr_render: "~20ms",
    },
  };

  // Headers de cache pour optimiser les performances
  c.res.headers.set("Cache-Control", "public, max-age=300, s-maxage=600");
  c.res.headers.set("ETag", `"nohr-hello-${Date.now()}"`);

  return c.json(data, { status: 200 });
});

// 🎯 Route POST /api/hello - Test d'API POST
app.post("/", async (c) => {
  try {
    const body = await c.req.json();

    const response = {
      message: "POST request received successfully! 📨",
      success: true,
      received_data: body,
      timestamp: new Date().toISOString(),
      framework: "NOHR",
    };

    return c.json(response, { status: 201 });
  } catch (error) {
    return c.json(
      {
        message: "Invalid JSON in request body",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
});

// 🎯 Route GET /api/hello/health - Health check
app.get("/health", (c) => {
  const healthData = {
    status: "healthy",
    framework: "NOHR",
    runtime: "Node.js",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  };

  // Headers pour éviter la mise en cache des health checks
  c.res.headers.set("Cache-Control", "no-cache");
  return c.json(healthData, { status: 200 });
});

export default app;
