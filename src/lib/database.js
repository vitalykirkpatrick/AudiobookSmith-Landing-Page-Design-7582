// Custom Database Integration
// This replaces Supabase with your own backend API

class DatabaseClient {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    this.apiKey = process.env.REACT_APP_API_KEY || '';
    this.authToken = null;
    this.initializeAuth();
  }

  // Initialize authentication from localStorage
  initializeAuth() {
    this.authToken = localStorage.getItem('auth_token');
  }

  // Helper method to make API requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` }),
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `API Error ${response.status}: ${response.statusText}`);
      }
      
      return data;
    } catch (error) {
      console.error('Database API Error:', error);
      throw error;
    }
  }

  // Authentication methods
  async signUp(userData) {
    try {
      const { email, password, ...otherData } = userData;
      const response = await this.makeRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, ...otherData })
      });

      if (response.token) {
        this.authToken = response.token;
        localStorage.setItem('auth_token', response.token);
      }

      return { data: response, error: null };
    } catch (error) {
      return { data: null, error: error };
    }
  }

  async signIn(credentials) {
    try {
      const { email, password } = credentials;
      const response = await this.makeRequest('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (response.token) {
        this.authToken = response.token;
        localStorage.setItem('auth_token', response.token);
      }

      return { data: response, error: null };
    } catch (error) {
      return { data: null, error: error };
    }
  }

  async signOut() {
    try {
      await this.makeRequest('/auth/signout', {
        method: 'POST'
      });
      
      this.authToken = null;
      localStorage.removeItem('auth_token');
      
      return { error: null };
    } catch (error) {
      // Even if the API call fails, clear local storage
      this.authToken = null;
      localStorage.removeItem('auth_token');
      return { error: error };
    }
  }

  async resetPasswordForEmail(email) {
    try {
      const response = await this.makeRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error: error };
    }
  }

  // Database operations
  async insert(table, data) {
    try {
      const response = await this.makeRequest(`/db/${table}`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error: error };
    }
  }

  async select(table, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });

      const endpoint = `/db/${table}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await this.makeRequest(endpoint);
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error: error };
    }
  }

  async update(table, id, data) {
    try {
      const response = await this.makeRequest(`/db/${table}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error: error };
    }
  }

  async delete(table, id) {
    try {
      const response = await this.makeRequest(`/db/${table}/${id}`, {
        method: 'DELETE'
      });
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error: error };
    }
  }

  // Upsert operation (insert or update)
  async upsert(table, data, conflictColumn = 'id') {
    try {
      const response = await this.makeRequest(`/db/${table}/upsert`, {
        method: 'POST',
        body: JSON.stringify({ data, conflictColumn })
      });
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error: error };
    }
  }

  // File upload
  async uploadFile(file, bucket = 'uploads') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);

      const response = await this.makeRequest('/storage/upload', {
        method: 'POST',
        body: formData,
        headers: {} // Remove Content-Type to let browser set it for FormData
      });

      return { data: response, error: null };
    } catch (error) {
      return { data: null, error: error };
    }
  }

  // Get current user
  getCurrentUser() {
    if (!this.authToken) return null;

    try {
      // Decode JWT token
      const payload = JSON.parse(atob(this.authToken.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    if (!this.authToken) return false;

    try {
      const payload = JSON.parse(atob(this.authToken.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch (error) {
      return false;
    }
  }

  // Get user data
  async getUser() {
    const user = this.getCurrentUser();
    return { data: { user }, error: null };
  }
}

// Create and export database client instance
const database = new DatabaseClient();

// Export auth object for compatibility with existing code
export const auth = {
  signUp: database.signUp.bind(database),
  signInWithPassword: database.signIn.bind(database),
  signOut: database.signOut.bind(database),
  resetPasswordForEmail: database.resetPasswordForEmail.bind(database),
  getUser: database.getUser.bind(database)
};

export default database;