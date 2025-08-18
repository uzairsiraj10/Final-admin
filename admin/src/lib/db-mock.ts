// Mock database for development when connection limits are extremely restrictive
export type DbResult<T> = T extends Promise<infer U> ? U : never;

// Mock data storage
const mockUsers = [
  { id: 1, name: "Admin User", email: "admin@mazdoor.com", role: "admin", status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 2, name: "John Doe", email: "john@example.com", role: "customer", status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 3, name: "Jane Smith", email: "jane@example.com", role: "customer", status: "inactive", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const mockCategories = [
  { id: 1, name: "Plumbing", name_urdu: "پلمبنگ", description: "Water and pipe related services", status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 2, name: "Electrical", name_urdu: "بجلی", description: "Electrical installation and repair", status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 3, name: "Carpentry", name_urdu: "بڑھئی", description: "Wood work and furniture", status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const mockLabour = [
  { id: 1, name: "Ali Hassan", category_id: 1, category_name: "Plumbing", status: "approved", rating: 4.5, city: "Lahore", phone: "+92-300-1234567", email: "ali@example.com", description: "Experienced plumber", experience_years: 5, hourly_rate: 500, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 2, name: "Ahmed Khan", category_id: 2, category_name: "Electrical", status: "approved", rating: 4.2, city: "Karachi", phone: "+92-321-9876543", email: "ahmed@example.com", description: "Licensed electrician", experience_years: 3, hourly_rate: 600, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const mockBookings = [
  { id: 1, customer_id: 2, labour_id: 1, category_id: 1, status: "confirmed", scheduled_date: new Date(Date.now() + 86400000).toISOString(), amount: 2000, description: "Fix kitchen sink", address: "123 Main St, Lahore", customer_name: "John Doe", customer_email: "john@example.com", labour_name: "Ali Hassan", category_name: "Plumbing", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 2, customer_id: 3, labour_id: 2, category_id: 2, status: "pending", scheduled_date: new Date(Date.now() + 172800000).toISOString(), amount: 1500, description: "Install ceiling fan", address: "456 Oak Ave, Karachi", customer_name: "Jane Smith", customer_email: "jane@example.com", labour_name: "Ahmed Khan", category_name: "Electrical", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const mockReferrals = [
  { id: 1, referrer_name: "Ali Hassan", referrer_email: "ali@example.com", referrer_phone: "+92-300-1234567", referred_name: "Hassan Ali", referred_email: "hassan@example.com", referred_phone: "+92-301-7654321", category_id: 1, category_name: "Plumbing", status: "pending", notes: "Good friend", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

// Simulate database delay
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  await simulateDelay();
  
  console.log(`[MOCK DB] Query: ${sql.substring(0, 100)}${sql.length > 100 ? '...' : ''}`);
  
  // Parse SQL to determine what data to return
  const sqlLower = sql.toLowerCase();
  
  if (sqlLower.includes('select 1 as test')) {
    return [{ test: 1 }] as T[];
  }
  
  if (sqlLower.includes('from users')) {
    if (sqlLower.includes('where email = ?') && params.length > 0) {
      const user = mockUsers.find(u => u.email === params[0]);
      return user ? [user] as T[] : [];
    }
    if (sqlLower.includes('where id = ?') && params.length > 0) {
      const user = mockUsers.find(u => u.id === parseInt(params[0]));
      return user ? [user] as T[] : [];
    }
    return [...mockUsers] as T[];
  }
  
  if (sqlLower.includes('from categories')) {
    if (sqlLower.includes('where id = ?') && params.length > 0) {
      const category = mockCategories.find(c => c.id === parseInt(params[0]));
      return category ? [category] as T[] : [];
    }
    return [...mockCategories] as T[];
  }
  
  if (sqlLower.includes('from labour_profiles')) {
    if (sqlLower.includes('where id = ?') && params.length > 0) {
      const labour = mockLabour.find(l => l.id === parseInt(params[0]));
      return labour ? [labour] as T[] : [];
    }
    return [...mockLabour] as T[];
  }
  
  if (sqlLower.includes('from bookings')) {
    if (sqlLower.includes('where id = ?') && params.length > 0) {
      const booking = mockBookings.find(b => b.id === parseInt(params[0]));
      return booking ? [booking] as T[] : [];
    }
    return [...mockBookings] as T[];
  }
  
  if (sqlLower.includes('insert into users')) {
    const newId = Math.max(...mockUsers.map(u => u.id)) + 1;
    const newUser = {
      id: newId,
      name: params[0] || 'New User',
      email: params[1] || 'new@example.com',
      role: params[3] || 'customer',
      status: params[4] || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return [{ insertId: newId }] as T[];
  }
  
  if (sqlLower.includes('insert into categories')) {
    const newId = Math.max(...mockCategories.map(c => c.id)) + 1;
    const newCategory = {
      id: newId,
      name: params[0] || 'New Category',
      name_urdu: params[1] || null,
      description: params[2] || null,
      status: params[3] || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockCategories.push(newCategory);
    return [{ insertId: newId }] as T[];
  }
  
  if (sqlLower.includes('insert into labour_profiles')) {
    const newId = Math.max(...mockLabour.map(l => l.id)) + 1;
    const categoryName = mockCategories.find(c => c.id === params[1])?.name || 'Unknown';
    const newLabour = {
      id: newId,
      name: params[0] || 'New Labour',
      category_id: params[1] || 1,
      category_name: categoryName,
      status: params[2] || 'pending',
      rating: params[3] || 0,
      city: params[4] || 'Unknown',
      phone: params[5] || '+92-000-0000000',
      email: params[6] || null,
      description: params[7] || null,
      experience_years: params[8] || 0,
      hourly_rate: params[9] || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockLabour.push(newLabour);
    return [{ insertId: newId }] as T[];
  }
  
  if (sqlLower.includes('insert into bookings')) {
    const newId = Math.max(...mockBookings.map(b => b.id)) + 1;
    const customer = mockUsers.find(u => u.id === params[0]);
    const labour = mockLabour.find(l => l.id === params[1]);
    const category = mockCategories.find(c => c.id === params[2]);
    
    const newBooking = {
      id: newId,
      customer_id: params[0] || 1,
      labour_id: params[1] || null,
      category_id: params[2] || 1,
      status: params[3] || 'pending',
      scheduled_date: params[4] || new Date().toISOString(),
      amount: params[5] || 0,
      description: params[6] || null,
      address: params[7] || null,
      customer_name: customer?.name || 'Unknown Customer',
      customer_email: customer?.email || null,
      labour_name: labour?.name || null,
      category_name: category?.name || 'Unknown Category',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockBookings.push(newBooking);
    return [{ insertId: newId }] as T[];
  }
  
  // Handle UPDATE queries
  if (sqlLower.includes('update users') && sqlLower.includes('where id = ?')) {
    const id = parseInt(params[params.length - 1]);
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      mockUsers[userIndex].updated_at = new Date().toISOString();
      return [{ affectedRows: 1 }] as T[];
    }
  }
  
  // Handle DELETE queries
  if (sqlLower.includes('delete from users') && sqlLower.includes('where id = ?')) {
    const id = parseInt(params[0]);
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      mockUsers.splice(userIndex, 1);
      return [{ affectedRows: 1 }] as T[];
    }
  }
  
  console.log(`[MOCK DB] Unhandled query: ${sql}`);
  return [] as T[];
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results[0] || null;
}

export async function testConnection(): Promise<boolean> {
  try {
    await query('SELECT 1 as test');
    console.log('[MOCK DB] Connection test successful');
    return true;
  } catch (error) {
    console.error('[MOCK DB] Connection test failed:', error);
    return false;
  }
}

export async function closeConnection(): Promise<void> {
  console.log('[MOCK DB] Mock connection closed successfully');
}
