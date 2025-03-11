export interface IMessage {
  text: string;
  sender: string;
  timestamp: string;
}

interface User {
  userId: string;
  name: string;
  profilePic: string;
}

export interface IRoom {
  id: string;
  users: User[];
  latestMessage: IMessage;
}
