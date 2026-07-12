/**
 * Admin Dashboard Page
 * Main admin interface for managing products and inquiries
 */

export async function adminDashboard(env) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard - B2B Product Exhibition</title>
  <style>
    /* Main Stylesheet for B2B Website */

    :root {
      --primary-color: #2563eb;
      --secondary-color: #1e40af;
      --accent-color: #f59e0b;
      --text-dark: #1f2937;
      --text-light: #6b7280;
      --bg-light: #f9fafb;
      --border-color: #e5e7eb;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: var(--text-dark);
      background: #ffffff;
    }

    /* Buttons */
    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border-radius: 0.375rem;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
      border: none;
      cursor: pointer;
    }

    .btn-primary {
      background: var(--primary-color);
      color: white;
    }

    .btn-primary:hover {
      background: var(--secondary-color);
    }

    .btn-secondary {
      background: var(--accent-color);
      color: white;
    }

    .btn-secondary:hover {
      background: #d97706;
    }

    /* Grid Layout */
    .grid {
      display: grid;
      gap: 2rem;
    }

    .grid-3 {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    /* Admin specific styles */
    .admin-layout {
      display: flex;
      min-height: 100vh;
    }
    .admin-sidebar {
      width: 250px;
      background: var(--text-dark);
      color: white;
      padding: 2rem 0;
      position: fixed;
      height: 100vh;
      overflow-y: auto;
    }
    .admin-content {
      flex: 1;
      margin-left: 250px;
      padding: 2rem;
      background: var(--bg-light);
      min-height: 100vh;
    }
    .admin-header {
      background: white;
      padding: 1.5rem 2rem;
      margin: -2rem -2rem 2rem -2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sidebar-nav {
      list-style: none;
    }
    .sidebar-nav li {
      margin: 0;
    }
    .sidebar-nav a {
      display: flex;
      align-items: center;
      padding: 1rem 2rem;
      color: #9ca3af;
      text-decoration: none;
      transition: all 0.3s;
    }
    .sidebar-nav a:hover,
    .sidebar-nav a.active {
      background: rgba(255,255,255,0.1);
      color: white;
    }
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .stat-card h3 {
      color: var(--text-light);
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    .stat-card .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-color);
    }
    .table-container {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
    }
    .table th {
      background: var(--bg-light);
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: var(--text-dark);
      border-bottom: 2px solid var(--border-color);
    }
    .table td {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
    }
    .table tr:hover {
      background: var(--bg-light);
    }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.85rem;
      font-weight: 500;
    }
    .badge-pending {
      background: #fef3c7;
      color: #92400e;
    }
    .badge-processing {
      background: #dbeafe;
      color: #1e40af;
    }
    .badge-completed {
      background: #d1fae5;
      color: #065f46;
    }
    .tab-nav {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      border-bottom: 2px solid var(--border-color);
    }
    .tab-btn {
      padding: 1rem 1.5rem;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      color: var(--text-light);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
    }
    .tab-btn:hover {
      color: var(--primary-color);
    }
    .tab-btn.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }
    .tab-content {
      display: none;
    }
    .tab-content.active {
      display: block;
    }

    /* Modal Styles */
    .modal {
      display: none;
      position: fixed;
      z-index: 10000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      overflow-y: auto;
    }

    .modal.active {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .modal-content {
      background-color: white;
      padding: 2rem;
      border-radius: 0.5rem;
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .modal-header h2 {
      font-size: 1.5rem;
      color: var(--text-dark);
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--text-light);
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-close:hover {
      color: var(--text-dark);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--text-dark);
    }

    .form-input,
    .form-textarea,
    .form-select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 0.375rem;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .form-input:focus,
    .form-textarea:focus,
    .form-select:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    .form-checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .form-checkbox input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
    }

    .btn-cancel {
      background: #6b7280;
      color: white;
    }

    .btn-cancel:hover {
      background: #4b5563;
    }

    .image-upload-container {
      margin-bottom: 1.5rem;
    }

    .image-preview {
      margin-top: 1rem;
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .image-preview img {
      max-width: 200px;
      max-height: 200px;
      border-radius: 0.375rem;
      border: 1px solid var(--border-color);
      object-fit: cover;
    }

    .upload-btn-wrapper {
      position: relative;
      overflow: hidden;
      display: inline-block;
    }

    .upload-btn-wrapper input[type=file] {
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .btn-upload {
      background: var(--primary-color);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s;
    }

    .btn-upload:hover {
      background: var(--secondary-color);
    }

    .uploading {
      color: var(--primary-color);
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }

    @media (max-width: 768px) {
      .admin-sidebar {
        width: 100%;
        height: auto;
        position: relative;
      }
      .admin-content {
        margin-left: 0;
      }
    }
  </style>
</head>
<body>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <div style="padding: 0 2rem 2rem 2rem;">
        <h2 style="color: var(--accent-color); font-size: 1.5rem;">B2B Admin</h2>
      </div>
      <ul class="sidebar-nav">
        <li><a href="#" data-tab="overview" class="active">📊 Overview</a></li>
        <li><a href="#" data-tab="products">📦 Products</a></li>
        <li><a href="#" data-tab="inquiries">💬 Inquiries</a></li>
        <li><a href="#" data-tab="settings">⚙️ Settings</a></li>
        <li><a href="#" id="logout-btn">🚪 Logout</a></li>
      </ul>
    </aside>

    <!-- Main Content -->
    <main class="admin-content">
      <div class="admin-header">
        <div>
          <h1 style="font-size: 1.5rem; margin-bottom: 0.25rem;">Dashboard</h1>
          <p style="color: var(--text-light); font-size: 0.9rem;">
            Welcome back, <span id="admin-username">Admin</span>
            <span id="admin-role-indicator" style="margin-left: 0.5rem; padding: 0.25rem 0.5rem; background: var(--primary-color); color: white; border-radius: 0.25rem; font-size: 0.75rem;">Loading...</span>
          </p>
        </div>
        <div style="display: flex; gap: 1rem;">
          <a href="/" target="_blank" class="btn btn-primary" style="text-decoration: none; display: flex; align-items: center; ">
            Preview
          </a>
          <button id="logout-btn-header" class="btn btn-secondary">Logout</button>
        </div>
      </div>

      <!-- Overview Tab -->
      <div id="overview-tab" class="tab-content active">
        <div class="grid grid-3" style="margin-bottom: 2rem;">
          <div class="stat-card">
            <h3>Total Products</h3>
            <div class="stat-value" id="stat-products">0</div>
          </div>
          <div class="stat-card">
            <h3>Total Inquiries</h3>
            <div class="stat-value" id="stat-inquiries">0</div>
          </div>
          <div class="stat-card">
            <h3>Pending Inquiries</h3>
            <div class="stat-value" id="stat-pending">0</div>
          </div>
        </div>

        <h2 style="font-size: 1.25rem; margin-bottom: 1rem; color: var(--text-dark);">Recent Inquiries</h2>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Product</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody id="recent-inquiries-tbody">
              <tr><td colspan="5" style="text-align: center;">Loading...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Products Tab -->
      <div id="products-tab" class="tab-content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.25rem; color: var(--text-dark);">Manage Products</h2>
          <button id="add-product-btn" class="btn btn-primary">+ Add Product</button>
        </div>
        <div class="table-container">
          <div id="products-list">Loading...</div>
        </div>
      </div>

      <!-- Inquiries Tab -->
      <div id="inquiries-tab" class="tab-content">
        <h2 style="font-size: 1.25rem; margin-bottom: 1.5rem; color: var(--text-dark);">Manage Inquiries</h2>
        <div class="table-container">
          <div id="inquiries-list">Loading...</div>
        </div>
      </div>

      <!-- Settings Tab -->
      <div id="settings-tab" class="tab-content">
        <h2 style="font-size: 1.25rem; margin-bottom: 1.5rem; color: var(--text-dark);">Website Settings</h2>
        <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 800px;">
          <form id="settings-form">
            <h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--primary-color); border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem;">
              Basic Information
            </h3>

            <div class="form-group">
              <label class="form-label" for="settings-site-name">Website Name</label>
              <input type="text" id="settings-site-name" name="site_name" class="form-input" placeholder="Southern Machinery">
            </div>

            <div class="form-group">
              <label class="form-label" for="settings-site-description">Website Description</label>
              <textarea id="settings-site-description" name="site_description" class="form-textarea" placeholder="Smart THT auto insertion and PCB assembly automation..."></textarea>
            </div>

            <div class="form-group">
              <label class="form-label" for="settings-company-intro">Company Introduction</label>
              <textarea id="settings-company-intro" name="company_intro" class="form-textarea" placeholder="Southern Machinery designs THT insertion equipment..."></textarea>
            </div>

            <h3 style="font-size: 1.1rem; margin: 2rem 0 1rem; color: var(--primary-color); border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem;">
              Contact Information
            </h3>

            <div class="form-group">
              <label class="form-label" for="settings-email">Email</label>
              <input type="email" id="settings-email" name="email" class="form-input" placeholder="jasonwu@smthelp.com">
            </div>

            <div class="form-group">
              <label class="form-label" for="settings-phone">Phone</label>
              <input type="text" id="settings-phone" name="phone" class="form-input" placeholder="+86 136 0256 2576">
            </div>

            <div class="form-group">
              <label class="form-label" for="settings-address">Address</label>
              <input type="text" id="settings-address" name="address" class="form-input" placeholder="Bao'an District, Shenzhen, China">
            </div>

            <h3 style="font-size: 1.1rem; margin: 2rem 0 1rem; color: var(--primary-color); border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem;">
              Social Media Links
            </h3>

            <div class="form-group">
              <label class="form-label" for="settings-linkedin">LinkedIn URL</label>
              <input type="url" id="settings-linkedin" name="linkedin" class="form-input" placeholder="https://linkedin.com/company/yourcompany">
            </div>

            <div class="form-group">
              <label class="form-label" for="settings-facebook">Facebook URL</label>
              <input type="url" id="settings-facebook" name="facebook" class="form-input" placeholder="https://facebook.com/yourcompany">
            </div>

            <div class="form-group">
              <label class="form-label" for="settings-twitter">Twitter URL</label>
              <input type="url" id="settings-twitter" name="twitter" class="form-input" placeholder="https://twitter.com/yourcompany">
            </div>

            <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
              <button type="submit" id="save-settings-btn" class="btn btn-primary" style="margin-right: 1rem;">Save Settings</button>
              <button type="button" class="btn btn-secondary" onclick="loadSettings()">Reset</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>

  <!-- Product Edit/Add Modal -->
  <div id="product-modal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="modal-title">Edit Product</h2>
        <button class="modal-close" onclick="closeProductModal()">&times;</button>
      </div>
      <form id="product-form">
        <input type="hidden" id="product-id" name="id">

        <div class="form-group">
          <label class="form-label" for="product-name">Product Name *</label>
          <input type="text" id="product-name" name="name" class="form-input" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="product-category">Category</label>
          <input type="text" id="product-category" name="category" class="form-input" placeholder="e.g., Electronics, Machinery">
        </div>

        <div class="form-group">
          <label class="form-label" for="product-description">Short Description</label>
          <textarea id="product-description" name="description" class="form-textarea" placeholder="Brief product description"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label" for="product-detailed-description">Detailed Description</label>
          <textarea id="product-detailed-description" name="detailed_description" class="form-textarea" placeholder="Full product description"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label" for="product-specifications">Specifications</label>
          <textarea id="product-specifications" name="specifications" class="form-textarea" placeholder="Technical specifications"></textarea>
        </div>

        <div class="image-upload-container">
          <label class="form-label">Product Image</label>
          <div class="upload-btn-wrapper">
            <button type="button" class="btn-upload">Choose Image</button>
            <input type="file" id="image-upload" accept="image/*" onchange="handleImageUpload(event)">
          </div>
          <div id="upload-status" class="uploading" style="display: none;">Uploading...</div>
          <div id="image-preview" class="image-preview"></div>
        </div>

        <div class="form-group">
          <label class="form-label" for="product-image-url">Image URL (or upload above)</label>
          <input type="url" id="product-image-url" name="image_url" class="form-input" placeholder="https://example.com/image.jpg" readonly>
        </div>

        <div class="form-group">
          <label class="form-checkbox">
            <input type="checkbox" id="product-is-featured" name="is_featured">
            <span>Featured Product</span>
          </label>
        </div>

        <div class="form-group">
          <label class="form-checkbox">
            <input type="checkbox" id="product-is-active" name="is_active" checked>
            <span>Active</span>
          </label>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-cancel" onclick="closeProductModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Product</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    /**
     * Main JavaScript file for B2B Website
     * Handles common functionality across all pages
     */

    // Mobile menu toggle
    document.addEventListener('DOMContentLoaded', function() {
      const menuToggle = document.querySelector('.menu-toggle');
      const navMenu = document.querySelector('.nav-menu');

      if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
          navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
          if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('active');
          }
        });
      }

      // Set active nav link based on current page
      const currentPath = window.location.pathname;
      const navLinks = document.querySelectorAll('.nav-link');

      navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
          link.classList.add('active');
        }
      });
    });

    // API helper functions
    const API = {
      baseURL: '/api',

      async get(endpoint) {
        const response = await fetch(\`\${this.baseURL}\${endpoint}\`);
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        return await response.json();
      },

      async post(endpoint, data) {
        const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        return await response.json();
      },

      async put(endpoint, data) {
        const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        return await response.json();
      },

      async delete(endpoint) {
        const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        return await response.json();
      },
    };

    // Form validation helper
    function validateEmail(email) {
      const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      return re.test(String(email).toLowerCase());
    }

    // Show notification
    function showNotification(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = \`notification notification-\${type}\`;
      notification.textContent = message;
      notification.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: \${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
      \`;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = \`
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    \`;
    document.head.appendChild(style);

    // Export for use in other scripts
    window.API = API;
    window.validateEmail = validateEmail;
    window.showNotification = showNotification;
  </script>

  <script>
    /**
     * Admin Dashboard JavaScript
     * Handles all admin dashboard functionality
     */

    // Check authentication
    const token = localStorage.getItem('admin_token');
    const userRole = localStorage.getItem('admin_role') || 'admin';
    const isSuperAdmin = userRole === 'super_admin';

    if (!token) {
      window.location.href = '/admin/login';
    }

    // Verify token on page load and get user info
    API.post('/admin/verify', { token })
      .then(response => {
        if (response.success && response.data.user) {
          // Update role in localStorage
          localStorage.setItem('admin_role', response.data.user.role || 'admin');

          // Update role indicator
          const roleIndicator = document.getElementById('admin-role-indicator');
          if (roleIndicator) {
            roleIndicator.textContent = response.data.user.role === 'super_admin' ? 'Super Admin' : 'Admin';
          }
        }
      })
      .catch(() => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_role');
        window.location.href = '/admin/login';
      });

    // Add authorization header to all API requests
    const originalPost = API.post;
    const originalPut = API.put;
    const originalDelete = API.delete;
    const originalGet = API.get;

    API.get = function(endpoint) {
      return fetch(\`\${this.baseURL}\${endpoint}\`, {
        headers: {
          'Authorization': \`Bearer \${token}\`,
        },
      }).then(res => res.json());
    };

    API.post = function(endpoint, data) {
      return fetch(\`\${this.baseURL}\${endpoint}\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${token}\`,
        },
        body: JSON.stringify(data),
      }).then(res => res.json());
    };

    API.put = function(endpoint, data) {
      return fetch(\`\${this.baseURL}\${endpoint}\`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${token}\`,
        },
        body: JSON.stringify(data),
      }).then(res => res.json());
    };

    API.delete = function(endpoint) {
      return fetch(\`\${this.baseURL}\${endpoint}\`, {
        method: 'DELETE',
        headers: {
          'Authorization': \`Bearer \${token}\`,
        },
      }).then(res => res.json());
    };

    // Logout functionality
    function logout() {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_role');
      window.location.href = '/admin/login';
    }

    document.getElementById('logout-btn').addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });

    document.getElementById('logout-btn-header').addEventListener('click', logout);

    // Tab Navigation
    const tabButtons = document.querySelectorAll('[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = button.getAttribute('data-tab');

        // Update active states
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        document.getElementById(\`\${tabName}-tab\`).classList.add('active');

        // Load data for specific tabs
        if (tabName === 'products') {
          loadProducts();
        } else if (tabName === 'inquiries') {
          loadInquiries();
        } else if (tabName === 'settings') {
          loadSettings();
        }
      });
    });

    // Load Dashboard Stats
    async function loadDashboardStats() {
      try {
        const response = await API.get('/admin/stats');
        if (response.success) {
          const { total_products, total_inquiries, pending_inquiries, recent_inquiries } = response.data;

          document.getElementById('stat-products').textContent = total_products || 0;
          document.getElementById('stat-inquiries').textContent = total_inquiries || 0;
          document.getElementById('stat-pending').textContent = pending_inquiries || 0;

          // Display recent inquiries
          const tbody = document.getElementById('recent-inquiries-tbody');
          if (recent_inquiries && recent_inquiries.length > 0) {
            tbody.innerHTML = recent_inquiries.map(inquiry => \`
              <tr>
                <td>\${inquiry.name}</td>
                <td>\${inquiry.email}</td>
                <td>\${inquiry.product_name || 'General Inquiry'}</td>
                <td><span class="badge badge-\${inquiry.status}">\${inquiry.status}</span></td>
                <td>\${new Date(inquiry.created_at).toLocaleDateString()}</td>
              </tr>
            \`).join('');
          } else {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No recent inquiries</td></tr>';
          }
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }

    // Load Products
    async function loadProducts() {
      try {
        const response = await API.get('/products');
        if (response.success) {
          const products = response.data || [];
          const container = document.getElementById('products-list');

          if (products.length === 0) {
            container.innerHTML = '<p style="padding: 2rem; text-align: center;">No products found.</p>';
            return;
          }

          container.innerHTML = \`
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Featured</th>
                  <th>Status</th>
                  \${isSuperAdmin ? '<th>Actions</th>' : ''}
                </tr>
              </thead>
              <tbody>
                \${products.map(product => \`
                  <tr>
                    <td>\${product.id}</td>
                    <td>\${product.name}</td>
                    <td>\${product.category || 'N/A'}</td>
                    <td>\${product.is_featured ? '⭐ Yes' : 'No'}</td>
                    <td><span class="badge \${product.is_active ? 'badge-completed' : 'badge-pending'}">\${product.is_active ? 'Active' : 'Inactive'}</span></td>
                    \${isSuperAdmin ? \`
                    <td>
                      <button onclick="editProduct(\${product.id})" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem; margin-right: 0.5rem;">Edit</button>
                      <button onclick="deleteProduct(\${product.id})" class="btn" style="background: #dc2626; color: white; padding: 0.5rem 1rem; font-size: 0.85rem;">Delete</button>
                    </td>
                    \` : ''}
                  </tr>
                \`).join('')}
              </tbody>
            </table>
          \`;
        }
      } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('products-list').innerHTML = '<p style="padding: 2rem; text-align: center; color: red;">Error loading products</p>';
      }
    }

    // Load Inquiries
    async function loadInquiries() {
      try {
        const response = await API.get('/inquiries');
        if (response.success) {
          const inquiries = response.data || [];
          const container = document.getElementById('inquiries-list');

          if (inquiries.length === 0) {
            container.innerHTML = '<p style="padding: 2rem; text-align: center;">No inquiries found.</p>';
            return;
          }

          container.innerHTML = \`
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Product</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                \${inquiries.map(inquiry => \`
                  <tr>
                    <td>\${inquiry.id}</td>
                    <td>\${inquiry.name}</td>
                    <td>\${inquiry.email}</td>
                    <td>\${inquiry.product_name || 'General'}</td>
                    <td><span class="badge badge-\${inquiry.status}">\${inquiry.status}</span></td>
                    <td>\${new Date(inquiry.created_at).toLocaleDateString()}</td>
                    <td>
                      <button onclick="viewInquiry(\${inquiry.id})" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem; margin-right: 0.5rem;">View</button>
                      \${isSuperAdmin ? \`<button onclick="deleteInquiry(\${inquiry.id})" class="btn" style="background: #dc2626; color: white; padding: 0.5rem 1rem; font-size: 0.85rem;">Delete</button>\` : ''}
                    </td>
                  </tr>
                \`).join('')}
              </tbody>
            </table>
          \`;
        }
      } catch (error) {
        console.error('Error loading inquiries:', error);
        document.getElementById('inquiries-list').innerHTML = '<p style="padding: 2rem; text-align: center; color: red;">Error loading inquiries</p>';
      }
    }

    // Product Management Functions
    window.handleImageUpload = async function(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showNotification('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.', 'error');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        showNotification('File too large. Maximum size is 5MB.', 'error');
        return;
      }

      // Show uploading status
      const uploadStatus = document.getElementById('upload-status');
      uploadStatus.style.display = 'block';

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload/image', {
          method: 'POST',
          headers: {
            'Authorization': \`Bearer \${token}\`,
          },
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          // Set the image URL
          document.getElementById('product-image-url').value = result.data.url;

          // Show preview
          const preview = document.getElementById('image-preview');
          preview.innerHTML = \`<img src="\${result.data.url}" alt="Product preview">\`;

          showNotification('Image uploaded successfully', 'success');
        } else {
          showNotification(result.error || 'Upload failed', 'error');
        }
      } catch (error) {
        console.error('Upload error:', error);
        showNotification('Error uploading image', 'error');
      } finally {
        uploadStatus.style.display = 'none';
      }
    };

    window.editProduct = async function(id) {
      try {
        // Fetch product details
        const response = await API.get(\`/products/\${id}\`);
        if (response.success) {
          const product = response.data;

          // Populate form
          document.getElementById('product-id').value = product.id;
          document.getElementById('product-name').value = product.name || '';
          document.getElementById('product-category').value = product.category || '';
          document.getElementById('product-description').value = product.description || '';
          document.getElementById('product-detailed-description').value = product.detailed_description || '';
          document.getElementById('product-specifications').value = product.specifications || '';
          document.getElementById('product-image-url').value = product.image_url || '';
          document.getElementById('product-is-featured').checked = product.is_featured === 1;
          document.getElementById('product-is-active').checked = product.is_active === 1;

          // Show image preview if exists
          const preview = document.getElementById('image-preview');
          if (product.image_url) {
            preview.innerHTML = \`<img src="\${product.image_url}" alt="Product preview">\`;
          } else {
            preview.innerHTML = '';
          }

          // Update modal title
          document.getElementById('modal-title').textContent = 'Edit Product';

          // Show modal
          document.getElementById('product-modal').classList.add('active');
        }
      } catch (error) {
        showNotification('Error loading product details', 'error');
        console.error('Error loading product:', error);
      }
    };

    window.closeProductModal = function() {
      document.getElementById('product-modal').classList.remove('active');
      document.getElementById('product-form').reset();
      document.getElementById('product-id').value = '';
      document.getElementById('image-preview').innerHTML = '';
      document.getElementById('image-upload').value = '';
    };

    window.openAddProductModal = function() {
      // Reset form
      document.getElementById('product-form').reset();
      document.getElementById('product-id').value = '';
      document.getElementById('product-is-active').checked = true;

      // Update modal title
      document.getElementById('modal-title').textContent = 'Add New Product';

      // Show modal
      document.getElementById('product-modal').classList.add('active');
    };

    // Handle product form submission
    document.getElementById('product-form').addEventListener('submit', async function(e) {
      e.preventDefault();

      const productId = document.getElementById('product-id').value;
      const formData = {
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        description: document.getElementById('product-description').value,
        detailed_description: document.getElementById('product-detailed-description').value,
        specifications: document.getElementById('product-specifications').value,
        image_url: document.getElementById('product-image-url').value,
        is_featured: document.getElementById('product-is-featured').checked,
        is_active: document.getElementById('product-is-active').checked,
      };

      try {
        let response;
        if (productId) {
          // Update existing product
          response = await API.put(\`/products/\${productId}\`, formData);
        } else {
          // Create new product
          response = await API.post('/products', formData);
        }

        if (response.success || response.data) {
          showNotification(productId ? 'Product updated successfully' : 'Product created successfully', 'success');
          closeProductModal();
          loadProducts();
          loadDashboardStats();
        } else {
          showNotification(response.error || 'Failed to save product', 'error');
        }
      } catch (error) {
        showNotification('Error saving product', 'error');
        console.error('Error saving product:', error);
      }
    });

    // Close modal when clicking outside
    document.getElementById('product-modal').addEventListener('click', function(e) {
      if (e.target === this) {
        closeProductModal();
      }
    });

    window.deleteProduct = async function(id) {
      if (!confirm('Are you sure you want to delete this product?')) {
        return;
      }

      try {
        await API.delete(\`/products/\${id}\`);
        showNotification('Product deleted successfully', 'success');
        loadProducts();
      } catch (error) {
        showNotification('Error deleting product', 'error');
      }
    };

    document.getElementById('add-product-btn').addEventListener('click', () => {
      openAddProductModal();
    });

    // Hide add product button for non-super admins
    if (!isSuperAdmin) {
      const addProductBtn = document.getElementById('add-product-btn');
      if (addProductBtn) {
        addProductBtn.style.display = 'none';
      }
    }

    // Inquiry Management Functions
    window.viewInquiry = async function(id) {
      try {
        const response = await API.get(\`/inquiries/\${id}\`);
        if (response.success) {
          const inquiry = response.data;
          alert(\`
Inquiry Details:
----------------
Name: \${inquiry.name}
Email: \${inquiry.email}
Company: \${inquiry.company || 'N/A'}
Phone: \${inquiry.phone || 'N/A'}
Country: \${inquiry.country || 'N/A'}
Product: \${inquiry.product_name || 'General Inquiry'}
Message: \${inquiry.message}
Status: \${inquiry.status}
Date: \${new Date(inquiry.created_at).toLocaleString()}
          \`);
          // TODO: Implement better inquiry viewing modal
        }
      } catch (error) {
        showNotification('Error loading inquiry details', 'error');
      }
    };

    window.deleteInquiry = async function(id) {
      if (!confirm('Are you sure you want to delete this inquiry?')) {
        return;
      }

      try {
        await API.delete(\`/inquiries/\${id}\`);
        showNotification('Inquiry deleted successfully', 'success');
        loadInquiries();
        loadDashboardStats();
      } catch (error) {
        showNotification('Error deleting inquiry', 'error');
      }
    };

    // Settings Management Functions
    async function loadSettings() {
      try {
        const response = await API.get('/settings');
        if (response.success) {
          const settings = response.data;

          // Populate form fields
          document.getElementById('settings-site-name').value = settings.site_name || '';
          document.getElementById('settings-site-description').value = settings.site_description || '';
          document.getElementById('settings-company-intro').value = settings.company_intro || '';
          document.getElementById('settings-email').value = settings.email || '';
          document.getElementById('settings-phone').value = settings.phone || '';
          document.getElementById('settings-address').value = settings.address || '';
          document.getElementById('settings-linkedin').value = settings.linkedin || '';
          document.getElementById('settings-facebook').value = settings.facebook || '';
          document.getElementById('settings-twitter').value = settings.twitter || '';
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        showNotification('Error loading settings', 'error');
      }
    }

    window.loadSettings = loadSettings;

    // Disable settings save for non-super admins
    if (!isSuperAdmin) {
      const saveSettingsBtn = document.getElementById('save-settings-btn');
      if (saveSettingsBtn) {
        saveSettingsBtn.disabled = true;
        saveSettingsBtn.textContent = 'Save Settings (Super Admin Only)';
        saveSettingsBtn.style.opacity = '0.5';
        saveSettingsBtn.style.cursor = 'not-allowed';
      }

      // Make all settings form fields readonly for non-super admins
      const settingsForm = document.getElementById('settings-form');
      if (settingsForm) {
        const inputs = settingsForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
          input.readOnly = true;
          input.style.backgroundColor = '#f3f4f6';
        });
      }
    }

    // Handle settings form submission
    document.getElementById('settings-form').addEventListener('submit', async function(e) {
      e.preventDefault();

      // Check if user is super admin
      if (!isSuperAdmin) {
        showNotification('Only super admin can save settings', 'error');
        return;
      }

      const formData = {
        site_name: document.getElementById('settings-site-name').value,
        site_description: document.getElementById('settings-site-description').value,
        company_intro: document.getElementById('settings-company-intro').value,
        email: document.getElementById('settings-email').value,
        phone: document.getElementById('settings-phone').value,
        address: document.getElementById('settings-address').value,
        linkedin: document.getElementById('settings-linkedin').value,
        facebook: document.getElementById('settings-facebook').value,
        twitter: document.getElementById('settings-twitter').value,
      };

      try {
        const response = await API.post('/settings', formData);
        if (response.success) {
          showNotification('Settings saved successfully', 'success');
        } else {
          showNotification(response.error || 'Failed to save settings', 'error');
        }
      } catch (error) {
        console.error('Error saving settings:', error);
        showNotification('Error saving settings', 'error');
      }
    });

    // Initialize dashboard
    loadDashboardStats();
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
    },
  });
}
