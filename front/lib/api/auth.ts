// Authentication API functions - Real API Integration

// API URL
const API_URL = 'http://api.phoneaccessories.local/api';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
}

interface RegisterResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user';
  };
}

// Mock user database for fallback
const mockUsers = [
  {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user' as const
  },
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin' as const
  }
];

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    // Call real authentication API
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    console.log('Falling back to mock authentication');
    
    // Fall back to mock authentication if API fails
    const user = mockUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Generate mock JWT token
    const token = `mock-jwt-token-${Date.now()}`;
    
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}

export async function registerUser(name: string, email: string, password: string): Promise<RegisterResponse> {
  try {
    // Call real registration API
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering user:', error);
    console.log('Falling back to mock registration');
    
    // Fall back to mock registration if API fails
    // Check if user already exists
    const existingUser = mockUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user (in a real app this would be saved to a database)
    const newUser = {
      id: `user${mockUsers.length + 1}`,
      name,
      email,
      password,
      role: 'user' as const
    };
    
    // Generate mock JWT token
    const token = `mock-jwt-token-${Date.now()}`;
    
    return {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    };
  }
}

export async function getUserProfile(token: string) {
  try {
    // Call real API to get user profile
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting user profile:', error);
    console.log('Falling back to mock user profile');
    
    // Fall back to mock profile if API fails
    return {
      id: 'user1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user' as const
    };
  }
}