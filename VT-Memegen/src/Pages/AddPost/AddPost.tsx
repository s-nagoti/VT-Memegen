// CreatePost.tsx
import React, { useState } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import './AddPost.css'; // Add some CSS for styling

const imageTemplates = [
  'path/to/image1.jpg',
  'path/to/image2.jpg',
  'path/to/image3.jpg',
  'path/to/image4.jpg',
  'path/to/image5.jpg',
];

const AddPost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddPost = async () => {
    if (!selectedImage) {
      setMessage('Please select an image.');
      return;
    }

    setLoading(true);
    try {
      // Add a new document to the posts collection
      const docRef = await addDoc(collection(db, 'posts'), {
        title,
        description,
        imageUrl: selectedImage,
      });

      // Update the document to include the generated ID
      await updateDoc(doc(db, 'posts', docRef.id), { id: docRef.id });

      setMessage(`Post created with ID: ${docRef.id}`);
    } catch (error) {
      console.error('Error adding post: ', error);
      setMessage('Error adding post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create a New Post</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="image-selection">
        <h3>Select an Image Template:</h3>
        <div className="image-templates">
          {imageTemplates.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Template ${index + 1}`}
              className={`template-image ${selectedImage === image ? 'selected' : ''}`}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
      </div>
      <button onClick={handleAddPost} disabled={loading}>
        {loading ? 'Creating...' : 'Create Post'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddPost;
