import { Post } from './Post';

export interface User {
    id: string;
    username?: string;
    email: string | null;
    bio: string;
    profilePicture?: string;
    upvotes: number;
    posts?: Post[];
    createdAt: Date;
}

