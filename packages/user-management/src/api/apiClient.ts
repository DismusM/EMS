import { User, UserProfile } from '@ems/shared';

// Read from env; default to localhost for dev
const API_BASE_URL = process.env.NEXT_PUBLIC_USER_API_URL || 'http://localhost:3001/api';

export async function login(email: string, password: string): Promise<{ accessToken: string; user: User }> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to login');
  }
  return response.json();
}

export async function updateCurrentUserProfile(
  token: string,
  data: { name?: string; email?: string; password?: string; oldPassword?: string }
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update profile');
  }
  return response.json();
}

export async function getUserActivity(userId: string, token: string): Promise<Array<any>> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/activity`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch user activity');
  }
  return response.json();
}

export async function deleteUser(userId: string, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete user');
  }
}

export async function updateUserRole(userId: string, roleId: string, token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ roleId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update user role');
  }

  return response.json();
}

export async function setUserActive(userId: string, active: boolean, token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/active`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ active }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update active status');
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

export async function register(
  name: string, 
  email: string, 
  password: string, 
  phone?: string, 
  department?: string, 
  position?: string
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, phone, department, position }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to register');
  }

  return response.json();
}

export async function getUsers(
  token: string,
  status?: 'pending' | 'approved' | 'rejected',
  role?: string,
  q?: string
): Promise<UserProfile[]> {
  const url = new URL(`${API_BASE_URL}/users`);
  if (status) url.searchParams.append('status', status);
  if (role) url.searchParams.append('role', role);
  if (q) url.searchParams.append('q', q);

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch users');
  }

  return response.json();
}

export async function updateUserStatus(userId: string, status: 'approved' | 'rejected', token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update user status');
  }

  return response.json();
}

export async function refreshAccessToken(): Promise<{ accessToken: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to refresh token');
  }

  return response.json();
}

export async function logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to logout');
    }
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
