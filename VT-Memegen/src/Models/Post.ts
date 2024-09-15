import { Comment } from './Comment';

export interface Post {
    id: string,
    title: string,
    description: string,
    imageUrl: string,
    texts: string, // Store the custom texts
    upvotes: string[],
    downvotes: string[],
    createdAt: Date,
    authorId: string,
    category?: string[],
    commentsCount: number,
    aiExplenation?: string,
}