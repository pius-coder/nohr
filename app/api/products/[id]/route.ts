// 🚀 NOHR API Route Example - Single Product
// Convention: [id] becomes :id parameter

import { Context } from 'hono';

// Mock database (in real app, this would be shared or from a DB)
const products = [
  { id: '1', name: 'Laptop', price: 999, category: 'Electronics' },
  { id: '2', name: 'Book', price: 29, category: 'Education' },
  { id: '3', name: 'Coffee Mug', price: 15, category: 'Kitchen' }
];

/**
 * GET /api/products/:id - Récupère un produit par son ID
 */
export async function GET(c: Context) {
  const id = c.req.param('id');
  console.log(`[API] GET /api/products/${id}`);
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return c.json({
      success: false,
      error: `Product with ID ${id} not found`
    }, 404);
  }
  
  return c.json({
    success: true,
    data: product
  });
}

/**
 * PUT /api/products/:id - Met à jour un produit
 */
export async function PUT(c: Context) {
  const id = c.req.param('id');
  console.log(`[API] PUT /api/products/${id}`);
  
  try {
    const body = await c.req.json();
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return c.json({
        success: false,
        error: `Product with ID ${id} not found`
      }, 404);
    }
    
    // Update product
    const updatedProduct = {
      ...products[productIndex],
      ...body,
      id // Preserve ID
    };
    
    products[productIndex] = updatedProduct;
    
    return c.json({
      success: true,
      data: updatedProduct,
      message: `Product ${id} updated successfully`
    });
    
  } catch (error) {
    return c.json({
      success: false,
      error: 'Invalid JSON body'
    }, 400);
  }
}

/**
 * DELETE /api/products/:id - Supprime un produit
 */
export async function DELETE(c: Context) {
  const id = c.req.param('id');
  console.log(`[API] DELETE /api/products/${id}`);
  
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return c.json({
      success: false,
      error: `Product with ID ${id} not found`
    }, 404);
  }
  
  const deletedProduct = products.splice(productIndex, 1)[0];
  
  return c.json({
    success: true,
    data: deletedProduct,
    message: `Product ${id} deleted successfully`
  });
}

/**
 * PATCH /api/products/:id - Met à jour partiellement un produit
 */
export async function PATCH(c: Context) {
  const id = c.req.param('id');
  console.log(`[API] PATCH /api/products/${id}`);
  
  try {
    const body = await c.req.json();
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return c.json({
        success: false,
        error: `Product with ID ${id} not found`
      }, 404);
    }
    
    // Partial update
    products[productIndex] = {
      ...products[productIndex],
      ...body,
      id // Preserve ID
    };
    
    return c.json({
      success: true,
      data: products[productIndex],
      message: `Product ${id} partially updated`
    });
    
  } catch (error) {
    return c.json({
      success: false,
      error: 'Invalid JSON body'
    }, 400);
  }
}
