import { User } from '@ems/shared';

// In a real app, this would come from an environment variable
const API_BASE_URL = 'http://localhost:3001/api';

export async function login(email: string, password: string): Promise<{ token: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to login');
  }

  return response.json();
}

export async function createUser(userData: any, token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
    }

    return response.json();
}

export async function getCurrentUserProfile(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user profile');
    }

    return response.json();
}
