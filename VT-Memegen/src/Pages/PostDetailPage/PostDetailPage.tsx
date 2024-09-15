// src/components/PostDetailPage.tsx

import React, { useEffect, useState, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  arrayUnion,
  arrayRemove,
  writeBatch,
  Timestamp,
  query,
    onSnapshot,
    orderBy,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../Contexts/AuthContext';
import { useUser } from '../../Contexts/UserContext';
import { Post } from '../../Models/Post';
import { Comment } from '../../Models/Comment';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header/Header';

const PostDetailPage: React.FC = () => {
  // Extract postId from URL parameters
  const { postId } = useParams<{ postId: string }>();

  // Component state
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!postId) return;
  
    const unsubscribe = fetchComments(postId, setComments);
  
    return () => unsubscribe(); // Cleanup on unmount or postId change
  }, [postId]);


  // Contexts
  const { user } = useUser(); // Assuming user contains user.id
  const { currentUser } = useAuth(); // If needed

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        // Validate postId
        if (typeof postId !== 'string' || postId.trim() === '') {
          throw new Error('Invalid post ID');
        }

        // Reference to the specific post document
        const postRef = doc(db, 'posts', postId);

        // Fetch the document snapshot
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const postData = postSnap.data();

          // Ensure 'createdAt' is a Firestore Timestamp
          const createdAt = postData.createdAt as Timestamp;
          const authorId = postData.authorId as string;

          // Type assertion: assume postData conforms to Post interface, excluding 'id'
          const postDetails: Post = {
            id: postSnap.id,
            title: postData.title as string,
            description: postData.description as string,
            imageUrl: postData.imageUrl as string,
            texts: postData.texts,
            createdAt: createdAt.toDate(),
            authorId: authorId,
            upvotes: postData.upvotes || [],
            downvotes: postData.downvotes || [],
            commentsCount: postData.commentsCount || 0,
            // include other fields as needed
          };

          setPost(postDetails);
          setLoading(false)
        } else {
          setError('Post not found.');
        }
      } catch (err: any) {
        console.error('Error fetching post:', err);
        setError(err.message || 'Failed to load post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const fetchComments = (postId: string, setComments: (comments: Comment[]) => void) => {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
  
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const comments: Comment[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          comments.push({
            id: doc.id,
            authorId: data.authorId,
            authorUsername: data.authorUsername,
            text: data.text,
            likes: [],
            createdAt: data.createdAt.toDate(),
          });
        });
        setComments(comments);
      },
      (error) => {
        console.error('Error fetching comments:', error);
        // Handle error (e.g., set an error state)
      }
    );
  
    return unsubscribe; // For cleanup
  };

  // Handle Upvote
  const handleUpvote = async () => {
    if (!user || !post) {
      setError('You must be logged in to upvote.');
      return;
    }

    try {
      const postRef = doc(db, 'posts', post.id);
      const downvotes = post.downvotes as string[]
      const upvotes = post.upvotes as string[]
      const hasDownvoted = downvotes.includes(user.id);
      const hasUpvoted =    upvotes.includes(user.id);

      const batch = writeBatch(db);

      if (hasUpvoted) {
        // Remove upvote
        batch.update(postRef, {
          upvotes: arrayRemove(user.id),
        });
      } else {
        // Add upvote and remove downvote if exists
        batch.update(postRef, {
          upvotes: arrayUnion(user.id),
          downvotes: arrayRemove(user.id),
        });
      }

      await batch.commit();

      // Optimistically update local state
      setPost((prevPost) => {
        if (!prevPost) return prevPost;
        let newUpvotes = [...prevPost.upvotes];
        let newDownvotes = [...prevPost.downvotes];

        if (hasUpvoted) {
          newUpvotes = newUpvotes.filter((id) => id !== user.id);
        } else {
          newUpvotes.push(user.id);
          newDownvotes = newDownvotes.filter((id) => id !== user.id);
        }

        return { ...prevPost, upvotes: newUpvotes, downvotes: newDownvotes };
      });

      // Clear any previous errors
      setError(null);
    } catch (err: any) {
      console.error('Error upvoting:', err);
      setError('Failed to upvote.');
    }
  };

  // Handle Downvote
  const handleDownvote = async () => {
    if (!user || !post) {
      setError('You must be logged in to downvote.');
      return;
    }

    try {
      const postRef = doc(db, 'posts', post.id);
      const downvotes = post.downvotes as string[]
      const upvotes = post.upvotes as string[]
      const hasDownvoted = downvotes.includes(user.id);
      const hasUpvoted =  upvotes.includes(user.id);

      const batch = writeBatch(db);

      if (hasDownvoted) {
        // Remove downvote
        batch.update(postRef, {
          downvotes: arrayRemove(user.id),
        });
      } else {
        // Add downvote and remove upvote if exists
        batch.update(postRef, {
          downvotes: arrayUnion(user.id),
          upvotes: arrayRemove(user.id),
        });
      }

      await batch.commit();

      // Optimistically update local state
      setPost((prevPost) => {
        if (!prevPost) return prevPost;
        let newDownvotes = [...prevPost.downvotes];
        let newUpvotes = [...prevPost.upvotes];

        if (hasDownvoted) {
          newDownvotes = newDownvotes.filter((id) => id !== user.id);
        } else {
          newDownvotes.push(user.id);
          newUpvotes = newUpvotes.filter((id) => id !== user.id);
        }

        return { ...prevPost, upvotes: newUpvotes, downvotes: newDownvotes };
      });

      // Clear any previous errors
      setError(null);
    } catch (err: any) {
      console.error('Error downvoting:', err);
      setError('Failed to downvote.');
    }
  };


  const handleAddComment = async (e: FormEvent) => {
  e.preventDefault();

  if (!user) {
    setError('You must be logged in to add a comment.');
    return;
  }

  if (!commentText.trim()) {
    setError('Comment cannot be empty.');
    return;
  }

  try {
    const commentsRef = collection(db, 'posts', postId!, 'comments');
    const docRef = await addDoc(commentsRef, {
      authorId: user.id,
      authorUsername: user.username ?? "",
      text: commentText.trim(),
      createdAt: Timestamp.fromDate(new Date()),
    });

    // Optionally, update local state optimistically
    const newComment: Comment = {
      id: docRef.id,
      authorId: user.id,
      authorUsername: user.username ?? "",
      likes: [],
      text: commentText.trim(),
      createdAt: new Date(),
    };
    setComments((prevComments) => [...prevComments, newComment]);

    // Clear the comment input field
    setCommentText('');

    // Clear any existing errors
    setError(null);
  } catch (error) {
    console.error('Error adding comment:', error);
    setError('Failed to add comment.');
  }
};
  

  


  // Now, ensure that all Hooks are called at the top level
  // No hooks are called inside conditionals or nested functions

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading post...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Post not found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">

    <Header
        onHomeClick={() => navigate('/')}
    />

      {/* Post Container */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Content Section */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-maroon mb-4">{post.title}</h2>
              <p className="text-gray-700">{post.description}</p>
             
            </div>
            {/* Upvote/Downvote Section */}
            <div className="mt-6 flex items-center space-x-4">
              <button
                onClick={handleUpvote}
                className={`flex items-center text-maroon hover:text-maroon-dark ${
                  post.upvotes.includes(user?.id || '') ? 'font-semibold' : ''
                }`}
              >
                {/* Upvote Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                <span>{post.upvotes.length}</span>
              </button>
              <button
                onClick={handleDownvote}
                className={`flex items-center text-maroon hover:text-maroon-dark ${
                  post.downvotes.includes(user?.id || '') ? 'font-semibold' : ''
                }`}
              >
                {/* Downvote Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span>{post.downvotes.length}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-maroon mb-4">Comments</h3>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mb-6">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon resize-none"
            rows={3}
            required
          ></textarea>
          <button
            type="submit"
            className={`mt-2 px-4 py-2 bg-maroon text-white rounded-lg hover:bg-maroon-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-maroon ${
              !commentText.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!commentText.trim()}
          >
            Post Comment
          </button>
        </form>

            {/* Comments List */}
<div className="space-y-4">
  {comments.length === 0 ? (
    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
  ) : (
    comments.map((comment) => (
      <div key={comment.id} className="border-b pb-4">
        <p className="text-gray-800 font-semibold">{comment.authorUsername}</p>
        <p className="text-gray-700">{comment.text}</p>
        <p className="text-sm text-gray-500">
          {new Date(comment.createdAt).toLocaleString()}
        </p>
      </div>
    ))
  )}
</div>

      </div>
    </div>
  );
};

export default PostDetailPage;
