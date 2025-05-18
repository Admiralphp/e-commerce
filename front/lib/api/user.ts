'use client';

// User API functions - Integration with user management in auth service

// API URL
const API_URL = 'http://api.phoneaccessories.local/api';

// Types for user operations
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch current user profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to access your profile');
    }

    const response = await fetch(`${API_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user profile');
    }

    const data = await response.json();
    return data.data.user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    
    // Fallback to retrieving user from local storage if API fails
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        return {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } catch (e) {
        console.error('Error parsing user data from localStorage:', e);
      }
    }
    
    throw error;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to update your profile');
    }

    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user profile');
    }

    const data = await response.json();
    return data.data.user;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

/**
 * Update user password
 */
export async function updatePassword(currentPassword: string, newPassword: string): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to change your password');
    }

    const response = await fetch(`${API_URL}/users/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update password');
    }
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
}

/**
 * Admin: Get all users (admin only)
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in as admin to view all users');
    }

    const response = await fetch(`${API_URL}/users/admin/all`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch all users');
    }

    const data = await response.json();
    return data.data.users;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}
