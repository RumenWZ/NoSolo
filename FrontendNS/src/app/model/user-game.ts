import { UserDTO } from "./user";

export interface UserGame {
  gameId: number,
  description: string
}

export interface UserGameDTO {
  userGameId: number,
  gameId: number,
  gameName: string,
  gameImageUrl: string,
  userDescription: string,
  userGameAddedOn: Date
  isMatching?: boolean
}

export interface MatchedUserDTO {
  user: UserDTO;
  userGames: UserGameDTO[];
}
