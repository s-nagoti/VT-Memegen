// src/components/PostGallery.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, getCountFromServer } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown, FaComments } from 'react-icons/fa';
import { Post } from '../../Models/Post';

const PostGallery: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handlePostClick = (postId: string) => {
    navigate(`/posts/${postId}`);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(db, 'posts');
        const querySnapshot = await getDocs(postsCollection);
        const fetchedPosts: Post[] = [];

        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data();
          const postId = docSnap.id;

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
            commentsCount,
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
      <div className="flex justify-center items-center h-screen bg-darkGrey text-white">
        <p className="text-xl font-semibold">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-darkGrey min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-maroon">Post Gallery</h2>
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
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
                <p className="text-gray-400 mb-4">{post.description}</p>
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
                      className="flex items-center text-maroon hover:text-maroon-light transition-colors duration-200"
                      aria-label="Downvote"
                    >
                      <FaThumbsDown className="mr-1" />
                      <span>{post.downvotes.length}</span>
                    </button>
                    {/* Comments */}
                    <div className="flex items-center text-gray-300">
                      <FaComments className="mr-1" />
                      <span>{post.commentsCount}</span>
                    </div>
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
