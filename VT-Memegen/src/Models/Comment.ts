
import { User } from './User';

export interface Comment {
  id: string;
  authorId: string;
  authorUsername: string,
  text: string;
  likes: string[];
  createdAt: Date; // Firestore timestamp
}