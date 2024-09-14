// PostDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

interface Post {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
}

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        try {
          const docRef = doc(db, 'posts', postId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setPost({ id: docSnap.id, ...docSnap.data() } as Post);
          } else {
            console.error('No such document!');
          }
        } catch (error) {
          console.error('Error fetching post: ', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return <div>Loading post...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="post-detail">
      <h2>{post.title}</h2>
      <img src={post.imageUrl} alt={post.title} className="post-image" />
      <p>{post.description}</p>
    </div>
  );
};

export default PostDetailPage;
