import { getRandomId } from "../utils";
import { User } from "./User";

export class Room {
    private roomId: string;
    private roomUsers: User[];
    constructor() {
      this.roomId = `room-${getRandomId()}`;
      this.roomUsers = [];
    }
  
    getRoomId(): string {
      return this.roomId;
    }
  
    addUser(user: User): void {
      this.roomUsers.push(user);
    }
  
    hasUser(user: User): void {
      this.roomUsers.some((roomUser) => roomUser.getIndex() === user.getIndex());
    }
  
    isFull(): boolean {
      return this.roomUsers.length == 2;
    }
  }

  export const roomMap = new Map();