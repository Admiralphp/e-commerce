// Mock authentication API functions

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

// Mock user database
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
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find user with matching credentials
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

export async function registerUser(name: string, email: string, password: string): Promise<RegisterResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
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
  
  // In a real application, we would save this user to the database
  // mockUsers.push(newUser);
  
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

export async function getUserProfile(token: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, we would verify the token and retrieve the user
  // For demo purposes, return a mock user
  return {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user' as const
  };
}