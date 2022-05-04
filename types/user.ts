export interface AccountResponse {
  user: {
    id: string;
    email: string;
    username: string;
    is_active: boolean;
    created: Date;
    updated: Date;
    name: string;
    last_name: string;
  };
  access: string;
  refresh: string;
}

export interface UserResponse {
  email: string;
  username: string;
  is_active: string;
  created: Date;
  updated: Date;
  id: string;
  name: string;
  last_name: string;
}
