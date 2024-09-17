import React, { useEffect, useState, FormEvent } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
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
  FaBrain,
} from "react-icons/fa";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {User} from '../../Models/User'
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const [voteLoading, setVoteLoading] = useState<boolean>(false);
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [commentLikeLoading, setCommentLikeLoading] = useState(false);
  const [author, setAuthor] = useState<User | null>(null) 

  const navigate = useNavigate();

  const { user } = useUser();

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
          
          const userRef = doc(db, "users", authorId)
          const userSnap = await getDoc(userRef)
          const userData = userSnap.data()
          if(userSnap.exists()){
            const userDetails : User = {
              id: authorId,
              username: userData?.username ?? "",
              email: userData?.email ?? "",
              bio: userData?.bio ?? "",
              createdAt: userData?.createdAt ?? Date()
            }
            setAuthor(userDetails)
          }

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

  useEffect(() => {

    const trackPostViews = async () => {
      if (typeof postId !== "string" || postId.trim() === "") {
        throw new Error("Invalid post ID");
      }
  
      const postRef = doc(db, 'posts', post?.id ?? "")
      const postSnap = await getDoc(postRef)
      const postData = postSnap.data()
      if(postSnap.exists()){
        if (!postData?.pageViews.includes(user?.id ?? "") ?? true){
          const batch = writeBatch(db)

          batch.update(postRef, {pageViews: arrayUnion(user?.id ?? "")})
          await batch.commit();
        }
      }
    }
  
    trackPostViews()

  }, [post])

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

    return () => unsubscribe();
  }, [postId]);

  const handleCommentLike = async (comment: Comment) => {
    if (!user || !comment) {
      setError("You must be logged in to like.");
      return;
    }

    setCommentLikeLoading(true);
    try {
      const commentRef = doc(
        db,
        "posts",
        post?.id ?? "",
        "comments",
        comment.id
      );
      const likes = comment.likes || [];
      const hasLiked = likes.includes(user?.id ?? "");

      const batch = writeBatch(db);

      if (hasLiked) {
        batch.update(commentRef, { likes: arrayRemove(user?.id ?? "") });
      } else {
        batch.update(commentRef, { likes: arrayUnion(user?.id ?? "") });
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

  const generateAISummary = async () => {
    setLoadingSummary(true);
    setAiSummary(null);
    try {
      const storageRef = ref(storage, `posts/${post?.id ?? ""}.jpg`);
      const finalImageUrl = await getDownloadURL(storageRef);

      const backendResponse = await axios.post(
        "http://10.0.0.239:5000/api/explain-image",
        {
          imageUrl: finalImageUrl,
        }
      );

      const explanation = backendResponse.data.explanation.content;
      setAiSummary(explanation || "No explanation found.");
    } catch (error) {
      console.error("Error generating AI summary:", error);
      setAiSummary(`Failed to generate summary. Error: ${error}`);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleToggleSummary = () => {
    if (!summaryExpanded) {
      generateAISummary();
    }
    setSummaryExpanded((prev) => !prev);
  };

  const handleUpvote = async () => {
    if (!user || !post) {
      setError("You must be logged in to upvote.");
      return;
    }

    setVoteLoading(true);
    try {
      const postRef = doc(db, "posts", post.id);
      const upvotes = post.upvotes as string[];
      const hasUpvoted = upvotes.includes(user.id);

      const batch = writeBatch(db);

      if (hasUpvoted) {
        batch.update(postRef, { upvotes: arrayRemove(user.id) });
        batch.update(doc(db, "users", user?.id ?? ""), {
          likedPosts: arrayRemove(post.id),
        });
      } else {
        batch.update(postRef, {
          upvotes: arrayUnion(user.id),
          downvotes: arrayRemove(user.id),
        });
        batch.update(doc(db, "users", user?.id ?? ""), {
          likedPosts: arrayUnion(post.id),
        });
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
      const hasDownvoted = downvotes.includes(user.id);

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
      await addDoc(commentsRef, {
        authorId: user.id,
        authorUsername: user.username ?? "",
        text: commentText.trim(),
        createdAt: Timestamp.fromDate(new Date()),
        likes: [],
      });

      setCommentText("");
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
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="flex flex-col items-center space-y-2">
          <FaSpinner className="animate-spin text-4xl text-[#E87722]" />
          <span className="text-2xl">Loading post...</span>
        </div>
      </div>
    );
  }

  // Render Error State
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="flex items-center bg-red-600 text-white px-6 py-4 rounded-lg shadow-md">
          <FaExclamationCircle className="w-6 h-6 mr-3" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // Render Not Found State
  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="flex items-center bg-yellow-600 text-white px-6 py-4 rounded-lg shadow-md">
          <FaExclamationCircle className="w-6 h-6 mr-3" />
          <span>Post not found.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
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
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-1/2">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            {/* Content Section */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {post.title}
                </h2>
                <p className="text-gray-400 mb-6">{post.description}</p>
                {/* Author and Timestamp */}
                <div className="text-gray-500 text-sm mb-4">
                  <span>
                    Posted by {author?.username ?? "unknown"} on{" "}
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              {/* Upvote/Downvote Section */}
              <div className="flex items-center space-x-6">

                <p className='flex items-center space-x-2 text-gray-400 hover:text-[#861F41] transition-colors duration-200 font-semibold'>{post.pageViews?.length ?? 0} views</p>
                {/* Upvote Button */}
                <button
                  onClick={handleUpvote}
                  disabled={voteLoading}
                  className={`flex items-center space-x-2 text-gray-400 hover:text-[#861F41] transition-colors duration-200 ${
                    post.upvotes.includes(user?.id || "") ? "font-semibold" : ""
                  }`}
                >
                  <FaArrowUp
                    className="w-5 h-5"
                    color={
                      post.upvotes.includes(user?.id ?? "") ? "red" : "grey"
                    }
                  />
                  <span>{post.upvotes.length}</span>
                </button>
                {/* Downvote Button */}
                <button
                  onClick={handleDownvote}
                  disabled={voteLoading}
                  className={`flex items-center space-x-2 text-gray-400 hover:text-[#861F41] transition-colors duration-200 ${
                    post.downvotes.includes(user?.id || "")
                      ? "font-semibold "
                      : ""
                  }`}
                >
                  <FaArrowDown
                    className="w-5 h-5"
                    color={
                      post.downvotes.includes(user?.id ?? "") ? "red" : "grey"
                    }
                  />
                  <span>{post.downvotes.length}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Summarize Button and Section */}
        <div className="mb-8">
          <button
            onClick={handleToggleSummary}
            className="w-full py-3 text-white font-semibold rounded-lg bg-[#861F41] hover:bg-[#E87722] transition duration-200 flex items-center justify-center space-x-2 shadow-md"
          >
            <FaBrain className="w-5 h-5" />
            <span>AI Summarize</span>
          </button>
          {summaryExpanded && (
            <div className="mt-4 p-4 border border-gray-600 rounded-lg bg-gray-800 shadow-md">
              {/* AI Summary Loading */}
              {loadingSummary ? (
                <div className="flex items-center space-x-2">
                  <FaSpinner className="animate-spin w-5 h-5 text-[#E87722]" />
                  <span className="text-gray-400">Generating summary...</span>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    AI Generated Summary:
                  </h3>
                  <p className="text-gray-400">{aiSummary}</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-white mb-6">Comments</h3>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E87722] resize-none bg-gray-700 text-white"
              rows={3}
              required
            ></textarea>
            <button
              type="submit"
              disabled={commentLoading || !commentText.trim()}
              className={`mt-4 px-4 py-2 bg-[#861F41] text-white font-semibold rounded-lg hover:bg-[#E87722] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#E87722] ${
                !commentText.trim() || commentLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              } flex items-center justify-center space-x-2`}
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
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-gray-500">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-700 pb-4">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-semibold">
                      {comment.authorUsername}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-gray-400 mt-2">{comment.text}</p>
                  {/* Like button with icon and count */}
                  <div className="flex items-center mt-2">
                    <button
                      className="text-sm flex items-center"
                      onClick={() => handleCommentLike(comment)}
                      disabled={commentLikeLoading}
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        className={`mr-2 ${
                          comment.likes.includes(user?.id ?? "")
                            ? "text-[#861F41]"
                            : "text-gray-400"
                        }`}
                      />
                      {comment.likes.length}
                    </button>
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}
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
