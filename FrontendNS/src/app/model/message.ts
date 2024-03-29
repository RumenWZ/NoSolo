export interface Message {
  id: number,
  user1Id: number,
  user1DisplayName: string,
  user1ProfilePictureUrl: string,
  user2Id: number,
  messageString: string,
  timestamp: Date,
}

export interface newMessage {
  receiverUsername: string,
  message: string
}
