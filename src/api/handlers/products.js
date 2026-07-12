/**
 * Products API Handler
 * Handles all product-related API requests
 */

import { requireAuth, requireSuperAdmin } from './admin';

export async function handleProducts(request, env, corsHeaders) {
  const url = new URL(request.url);
  const method = request.method;
  const pathParts = url.pathname.split('/').filter(Boolean);

  // GET /api/products - Get all products
  if (method === 'GET' && pathParts.length === 2) {
    return getAllProducts(env, corsHeaders, request);
  }

  // GET /api/products/featured - Get featured products
  if (method === 'GET' && pathParts[2] === 'featured') {
    return getFeaturedProducts(env, corsHeaders);
  }

  // GET /api/products/:id - Get single product
  if (method === 'GET' && pathParts.length === 3) {
    const productId = pathParts[2];
    return getProduct(env, productId, corsHeaders, request);
  }

  // POST /api/products - Create new product (Admin only)
  if (method === 'POST' && pathParts.length === 2) {
    return createProduct(request, env, corsHeaders);
  }

  // PUT /api/products/:id - Update product (Admin only)
  if (method === 'PUT' && pathParts.length === 3) {
    const productId = pathParts[2];
    return updateProduct(request, env, productId, corsHeaders);
  }

  // DELETE /api/products/:id - Delete product (Admin only)
  if (method === 'DELETE' && pathParts.length === 3) {
    const productId = pathParts[2];
    return deleteProduct(request, env, productId, corsHeaders);
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Get all products
async function getAllProducts(env, corsHeaders, request) {
  try {
    // Check if this is an authenticated admin request
    const isAdmin = Boolean(await requireAuth(request, env));

    // Admin can see all products, public can only see active ones
    let query;
    if (isAdmin) {
      query = env.DB.prepare('SELECT * FROM products ORDER BY created_at DESC');
    } else {
      query = env.DB.prepare('SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC');
    }

    const { results } = await query.all();

    return new Response(JSON.stringify({ success: true, data: results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Get featured products
async function getFeaturedProducts(env, corsHeaders) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM products WHERE is_featured = 1 AND is_active = 1 ORDER BY created_at DESC LIMIT 8'
    ).all();

    return new Response(JSON.stringify({ success: true, data: results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Get single product
async function getProduct(env, productId, corsHeaders, request) {
  try {
    // Check if this is an authenticated admin request
    const isAdmin = Boolean(await requireAuth(request, env));

    // Admin can see all products, public can only see active ones
    let query;
    if (isAdmin) {
      query = env.DB.prepare('SELECT * FROM products WHERE id = ?');
    } else {
      query = env.DB.prepare('SELECT * FROM products WHERE id = ? AND is_active = 1');
    }

    const product = await query.bind(productId).first();

    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data: product }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Create new product (Super Admin only)
async function createProduct(request, env, corsHeaders) {
  try {
    // Check if user is super admin
    const admin = await requireSuperAdmin(request, env);
    if (!admin) {
      return new Response(JSON.stringify({
        error: 'Unauthorized. Super admin access required.'
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();

    const result = await env.DB.prepare(
      `INSERT INTO products (name, description, detailed_description, specifications, image_url, gallery_images, category, is_featured, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      data.name,
      data.description || null,
      data.detailed_description || null,
      data.specifications || null,
      data.image_url || null,
      data.gallery_images ? JSON.stringify(data.gallery_images) : null,
      data.category || null,
      data.is_featured ? 1 : 0,
      data.is_active !== undefined ? data.is_active : 1
    ).run();

    return new Response(JSON.stringify({
      success: true,
      data: { id: result.meta.last_row_id }
    }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Update product (Super Admin only)
async function updateProduct(request, env, productId, corsHeaders) {
  try {
    // Check if user is super admin
    const admin = await requireSuperAdmin(request, env);
    if (!admin) {
      return new Response(JSON.stringify({
        error: 'Unauthorized. Super admin access required.'
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();

    await env.DB.prepare(
      `UPDATE products SET
        name = ?,
        description = ?,
        detailed_description = ?,
        specifications = ?,
        image_url = ?,
        gallery_images = ?,
        category = ?,
        is_featured = ?,
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(
      data.name,
      data.description || null,
      data.detailed_description || null,
      data.specifications || null,
      data.image_url || null,
      data.gallery_images ? JSON.stringify(data.gallery_images) : null,
      data.category || null,
      data.is_featured ? 1 : 0,
      data.is_active !== undefined ? data.is_active : 1,
      productId
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Delete product (Super Admin only - soft delete)
async function deleteProduct(request, env, productId, corsHeaders) {
  try {
    // Check if user is super admin
    const admin = await requireSuperAdmin(request, env);
    if (!admin) {
      return new Response(JSON.stringify({
        error: 'Unauthorized. Super admin access required.'
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await env.DB.prepare(
      'UPDATE products SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(productId).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
