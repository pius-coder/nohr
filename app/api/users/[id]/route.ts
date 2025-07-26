/**
 * 🚀 API Route: /api/users/[id]
 * Route dynamique pour un utilisateur spécifique
 */

// 📊 Données d'exemple (même que dans /api/users)
const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin', created_at: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user', created_at: '2024-01-02T00:00:00Z' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'user', created_at: '2024-01-03T00:00:00Z' }
];

// 🎯 GET /api/users/[id] - Récupérer un utilisateur par ID
export const GET = (c: any) => {
  const start = Date.now();
  
  try {
    const id = parseInt(c.req.param('id'));
    
    if (isNaN(id)) {
      return c.json({
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a number'
      }, { status: 400 });
    }
    
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return c.json({
        success: false,
        error: 'User not found',
        message: `User with ID ${id} does not exist`
      }, { status: 404 });
    }
    
    const duration = Date.now() - start;
    
    // Headers de performance
    c.res.headers.set('X-Response-Time', `${duration}ms`);
    c.res.headers.set('X-Powered-By', 'NOHR-Framework');
    c.res.headers.set('Cache-Control', 'public, max-age=300');
    
    return c.json({
      success: true,
      data: user,
      framework: 'NOHR',
      route: `/api/users/${id}`,
      timestamp: new Date().toISOString()
    }, { status: 200 });
    
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to fetch user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

// 🎯 PUT /api/users/[id] - Mettre à jour un utilisateur
export const PUT = async (c: any) => {
  const start = Date.now();
  
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();
    
    if (isNaN(id)) {
      return c.json({
        success: false,
        error: 'Invalid user ID'
      }, { status: 400 });
    }
    
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return c.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }
    
    // Mettre à jour l'utilisateur
    users[userIndex] = { ...users[userIndex], ...body };
    
    const duration = Date.now() - start;
    c.res.headers.set('X-Response-Time', `${duration}ms`);
    c.res.headers.set('X-Powered-By', 'NOHR-Framework');
    
    return c.json({
      success: true,
      data: users[userIndex],
      message: 'User updated successfully'
    }, { status: 200 });
    
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to update user'
    }, { status: 500 });
  }
};

// 🎯 DELETE /api/users/[id] - Supprimer un utilisateur
export const DELETE = (c: any) => {
  const start = Date.now();
  
  try {
    const id = parseInt(c.req.param('id'));
    
    if (isNaN(id)) {
      return c.json({
        success: false,
        error: 'Invalid user ID'
      }, { status: 400 });
    }
    
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return c.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    
    const duration = Date.now() - start;
    c.res.headers.set('X-Response-Time', `${duration}ms`);
    c.res.headers.set('X-Powered-By', 'NOHR-Framework');
    
    return c.json({
      success: true,
      data: deletedUser,
      message: 'User deleted successfully'
    }, { status: 200 });
    
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to delete user'
    }, { status: 500 });
  }
};

// 🎯 PATCH /api/users/[id] - Mise à jour partielle
export const PATCH = async (c: any) => {
  const start = Date.now();
  
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();
    
    if (isNaN(id)) {
      return c.json({
        success: false,
        error: 'Invalid user ID'
      }, { status: 400 });
    }
    
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return c.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }
    
    // Mise à jour partielle
    Object.assign(users[userIndex], body);
    
    const duration = Date.now() - start;
    c.res.headers.set('X-Response-Time', `${duration}ms`);
    c.res.headers.set('X-Powered-By', 'NOHR-Framework');
    
    return c.json({
      success: true,
      data: users[userIndex],
      message: 'User partially updated successfully'
    }, { status: 200 });
    
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to patch user'
    }, { status: 500 });
  }
};
