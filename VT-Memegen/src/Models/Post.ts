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
    categories?: string[],
    commentsCount: number,
    aiExplenation?: string,
    storageRef?: string,
    pageViews?: string[],
}