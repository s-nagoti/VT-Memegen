// src/components/Profile.tsx

import React, { useEffect, useState } from "react";
import { useUser } from "../../Contexts/UserContext";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { Post } from "../../Models/Post";
import { FaThumbsUp, FaTrash, FaSignOutAlt, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { signOut, deleteUser } from "firebase/auth";
import Header from "../../Components/Header/Header";

const ProfilePage: React.FC = () => {
  const { user, setUser } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [totalUpvotes, setTotalUpvotes] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchUserPosts = async () => {
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("authorId", "==", user.id));
        const querySnapshot = await getDocs(q);
        const userPosts: Post[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          userPosts.push({
            id: docSnap.id,
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl,
            texts: data.texts,
            upvotes: data.upvotes || 0,
            downvotes: data.downvotes || 0,
            createdAt: data.createdAt,
            authorId: data.authorId,
            commentsCount: data.commentsCount || 0,
          });
        });
        setPosts(userPosts);
      } catch (err) {
        console.error("Error fetching user posts:", err);
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserLikedPosts = async () => {
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("id", "in", user.likedPosts || []));
        const querySnapshot = await getDocs(q);
        const userPosts: Post[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          userPosts.push({
            id: docSnap.id,
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl,
            texts: data.texts,
            upvotes: data.upvotes || 0,
            downvotes: data.downvotes || 0,
            createdAt: data.createdAt,
            authorId: data.authorId,
            commentsCount: data.commentsCount || 0,
          });
        });
        setLikedPosts(userPosts);
      } catch (err) {
        console.error("Error fetching user posts:", err);
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserUpvotes = async () => {
      try {
        const userPostsRef = collection(db, "posts");
        const q = query(userPostsRef, where("authorId", "==", user.id));
        const querySnapshot = await getDocs(q);
        let total = 0;
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          total += data.upvotes?.length || 0;
        });
        setTotalUpvotes(total);
      } catch (err) {
        console.error("Error fetching user upvotes:", err);
        setError("Failed to load upvotes.");
      }
    };

    fetchUserPosts();
    fetchUserLikedPosts();
    fetchUserUpvotes();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/login"); // Redirect to login page
    } catch (err) {
      console.error("Error logging out:", err);
      setError("Failed to log out.");
    }
  };

  const handleDelete = async (postId: string) => {
    if (!user) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err: any) {
      console.error("Error deleting post:", err);
      setError(err.message || "Failed to delete post.");
  }
};

  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      // Delete user documents (e.g., posts)
      const userPostsRef = collection(db, "posts");
      const q = query(userPostsRef, where("authorId", "==", user.id));
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);

      querySnapshot.forEach((docSnap) => {
        batch.delete(doc(db, "posts", docSnap.id));
      });

      await batch.commit();

      const userRef = collection(db, "users");
      const userQ = query(userRef, where("id", "==", user.id));
      const userQuerySnapshot = await getDocs(userQ);
      const userBatch = writeBatch(db);

      userQuerySnapshot.forEach((docSnap) => {
        userBatch.delete(doc(db, "users", docSnap.id));
      });

      await userBatch.commit();

      // Delete user authentication
      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteUser(currentUser);
      }

      setUser(null);
      navigate("/signup"); // Redirect to signup or home page
    } catch (err: any) {
      console.error("Error deleting account:", err);
      setError(err.message || "Failed to delete account.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p className="text-xl font-semibold text-gray-700">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700">
            No user is logged in.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  interface PostGridProps {
    posts: Post[];
    title: string;
    emptyMessage: string;
    icon: React.ElementType;
    iconColor: string;
  }

  const PostGrid: React.FC<PostGridProps> = ({
    posts,
    title,
    emptyMessage,
    icon: Icon,
    iconColor,
  }) => (
    <div className="flex-1 bg-white p-6 rounded-lg shadow-md border-t-4 border-[#E87722]">
      {" "}
      {/* Burnt Orange border */}
      <h2 className="text-2xl font-bold text-[#861F41] mb-4 flex items-center">
        {" "}
        {/* Chicago Maroon text */}
        <Icon className={`${iconColor} mr-2`} />
        {title}
      </h2>
      {posts.length === 0 ? (
        <p className="text-gray-500">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {posts.map((post) => (
            <button
              onClick={() => {
                navigate(`/posts/${post.id}`);
              }}
            >
              <div
                key={post.id}
                className="flex flex-col sm:flex-row bg-gray-50 rounded-lg shadow-sm overflow-hidden transition duration-300 ease-in-out hover:shadow-md hover:bg-[#F1F1F1]"
              >
                <div className="sm:w-1/3 flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover"
                    src={post.imageUrl || "https://via.placeholder.com/400x200"}
                    alt={post.title}
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#861F41]">
                      {post.title}
                    </h3>{" "}
                    {/* Chicago Maroon text */}
                    <p className="mt-2 text-sm text-gray-600">
                      {post.description}
                    </p>
                  </div>

                  {/* Bottom Aligned Content */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center">
                      <Icon className={`${iconColor} mr-2`} />
                      <span className="text-sm font-medium text-[#E87722]">
                        {" "}
                        {/* Burnt Orange text */}
                        {title === "Your Posts"
                          ? `${post.upvotes.length} upvotes`
                          : "You liked this"}
                      </span>
                    </div>

                    {/* Delete Button */}
                    { post.authorId === user.id &&
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent navigating to post details
                        handleDelete(post.id);
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                    >
                      Delete
                    </button>
      }
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header
        onHomeClick={() => navigate("/")}
        onCreatePostClick={() => navigate("/add-post")}
        showHome={true}
        showCreatePost={true}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Information Section */}
        <section className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border-t-4 border-[#E87722]">
          {" "}
          {/* Burnt Orange border */}
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <div className="h-48 w-full md:w-48 bg-gradient-to-br from-[#861F41] to-[#E87722] flex items-center justify-center">
                {" "}
                {/* VT color gradient */}
                <span className="text-5xl font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase() ?? ""}
                </span>
              </div>
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-extrabold text-[#861F41] sm:text-4xl">
                {user.username}
              </h1>{" "}
              {/* Chicago Maroon text */}
              <p className="mt-2 text-xl text-gray-500">{user.email}</p>
              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#861F41] hover:bg-[#621A36] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#861F41]" // Chicago Maroon button
                >
                  <FaSignOutAlt className="mr-2" />
                  Log Out
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#861F41] bg-[#F1F1F1] hover:bg-[#E1E1E1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#861F41]" // Light background, Chicago Maroon text
                >
                  <FaTrash className="mr-2" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <FaThumbsUp className="text-[#E87722] text-3xl mr-4" />{" "}
              {/* Burnt Orange icon */}
              <div>
                <h2 className="text-lg font-medium text-[#861F41]">
                  Total Upvotes
                </h2>{" "}
                {/* Chicago Maroon text */}
                <p className="mt-1 text-3xl font-semibold text-[#E87722]">
                  {totalUpvotes}
                </p>{" "}
                {/* Burnt Orange text */}
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-8 border-l-4 border-red-400">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User's Posts and Liked Posts side by side with clear separation */}
        <div className="flex flex-col lg:flex-row gap-8">
          <PostGrid
            posts={posts}
            title="Your Posts"
            emptyMessage="You have not created any posts yet."
            icon={FaThumbsUp}
            iconColor="text-[#861F41]" // Chicago Maroon icon
          />
          <PostGrid
            posts={likedPosts}
            title="Liked Posts"
            emptyMessage="You haven't liked any posts yet."
            icon={FaHeart}
            iconColor="text-[#E87722]" // Burnt Orange icon
          />
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
