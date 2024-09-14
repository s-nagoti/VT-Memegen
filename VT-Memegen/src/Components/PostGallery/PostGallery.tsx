// PostGallery.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Import the Firestore database
import { useNavigate } from 'react-router-dom';
import './PostGallery.css'; // Import custom CSS for styling

interface Post {
  id: string; // Firestore document ID
  imageUrl: string;
  title: string;
  description: string;
}

const PostGallery: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handlePostClick = async (postId: string) => {
    navigate(`/posts/${postId}`);
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const fetchedPosts: Post[] = [];
        querySnapshot.forEach((doc) => {
          fetchedPosts.push({ id: doc.id, ...doc.data() } as Post);
        });
        setPosts(fetchedPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts: ', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div className="gallery-container">
      {posts.map((post) => (
        <button onClick={() => handlePostClick(post.id)} key={post.id} className="gallery-item">
          <img src={post.imageUrl} alt={post.title} className="gallery-image" />
          <div className="gallery-content">
            <h3>{post.title}</h3>
            <p>{post.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default PostGallery;
