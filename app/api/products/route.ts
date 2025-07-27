// 🚀 NOHR API Route Example - Products
// Convention: Export HTTP methods as named functions

import { Context } from 'hono';

// Mock database
const products = [
  { id: '1', name: 'Laptop', price: 999, category: 'Electronics' },
  { id: '2', name: 'Book', price: 29, category: 'Education' },
  { id: '3', name: 'Coffee Mug', price: 15, category: 'Kitchen' }
];

/**
 * GET /api/products - Récupère tous les produits
 */
export async function GET(c: Context) {
  console.log('[API] GET /api/products');
  
  // Simulate some processing time
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return c.json({
    success: true,
    data: products,
    count: products.length,
    timestamp: new Date().toISOString()
  });
}

/**
 * POST /api/products - Crée un nouveau produit
 */
export async function POST(c: Context) {
  console.log('[API] POST /api/products');
  
  try {
    const body = await c.req.json();
    
    // Basic validation
    if (!body.name || !body.price) {
      return c.json({
        success: false,
        error: 'Name and price are required'
      }, 400);
    }
    
    // Create new product
    const newProduct = {
      id: String(products.length + 1),
      name: body.name,
      price: Number(body.price),
      category: body.category || 'Uncategorized'
    };
    
    products.push(newProduct);
    
    return c.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    }, 201);
    
  } catch (error) {
    return c.json({
      success: false,
      error: 'Invalid JSON body'
    }, 400);
  }
}

/**
 * DELETE /api/products - Supprime tous les produits (pour les tests)
 */
export async function DELETE(c: Context) {
  console.log('[API] DELETE /api/products');
  
  const deletedCount = products.length;
  products.length = 0; // Clear array
  
  return c.json({
    success: true,
    message: `Deleted ${deletedCount} products`,
    deletedCount
  });
}
