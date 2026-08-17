// API Client for BAARIZ IT Backend Services, Single Source of Truth & Realtime Chat

import { Product, CategoryInfo, SiteSettings, CustomPage, Conversation, ChatMessage, Order } from '../types';

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: 'customer' | 'owner' | 'manager' | 'staff';
    permissions?: Record<string, boolean>;
  };
  error?: string;
}

// ---------------------------------------------------------------------------
// AUTHENTICATION
// ---------------------------------------------------------------------------

export async function apiRegisterCustomer(data: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch {
    return {
      success: false,
      message: 'Network error or backend unreachable. Please try again.',
    };
  }
}

export async function apiLoginCustomer(identifier: string, password: string): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    return await res.json();
  } catch {
    return {
      success: false,
      message: 'Unable to connect to authentication server.',
    };
  }
}

export async function apiLoginAdmin(email: string, password: string): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  } catch {
    return {
      success: false,
      message: 'Unable to connect to secure admin authorization service.',
    };
  }
}

export async function apiVerifyAdmin(token?: string): Promise<{
  success: boolean;
  status: number;
  isAdmin: boolean;
  user?: any;
  error?: string;
  message?: string;
}> {
  if (!token) {
    return {
      success: false,
      status: 403,
      isAdmin: false,
      error: '403 Forbidden: Unauthenticated. Admin privileges required.',
      message: 'Unauthenticated users are forbidden from accessing administrative functionalities.',
    };
  }

  try {
    const res = await fetch('/api/auth/verify-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.status === 403 || !res.ok) {
      return {
        success: false,
        status: res.status,
        isAdmin: false,
        error: data.error || '403 Forbidden: Access Denied. Admin privileges required.',
        message: data.message || 'Users with customer or unauthenticated roles are forbidden from accessing admin features.',
      };
    }

    return {
      success: true,
      status: 200,
      isAdmin: Boolean(data.isAdmin),
      user: data.user,
    };
  } catch {
    return {
      success: false,
      status: 500,
      isAdmin: false,
      error: 'Authorization check failed due to network error.',
    };
  }
}

export async function apiGetMe(token: string): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Session check failed' };
  }
}

export async function apiLogout(token?: string): Promise<void> {
  try {
    if (token) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (e) {
    console.error('Logout error:', e);
  }
}

// ---------------------------------------------------------------------------
// PRODUCTS (CATALOG SINGLE SOURCE OF TRUTH)
// ---------------------------------------------------------------------------

export async function apiGetProducts(token?: string, includeAll?: boolean): Promise<{ success: boolean; products: Product[] }> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const url = includeAll ? '/api/products?includeAll=true' : '/api/products';
    const res = await fetch(url, { headers });
    const data = await res.json();
    return { success: data.success ?? true, products: data.products || [] };
  } catch (err) {
    console.error('Error fetching products:', err);
    return { success: false, products: [] };
  }
}

export async function apiCreateProduct(
  product: Partial<Product>,
  token: string
): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Network error creating product.' };
  }
}

export async function apiUpdateProduct(
  id: string,
  product: Partial<Product>,
  token: string
): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Network error updating product.' };
  }
}

export async function apiDeleteProduct(
  id: string,
  token: string
): Promise<{ success: boolean; productId?: string; error?: string }> {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Network error deleting product.' };
  }
}

// ---------------------------------------------------------------------------
// CATEGORIES
// ---------------------------------------------------------------------------

export async function apiGetCategories(token?: string): Promise<{ success: boolean; categories: CategoryInfo[] }> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch('/api/categories', { headers });
    const data = await res.json();
    return { success: true, categories: data.categories || [] };
  } catch (err) {
    return { success: false, categories: [] };
  }
}

export async function apiCreateCategory(
  cat: Partial<CategoryInfo>,
  token: string
): Promise<{ success: boolean; category?: CategoryInfo; error?: string }> {
  try {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cat),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Network error creating category.' };
  }
}

export async function apiUpdateCategory(
  id: string,
  cat: Partial<CategoryInfo>,
  token: string
): Promise<{ success: boolean; category?: CategoryInfo; error?: string }> {
  try {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cat),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Network error updating category.' };
  }
}

export async function apiDeleteCategory(
  id: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Network error deleting category.' };
  }
}

// ---------------------------------------------------------------------------
// WEBSITE SETTINGS & FULL CUSTOMIZATION
// ---------------------------------------------------------------------------

export async function apiGetSettings(): Promise<{ success: boolean; settings: SiteSettings }> {
  try {
    const res = await fetch('/api/settings');
    const data = await res.json();
    return { success: true, settings: data.settings };
  } catch (err) {
    console.error('Error fetching settings:', err);
    throw err;
  }
}

export async function apiUpdateSettings(
  settings: Partial<SiteSettings>,
  token: string
): Promise<{ success: boolean; settings?: SiteSettings; error?: string }> {
  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Network error saving settings.' };
  }
}

// ---------------------------------------------------------------------------
// CMS CUSTOM PAGES
// ---------------------------------------------------------------------------

export async function apiGetCustomPages(token?: string): Promise<{ success: boolean; pages: CustomPage[] }> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch('/api/custom-pages', { headers });
    const data = await res.json();
    return { success: true, pages: data.pages || [] };
  } catch (err) {
    return { success: false, pages: [] };
  }
}

export async function apiCreateCustomPage(
  page: Partial<CustomPage>,
  token: string
): Promise<{ success: boolean; page?: CustomPage; error?: string }> {
  try {
    const res = await fetch('/api/custom-pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(page),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Network error creating page.' };
  }
}

export async function apiUpdateCustomPage(
  id: string,
  page: Partial<CustomPage>,
  token: string
): Promise<{ success: boolean; page?: CustomPage; error?: string }> {
  try {
    const res = await fetch(`/api/custom-pages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(page),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Network error updating page.' };
  }
}

export async function apiDeleteCustomPage(
  id: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/custom-pages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Network error deleting page.' };
  }
}

// ---------------------------------------------------------------------------
// REAL-TIME CUSTOMER <-> OWNER CHAT MESSAGING
// ---------------------------------------------------------------------------

export async function apiGetConversations(
  token?: string,
  customerId?: string
): Promise<{ success: boolean; conversations: Conversation[]; unreadTotal?: number }> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const url = customerId ? `/api/chat/conversations?customerId=${encodeURIComponent(customerId)}` : '/api/chat/conversations';
    const res = await fetch(url, { headers });
    const data = await res.json();
    return { success: true, conversations: data.conversations || [], unreadTotal: data.unreadTotal || 0 };
  } catch (err) {
    return { success: false, conversations: [] };
  }
}

export async function apiGetChatMessages(
  conversationId: string,
  token?: string
): Promise<{ success: boolean; messages: ChatMessage[]; conversation?: Conversation }> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`/api/chat/messages/${encodeURIComponent(conversationId)}`, { headers });
    const data = await res.json();
    return { success: true, messages: data.messages || [], conversation: data.conversation };
  } catch (err) {
    return { success: false, messages: [] };
  }
}

export async function apiSendChatMessage(
  params: {
    senderRole: 'customer' | 'owner' | 'admin' | 'staff';
    conversationId?: string;
    customerId?: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    content: string;
    productAttachment?: any;
  },
  token?: string
): Promise<{ success: boolean; message?: ChatMessage; conversation?: Conversation; error?: string }> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch('/api/chat/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Network error sending message.' };
  }
}

export async function apiMarkChatRead(
  conversationId: string,
  readerRole: 'admin' | 'customer' | 'owner',
  token?: string
): Promise<{ success: boolean }> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch('/api/chat/mark-read', {
      method: 'POST',
      headers,
      body: JSON.stringify({ conversationId, readerRole }),
    });
    return await res.json();
  } catch {
    return { success: false };
  }
}

export async function apiGetChatUpdates(
  since: number,
  convId?: string
): Promise<{
  success: boolean;
  serverTime: number;
  events: any[];
  conversation?: Conversation | null;
  messages?: ChatMessage[];
  allConversations?: Conversation[];
}> {
  try {
    const url = `/api/chat/updates?since=${since}${convId ? `&convId=${encodeURIComponent(convId)}` : ''}`;
    const res = await fetch(url);
    return await res.json();
  } catch {
    return { success: false, serverTime: Date.now(), events: [] };
  }
}

// ---------------------------------------------------------------------------
// ORDERS
// ---------------------------------------------------------------------------

export async function apiGetOrders(token?: string): Promise<{ success: boolean; orders: Order[] }> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch('/api/orders', { headers });
    const data = await res.json();
    return { success: true, orders: data.orders || [] };
  } catch (err) {
    return { success: false, orders: [] };
  }
}

export async function apiCreateOrder(
  order: any
): Promise<{ success: boolean; order?: Order; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Network error submitting order.' };
  }
}

export async function apiUpdateOrderStatus(
  id: string,
  status: string,
  note: string,
  token: string
): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, note }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Network error updating order status.' };
  }
}

export async function apiTrackOrder(
  query: string
): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    const res = await fetch(`/api/orders/track/${encodeURIComponent(query)}`);
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Order not found.' };
  }
}

// ---------------------------------------------------------------------------
// ADMIN-ONLY API METHODS (SERVER-SIDE ROLE PROTECTED - REQUIRE ADMIN/OWNER)
// ---------------------------------------------------------------------------

export async function apiAdminGetStats(token: string): Promise<{
  success: boolean;
  stats?: {
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    totalProducts: number;
    lowStockCount: number;
    totalCustomers: number;
  };
  error?: string;
}> {
  try {
    const res = await fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Failed to fetch admin stats.' };
  }
}

export async function apiAdminGetCustomers(token: string): Promise<{
  success: boolean;
  customers?: any[];
  error?: string;
}> {
  try {
    const res = await fetch('/api/admin/customers', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Failed to fetch customers.' };
  }
}

export async function apiAdminBlockCustomer(
  id: string,
  token: string
): Promise<{ success: boolean; isBlocked?: boolean; customerId?: string; error?: string }> {
  try {
    const res = await fetch(`/api/admin/customers/${encodeURIComponent(id)}/block`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Failed to update customer status.' };
  }
}

export async function apiAdminUpdateCustomerNotes(
  id: string,
  notes: string,
  token: string
): Promise<{ success: boolean; notes?: string; customerId?: string; error?: string }> {
  try {
    const res = await fetch(`/api/admin/customers/${encodeURIComponent(id)}/notes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ notes }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Failed to update customer notes.' };
  }
}

export async function apiAdminStockAdjust(
  productId: string,
  newStock: number,
  reason: string,
  type: string,
  token: string
): Promise<{ success: boolean; product?: Product; log?: any; error?: string }> {
  try {
    const res = await fetch('/api/admin/stock-adjust', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, newStock, reason, type }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Failed to adjust stock on server.' };
  }
}

export async function apiAdminGetStockLogs(token: string): Promise<{
  success: boolean;
  logs?: any[];
  error?: string;
}> {
  try {
    const res = await fetch('/api/admin/stock-logs', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Failed to fetch stock logs.' };
  }
}

export async function apiAdminGetOrders(token: string): Promise<{
  success: boolean;
  orders?: Order[];
  error?: string;
}> {
  try {
    const res = await fetch('/api/admin/orders', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Failed to fetch orders.' };
  }
}
