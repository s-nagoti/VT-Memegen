
import { User } from './User';

export interface Comment {
  id: string;
  author: User;
  text: string;
  likes: number;
  createdAt: Date; // Firestore timestamp
}