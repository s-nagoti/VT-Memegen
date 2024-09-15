// src/components/Profile.tsx
import React, { useEffect, useState } from 'react';
import { useUser } from '../../Contexts/UserContext';
import { collection, getDocs, query, where, deleteDoc, doc , writeBatch, } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { Post } from '../../Models/Post';
import { FaThumbsUp, FaTrash, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { signOut, deleteUser } from 'firebase/auth';
import Header from '../../Components/Header/Header';

const ProfilePage: React.FC = () => {
  const { user, setUser } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchUserPosts = async () => {
      try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('userId', '==', user.id));
        const querySnapshot = await getDocs(q);
        const userPosts: Post[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          userPosts.push({
            id: data.id,
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl,
            texts: data.texts,
            upvotes: data.upvotes || 0,
            downvotes: data.downvotes || 0,
            createdAt: data.createdAt,
            authorId: data.authorId,
          });
        });
        setPosts(userPosts);
      } catch (err) {
        console.error('Error fetching user posts:', err);
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/login'); // Redirect to login page
    } catch (err) {
      console.error('Error logging out:', err);
      setError('Failed to log out.');
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (!confirmDelete) return;

    try {
      // Delete user documents (e.g., posts)
      const userPostsRef = collection(db, 'posts');
      const q = query(userPostsRef, where('userId', '==', user.id));
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);

      querySnapshot.forEach((docSnap) => {
        batch.delete(doc(db, 'posts', docSnap.id));
      });

      await batch.commit();

      // Delete user authentication
      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteUser(currentUser);
      }

      setUser(null);
      navigate('/signup'); // Redirect to signup or home page
    } catch (err: any) {
      console.error('Error deleting account:', err);
      setError(err.message || 'Failed to delete account.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">No user is logged in.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">

        <Header
            onHomeClick={() => navigate('/')}
        />

      {/* User Information */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6 bg-white shadow-md rounded-lg p-6">
        {/* Profile Picture */}
        {/* <img
          src={user.profilePictureUrl}
          alt={`${user.name}'s profile`}
          className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0"
        /> */}

        {/* User Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
          <p className="text-gray-600 mb-4">{user.email}</p>
          <div className="flex space-x-4">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
            >
              <FaSignOutAlt className="mr-2" />
              Log Out
            </button>
            {/* Delete Account Button */}
            <button
              onClick={handleDeleteAccount}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
            >
              <FaTrash className="mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      {/* User's Posts */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Your Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">You have not created any posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.description}</p>
                  <div className="flex items-center">
                    <FaThumbsUp className="text-blue-500 mr-2" />
                    <span>{post.upvotes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
