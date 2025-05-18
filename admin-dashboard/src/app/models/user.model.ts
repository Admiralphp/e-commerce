export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}