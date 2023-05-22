export interface User {
  username: string;
  email: string;
  password: string;
}

export interface UserForLogin {
  username: string;
  password: string;
  token: string;
}

export interface UserGame {
  userId: number,
  gameId: number,
  description: string
}

