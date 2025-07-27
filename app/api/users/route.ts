/**
 * 🚀 API Route: /api/users
 * Exemple de route API avec file-based routing NOHR
 */

// 📊 Données d'exemple
const users = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    role: "admin",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@example.com",
    role: "user",
    created_at: "2024-01-02T00:00:00Z",
  },
  {
    id: 3,
    name: "Charlie",
    email: "charlie@example.com",
    role: "user",
    created_at: "2024-01-03T00:00:00Z",
  },
];

// 🎯 GET /api/users - Récupérer tous les utilisateurs
export function GET(c: any) {
  const start = Date.now();

  try {
    const response = {
      success: true,
      data: users,
      count: users.length,
      timestamp: new Date().toISOString(),
      framework: "NOHR",
      route: "/api/users",
    };

    const duration = Date.now() - start;

    // Headers de performance
    c.res.headers.set("X-Response-Time", `${duration}ms`);
    c.res.headers.set("X-Powered-By", "NOHR-Framework");
    c.res.headers.set("Cache-Control", "public, max-age=300");

    return c.json(response, { status: 200 });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Failed to fetch users",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// 🎯 POST /api/users - Créer un nouvel utilisateur
export async function POST(c: any) {
  const start = Date.now();

  try {
    const body = await c.req.json();

    // Validation basique
    if (!body.name || !body.email) {
      return c.json(
        {
          success: false,
          error: "Name and email are required",
          provided: body,
        },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingUser = users.find((u) => u.email === body.email);
    if (existingUser) {
      return c.json(
        {
          success: false,
          error: "Email already exists",
          email: body.email,
        },
        { status: 409 }
      );
    }

    // Créer le nouvel utilisateur
    const newUser = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      name: body.name,
      email: body.email,
      role: body.role || "user",
      created_at: new Date().toISOString(),
    };

    users.push(newUser);

    const duration = Date.now() - start;

    // Headers de performance
    c.res.headers.set("X-Response-Time", `${duration}ms`);
    c.res.headers.set("X-Powered-By", "NOHR-Framework");

    return c.json(
      {
        success: true,
        data: newUser,
        message: "User created successfully",
        total_users: users.length,
      },
      { status: 201 }
    );
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Failed to create user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// 🎯 PUT /api/users - Mettre à jour tous les utilisateurs (bulk update)
export async function PUT(c: any) {
  const start = Date.now();

  try {
    const body = await c.req.json();

    if (!Array.isArray(body)) {
      return c.json(
        {
          success: false,
          error: "Expected an array of users for bulk update",
        },
        { status: 400 }
      );
    }

    // Simuler une mise à jour en masse
    const updatedCount = body.length;

    const duration = Date.now() - start;

    c.res.headers.set("X-Response-Time", `${duration}ms`);
    c.res.headers.set("X-Powered-By", "NOHR-Framework");

    return c.json(
      {
        success: true,
        message: `Bulk update completed for ${updatedCount} users`,
        updated_count: updatedCount,
        total_users: users.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Failed to bulk update users",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// 🎯 DELETE /api/users - Supprimer tous les utilisateurs (dangereux!)
export function DELETE(c: any) {
  const start = Date.now();

  try {
    const deletedCount = users.length;

    // En réalité, on ne vide pas le tableau pour garder les données de démo
    // users.length = 0;

    const duration = Date.now() - start;

    c.res.headers.set("X-Response-Time", `${duration}ms`);
    c.res.headers.set("X-Powered-By", "NOHR-Framework");

    return c.json(
      {
        success: true,
        message: `Would delete all ${deletedCount} users (disabled for demo)`,
        deleted_count: 0, // Pas vraiment supprimé
        remaining_users: users.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Failed to delete users",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
