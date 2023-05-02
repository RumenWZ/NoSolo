export interface User {
  userName: string;
  email: string;
  password: string;
}

export interface UserForLogin {
  userName: string;
  password: string;
  token: string;
}
