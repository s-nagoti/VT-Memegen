// src/components/PostDetailPage.tsx

import React, { useEffect, useState, FormEvent } from "react";
import { useParams } from "react-router-dom";
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
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebaseConfig";
import { useAuth } from "../../Contexts/AuthContext";
import { useUser } from "../../Contexts/UserContext";
import { Post } from "../../Models/Post";
import { Comment } from "../../Models/Comment";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header/Header";
import {
  FaArrowUp,
  FaArrowDown,
  FaSpinner,
  FaExclamationCircle,
  FaCheckCircle,
  FaBrain,
} from "react-icons/fa";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const [voteLoading, setVoteLoading] = useState<boolean>(false);
  const [summaryExpanded, setSummaryExpanded] = useState(false); // State to toggle summary
  const [loadingSummary, setLoadingSummary] = useState(false); // State for loading spinner
  const [aiSummary, setAiSummary] = useState<string | null>(null); // State for storing AI summary
  const [commentLikeLoading, setCommentLikeLoading] = useState(false);
  const [commentLikeError, setCommentLikeError] = useState(null);
  
  const navigate = useNavigate();

  // Contexts
  const { user } = useUser(); // Assuming user contains user.id and user.username
  const { currentUser } = useAuth(); // If needed

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        if (typeof postId !== "string" || postId.trim() === "") {
          throw new Error("Invalid post ID");
        }
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const postData = postSnap.data();
          const createdAt = postData.createdAt as Timestamp;
          const authorId = postData.authorId as string;

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
          };

          setPost(postDetails);
        } else {
          setError("Post not found.");
        }
      } catch (err: any) {
        console.error("Error fetching post:", err);
        setError(err.message || "Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  // Fetch comments in real-time
  useEffect(() => {
    if (!postId) return;

    const commentsRef = collection(db, "posts", postId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const fetchedComments: Comment[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedComments.push({
            id: doc.id,
            authorId: data.authorId,
            authorUsername: data.authorUsername,
            text: data.text,
            likes: data.likes || [],
            createdAt: data.createdAt.toDate(),
          });
        });
        setComments(fetchedComments);
      },
      (error) => {
        console.error("Error fetching comments:", error);
        setError("Failed to load comments.");
      }
    );

    return () => unsubscribe(); // Cleanup on unmount or postId change
  }, [postId]);


   // Handle Like
   const handleCommentLike = async (comment: Comment) => {
    if (!user || !comment) {
      setError("You must be logged in to like.");
      return;
    }

    setCommentLikeLoading(true);
    try {
      const commentRef = doc(db,"posts", post?.id ?? '', "comments", comment.id);
      const likes = comment.likes || [];
      const hasLiked = likes.includes(user?.id ?? '');

      const batch = writeBatch(db);

      if (hasLiked) {
        batch.update(commentRef, { likes: arrayRemove(user?.id ?? '') });
      } else {
        batch.update(commentRef, { likes: arrayUnion(user?.id ?? '') });
      }

      await batch.commit();

      setError(null);
    } catch (err) {
      console.error("Error liking:", err);
      setError("Failed to like.");
    } finally {
      setCommentLikeLoading(false);
    }
  };

  // Mock function to simulate API call to backend
  const generateAISummary = async () => {
    setLoadingSummary(true);
    setAiSummary(null); // Clear previous summary
    try {
      const storageRef = ref(storage, `posts/${post?.id ?? ""}.jpg`);
      const finalImageUrl = await getDownloadURL(storageRef);

      // Send the image to the backend for explanation
      const backendResponse = await axios.post(
        "http://localhost:5000/api/explain-image",
        {
          imageUrl: finalImageUrl, // Send the URL to the backend
        }
      );

      const explanation = backendResponse.data.explanation.content;

      // Replace this with actual API call to your backend
      // const response = await axios.post('/api/generate-summary', { title, description });
      setAiSummary(explanation || "No explanation found.");
    } catch (error) {
      console.error("Error generating AI summary:", error);
      setAiSummary("Failed to generate summary. Please try again.");
    } finally {
      setLoadingSummary(false);
    }
  };

  // Toggle summary section
  const handleToggleSummary = () => {
    if (!summaryExpanded) {
      generateAISummary();
    }
    setSummaryExpanded((prev) => !prev);
  };

  // Handle Upvote
  const handleUpvote = async () => {
    if (!user || !post) {
      setError("You must be logged in to upvote.");
      return;
    }

    setVoteLoading(true);
    try {
      const postRef = doc(db, "posts", post.id);
      const downvotes = post.downvotes as string[];
      const upvotes = post.upvotes as string[];
      const hasDownvoted = downvotes.includes(user.id);
      const hasUpvoted = upvotes.includes(user.id);

      const batch = writeBatch(db);

      if (hasUpvoted) {
        batch.update(postRef, { upvotes: arrayRemove(user.id) });
        batch.update(doc(db, "users", user?.id ?? ""), {
          likedPosts: arrayRemove(post.id),
        })
      } else {
        batch.update(postRef, {
          upvotes: arrayUnion(user.id),
          downvotes: arrayRemove(user.id),
        });
        batch.update(doc(db, "users", user?.id ?? ""), {
          likedPosts: arrayUnion(post.id),
        })
      }

      await batch.commit();

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

      setError(null);
    } catch (err: any) {
      console.error("Error upvoting:", err);
      setError("Failed to upvote.");
    } finally {
      setVoteLoading(false);
    }
  };

  const handleDownvote = async () => {
    if (!user || !post) {
      setError("You must be logged in to downvote.");
      return;
    }

    setVoteLoading(true);
    try {
      const postRef = doc(db, "posts", post.id);
      const downvotes = post.downvotes as string[];
      const upvotes = post.upvotes as string[];
      const hasDownvoted = downvotes.includes(user.id);
      const hasUpvoted = upvotes.includes(user.id);

      const batch = writeBatch(db);

      if (hasDownvoted) {
        batch.update(postRef, { downvotes: arrayRemove(user.id) });
      } else {
        batch.update(postRef, {
          downvotes: arrayUnion(user.id),
          upvotes: arrayRemove(user.id),
        });
      }

      await batch.commit();

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

      setError(null);
    } catch (err: any) {
      console.error("Error downvoting:", err);
      setError("Failed to downvote.");
    } finally {
      setVoteLoading(false);
    }
  };

  // Handle Add Comment
  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to add a comment.");
      return;
    }

    if (!commentText.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    setCommentLoading(true);
    try {
      const commentsRef = collection(db, "posts", postId!, "comments");
      const docRef = await addDoc(commentsRef, {
        authorId: user.id,
        authorUsername: user.username ?? "",
        text: commentText.trim(),
        createdAt: Timestamp.fromDate(new Date()),
        likes: [],
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

      // Clear the comment input field
      setCommentText("");

      // Clear any existing errors
      setError(null);
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  // Render Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <span className="ml-2 text-xl text-gray-700">Loading post...</span>
      </div>
    );
  }

  // Render Error State
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center bg-red-100 text-red-700 px-6 py-4 rounded-lg">
          <FaExclamationCircle className="w-6 h-6 mr-3" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // Render Not Found State
  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center bg-yellow-100 text-yellow-700 px-6 py-4 rounded-lg">
          <FaExclamationCircle className="w-6 h-6 mr-3" />
          <span>Post not found.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        email={user?.email || ""}
        onHomeClick={() => navigate("/")}
        onProfileClick={() => navigate("/profile-page")}
        showHome={true}
        showProfile={true}
      />

      {/* Main Content */}
      <div className="container mx-auto p-6">
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
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {post.title}
                </h2>
                <p className="text-gray-700">{post.description}</p>
              </div>
              {/* Upvote/Downvote Section */}
              <div className="mt-6 flex items-center space-x-6">
                {/* Upvote Button */}
                <button
                  onClick={handleUpvote}
                  disabled={voteLoading}
                  className={`flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 ${
                    post.upvotes.includes(user?.id || "") ? "font-semibold" : ""
                  }`}
                >
                  <FaArrowUp className="w-5 h-5" color={post.upvotes.includes(user?.id ?? "") ? 'red' : 'black'} />
                  <span>{post.upvotes.length}</span>
                </button>
                {/* Downvote Button */}
                <button
                  onClick={handleDownvote}
                  disabled={voteLoading}
                  className={`flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors duration-200 ${
                    post.downvotes.includes(user?.id || "")
                      ? "font-semibold"
                      : ""
                  }`}
                >
                  <FaArrowDown className="w-5 h-5" color={post.downvotes.includes(user?.id ?? "") ? 'red' : 'black'}/>
                  <span>{post.downvotes.length}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Summarize Button and Section */}
        <div className="mb-6 py-5">
          <button
            onClick={handleToggleSummary}
            className="w-full py-3 text-white font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 transition duration-200 flex items-center justify-center space-x-2"
          >
            <FaBrain className="w-5 h-5" />
            <span>AI Summarize</span>
          </button>
          {summaryExpanded && (
            <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-100">
              {/* AI Summary Loading */}
              {loadingSummary ? (
                <div className="flex items-center space-x-2">
                  <FaSpinner className="animate-spin w-5 h-5 text-indigo-600" />
                  <span>Generating summary...</span>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-2">
                    AI Generated Summary:
                  </h3>
                  <p className="text-gray-800">{aiSummary}</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="mt-8 bg-white p-3 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Comments</h3>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              required
            ></textarea>
            <button
              type="submit"
              disabled={commentLoading || !commentText.trim()}
              className={`mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !commentText.trim() || commentLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {commentLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Posting...
                </>
              ) : (
                "Post Comment"
              )}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-800 font-semibold">
                    {comment.authorUsername}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="text-gray-700 mt-2">{comment.text}</p>
                {/* Like button with icon and count */}
                <div className="flex items-center mt-2">
                  <button 
                    className="text-sm flex items-center" 
                    onClick={() => {handleCommentLike(comment)}}
                    disabled={commentLikeLoading}
                  >
                    <FontAwesomeIcon 
                      icon={faHeart} 
                      className={`mr-2 ${comment.likes.includes(user?.id ?? '') ? 'text-red-600' : 'text-gray-500'}`} 
                    />
                    {comment.likes.length}
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
