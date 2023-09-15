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

export interface UserDTO {
  id: number,
  username: string,
  email: string,
  createdOn: Date,
  profileImageUrl: string,
  displayName: string,
  discordUsername: string,
  summary: string
  isAdmin: boolean
}

export interface UserSearchResult {
  id: number,
  username: string,
  email: string,
  createdOn: Date,
  profileImageUrl: string,
  displayName: string,
  discordUsername: string,
  summary: string,
  friendStatus: string
  isAdmin: boolean
}
