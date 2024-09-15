import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, getCountFromServer } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown, FaComments } from 'react-icons/fa';
import { Post } from '../../Models/Post';

const PostGallery: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const navigate = useNavigate();

  const handlePostClick = (postId: string) => {
    navigate(`/posts/${postId}`);
  };

  const fetchPosts = async () => {
    try {
      const postsCollection = collection(db, 'posts');
      const querySnapshot = await getDocs(postsCollection);
      const fetchedPosts: Post[] = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const postId = docSnap.id;

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
          commentsCount,
          categories: data.categories || [],
        });
      }

      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle tag selection
  const handleTagSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (selectedValue !== 'all' && !selectedTags.includes(selectedValue)) {
      setSelectedTags([...selectedTags, selectedValue]);
    }
  };

  // Remove a tag from the selectedTags array
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  // Clear all tags
  const clearAllTags = () => {
    setSelectedTags([]);
  };

  // Filter posts based on the selected tags
  const filteredPosts = selectedTags.length > 0
    ? posts.filter(post => selectedTags.every(tag => post.categories?.includes(tag)))
    : posts;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#75787B] text-white">
        <p className="text-xl font-semibold">Loading posts...</p>
      </div>
    );
  }

  // List of available tags including 'Show All'
  const uniqueTags = ['Housing', 'Classes', 'Dining', 'Night Life', 'Sports', 'Dorms'];

  return (
    <div className="container mx-auto p-4">
      {/* Tag Filter Dropdown */}
      <div className="flex items-center gap-4 py-6">
        <select
          onChange={handleTagSelection}
          className="px-4 py-3 border rounded text-gray-700 bg-[#D7D2CB]"
          value=""
        >
          <option value="" disabled>Select Filter</option>
          <option value="all">Show All</option>
          {uniqueTags.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        {/* Display selected tags */}
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <div key={tag} className="flex items-center space-x-2 bg-[#861F41] text-white px-2 py-1 rounded-full">
              <span>{tag}</span>
              <button
                className="text-white hover:text-gray-300"
                onClick={() => removeTag(tag)}
              >
                X
              </button>
            </div>
          ))}
        </div>

        {/* Clear all tags button */}
        {selectedTags.length > 0 && (
          <button
            className="px-4 py-2 font-medium text-white bg-[#861F41] hover:bg-opacity-90 rounded"
            onClick={clearAllTags}
          >
            Clear All
          </button>
        )}
      </div>

      {filteredPosts.length === 0 ? (
        <p className="text-center text-white">No posts available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-[#75787B] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
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
                <h3 className="text-xl font-semibold mb-2 text-white">{post.title}</h3>
                <p className="text-white mb-4">{post.description}</p>

                <div className="flex items-center justify-between">
                  {/* Like, Dislike, and Comment Counts */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-white">
                      <FaThumbsUp className="mr-1" />
                      <span>{post.upvotes.length}</span>
                    </div>
                    <div className="flex items-center text-white">
                      <FaThumbsDown className="mr-1" />
                      <span>{post.downvotes.length}</span>
                    </div>
                    <div className="flex items-center text-white">
                      <FaComments className="mr-1" />
                      <span>{post.commentsCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {post.categories?.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-[#861F41] text-white rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
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
