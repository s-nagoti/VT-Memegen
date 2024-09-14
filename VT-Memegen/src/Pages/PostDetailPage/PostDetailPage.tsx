// src/components/PostDetailPage.tsx

import React, { useEffect, useState, FormEvent } from 'react';
import { increment } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Header from '../../Components/Header/Header';
import { useAuth } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: any; // Firestore timestamp
}

interface Post {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  upvotes: number;
  downvotes: number;
}

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        try {
          const docRef = doc(db, 'posts', postId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setPost({ id: docSnap.id, ...data } as Post);
            setUpvotes(data.upvotes || 0);
            setDownvotes(data.downvotes || 0);
          } else {
            setError('Post not found.');
          }
        } catch (error) {
          console.error('Error fetching post:', error);
          setError('Failed to fetch post.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    if (postId) {
      const commentsRef = collection(db, 'posts', postId, 'comments');
      const q = query(commentsRef, orderBy('createdAt', 'asc'));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const commentsData: Comment[] = [];
        querySnapshot.forEach((doc) => {
          commentsData.push({ id: doc.id, ...doc.data() } as Comment);
        });
        setComments(commentsData);
      }, (error) => {
        console.error('Error fetching comments:', error);
        setError('Failed to fetch comments.');
      });

      return () => unsubscribe();
    }
  }, [postId]);

  const handleUpvote = async () => {
    if (postId) {
      const postRef = doc(db, 'posts', postId);
      try {
        await updateDoc(postRef, { upvotes: increment(1) });
        setUpvotes(upvotes + 1);
      } catch (error) {
        console.error('Error upvoting:', error);
        setError('Failed to upvote.');
      }
    }
  };

  const handleDownvote = async () => {
    if (postId) {
      const postRef = doc(db, 'posts', postId);
      try {
        await updateDoc(postRef, { downvotes: increment(1) });
        setDownvotes(downvotes + 1);
      } catch (error) {
        console.error('Error downvoting:', error);
        setError('Failed to downvote.');
      }
    }
  };

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (postId) {
      setCommentLoading(true);
      try {
        const commentsRef = collection(db, 'posts', postId, 'comments');
        await addDoc(commentsRef, {
          author: 'Anonymous', // Replace with actual user data if available
          text: commentText,
          createdAt: new Date(),
        });
        setCommentText('');
      } catch (error) {
        console.error('Error adding comment:', error);
        setError('Failed to add comment.');
      } finally {
        setCommentLoading(false);
      }
    }
  };

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

  const { currentUser } = useAuth();


  return (
    <div>


      <div className="max-w-4xl mx-auto p-4">
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
                  className="flex items-center text-maroon hover:text-maroon-dark"
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
                  <span>{upvotes}</span>
                </button>
                <button
                  onClick={handleDownvote}
                  className="flex items-center text-maroon hover:text-maroon-dark"
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
                  <span>{downvotes}</span>
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
              disabled={commentLoading}
              className="mt-2 px-4 py-2 bg-maroon text-white rounded-lg hover:bg-maroon-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-maroon disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {commentLoading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4">
                  <p className="text-gray-800 font-semibold">{comment.author}</p>
                  <p className="text-gray-700">{comment.text}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.createdAt.seconds * 1000).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
