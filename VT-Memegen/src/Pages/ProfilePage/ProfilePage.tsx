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
import { FaThumbsUp, FaTrash, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { signOut, deleteUser } from "firebase/auth";
import Header from "../../Components/Header/Header";

const ProfilePage: React.FC = () => {
  const { user, setUser } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
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
    fetchUserUpvotes();
  }, [user]);

  // Handle user logout
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

  // Handle account deletion
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
          <p className="text-xl font-semibold text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700">No user is logged in.</p>
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header 
      onHomeClick={() => navigate("/")}
      onCreatePostClick={() => navigate("/add-post")}
      showHome={true}
      showCreatePost={true}

       />

      <div className="max-w-7xl mx-auto p-6">
        {/* User Information Section */}
        <div className="bg-white shadow-md rounded-lg p-8 mb-8">
          <div className="flex flex-col items-center md:flex-row md:items-start">
            {/* User Avatar */}
            <div className="mb-6 md:mb-0 md:mr-8">
              <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.username?.charAt(0).toUpperCase() ?? ''}
              </div>
            </div>

            {/* User Details */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-extrabold text-gray-800">{user.username}</h1>
              <p className="text-gray-600 mt-2">{user.email}</p>
              <div className="mt-4 flex flex-col sm:flex-row justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
                >
                  <FaSignOutAlt className="mr-2" />
                  Log Out
                </button>

                {/* Delete Account Button */}
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors duration-200"
                >
                  <FaTrash className="mr-2" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Total Upvotes */}
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
            <FaThumbsUp className="text-blue-500 text-4xl mr-4" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Total Upvotes</h2>
              <p className="text-2xl text-gray-600">{totalUpvotes}</p>
            </div>
          </div>

        
          
         
        </div>
        

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 text-red-700 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {/* User's Posts */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Your Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-500">You have not created any posts yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-50 shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <img
                    src={post.imageUrl || "https://via.placeholder.com/400x200"}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.description}</p>
                    <div className="flex items-center">
                      <FaThumbsUp className="text-blue-500 mr-2" />
                      <span className="text-gray-700">{post.upvotes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
