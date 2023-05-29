export interface UserGame {
  userId: number,
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
}
