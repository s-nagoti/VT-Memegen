import { Comment } from './Comment';

export interface Post {
    id: string,
    title: string,
    description: string,
    imageUrl: string,
    texts: string, // Store the custom texts
    upvotes: number,
    downvotes: number,
    createdAt: Date,
    comments?: Comment[]
}