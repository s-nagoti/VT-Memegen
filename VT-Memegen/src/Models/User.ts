
export interface User {
    id: string;
    username?: string;
    email: string | null;
    bio: string;
    profilePicture?: string;
    posts?: string[];
    createdAt: Date;
    likedPosts?: string[];
}

