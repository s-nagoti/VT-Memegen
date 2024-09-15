// PostGallery.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, getCountFromServer } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Import the Firestore database
import { useNavigate } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown, FaComments } from 'react-icons/fa'; // Import icons from react-icons
import {Post} from '../../Models/Post'

const PostGallery: React.FC = () => {
  // State to hold the list of posts
  const [posts, setPosts] = useState<Post[]>([]);
  // State to manage the loading state
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /**
   * Handles the click event on a post item.
   * Navigates to the detailed view of the selected post.
   *
   * @param postId - The ID of the selected post
   */
  const handlePostClick = (postId: string) => {
    navigate(`/posts/${postId}`);
  };

  /**
   * Fetches posts from Firestore when the component mounts.
   */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(db, 'posts');
        const querySnapshot = await getDocs(postsCollection);
        const fetchedPosts: Post[] = [];
  
        // Iterate through each post document
        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data();
          const postId = docSnap.id; // Use document ID as post ID
  
          // Fetch comments count using aggregation query
          const commentsCollection = collection(db, 'posts', postId, 'comments');
          const commentsQuery = query(commentsCollection);
          const commentsCountSnapshot = await getCountFromServer(commentsQuery);
          const commentsCount = commentsCountSnapshot.data().count;
  
          fetchedPosts.push({
            id: postId,
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl,
            texts: data.texts,
            upvotes: data.upvotes || [],
            downvotes: data.downvotes || [],
            createdAt: data.createdAt,
            authorId: data.authorId,
            commentsCount, // Add comments count
          });
        }
  
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPosts();
  }, []);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Post Gallery</h2>
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <button
                onClick={() => handlePostClick(post.id)}
                className="w-full h-48 overflow-hidden"
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </button>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Upvote Button */}
                    <button
                      className="flex items-center text-green-500 hover:text-green-600 transition-colors duration-200"
                      aria-label="Upvote"
                    >
                      <FaThumbsUp className="mr-1" />
                      <span>{post.upvotes.length}</span>
                    </button>
                    {/* Downvote Button */}
                    <button
                      className="flex items-center text-red-500 hover:text-red-600 transition-colors duration-200"
                      aria-label="Downvote"
                    >
                      <FaThumbsDown className="mr-1" />
                      <span>{post.downvotes.length}</span>
                    </button>

                    <button
                      className="flex items-center text-red-500 hover:text-red-600 transition-colors duration-200"
                      aria-label="Downvote"
                    >
                      <FaThumbsDown className="mr-1" />
                      <span>{post.commentsCount}</span>
                    </button>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostGallery;
