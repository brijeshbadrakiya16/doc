export interface User {
  id: string;
  email: string;
  name: string;
  activeFileCount: number;
  createdAt?: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token: string;
  };
}
