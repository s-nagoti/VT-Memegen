// AddPost.tsx
import React, { useState, useRef } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db, storage } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { imageTemplates, ImageTemplate, TextArea } from '../../Utility/imageTemplates';
import html2canvas from 'html2canvas';
import './AddPost.css'; // Optional: for additional styling
import Header from '../../Components/Header/Header';
import { useAuth } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddPost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(null);
  const [textInputs, setTextInputs] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const {currentUser} = useAuth();
    const navigate = useNavigate();
  const previewRef = useRef<HTMLDivElement>(null);

  // Handle text input changes
  const handleTextChange = (key: string, value: string) => {
    setTextInputs((prev) => ({ ...prev, [key]: value }));
  };

  // Handle form submission
  const handleAddPost = async () => {
    if (selectedTemplateIndex === null) {
      setMessage('Please select an image template.');
      return;
    }

    const selectedTemplate: ImageTemplate = imageTemplates[selectedTemplateIndex];
    const { src: imageUrl, textAreas } = selectedTemplate;

    // Validate text inputs
    for (let area of textAreas) {
      if (!textInputs[area.key]) {
        setMessage(`Please enter text for "${area.placeholder}".`);
        return;
      }
    }

    setLoading(true);
    try {
      // Generate the final image with text overlays
      if (previewRef.current) {
        const canvas = await html2canvas(previewRef.current, { useCORS: true });
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
        if (!blob) throw new Error('Failed to generate image');

        // Upload the image to Firebase Storage
        const storageRef = ref(storage, `posts/${Date.now()}_${selectedTemplateIndex}.jpg`);
        await uploadBytes(storageRef, blob);
        const finalImageUrl = await getDownloadURL(storageRef);

        // Add a new document to Firestore
        const docRef = await addDoc(collection(db, 'posts'), {
          title,
          description,
          imageUrl: finalImageUrl,
          texts: textInputs, // Store the custom texts
          createdAt: new Date(),
        });

        // Update the document to include the generated ID
        await updateDoc(doc(db, 'posts', docRef.id), { id: docRef.id });

        setMessage(`Post created successfully with ID: ${docRef.id}`);

        // Reset form
        setTitle('');
        setDescription('');
        setSelectedTemplateIndex(null);
        setTextInputs({});
      }
    } catch (error) {
      console.error('Error adding post: ', error);
      setMessage('Error adding post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col min-h-screen'>
     <Header
        title="Post Detail"
        email={currentUser?.email ?? "unknown"}
        onHomeClick={() => navigate('/')}
        showCreatePost={false}
     />

    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
   
      <h2 className="text-3xl font-bold mb-6 text-center">Create a New Post</h2>
      
      {/* Title Input */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Title</label>
        <input
          type="text"
          placeholder="Enter post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description Input */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Description</label>
        <textarea
          placeholder="Enter post description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      {/* Image Template Selection */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Select an Image Template</h3>
        <div className="flex space-x-4 overflow-x-auto">
          {imageTemplates.map((template, index) => (
            <img
              key={index}
              src={template.src}
              alt={template.alt}
              className={`w-32 h-32 object-cover rounded-lg cursor-pointer border-4 ${
                selectedTemplateIndex === index ? 'border-blue-500' : 'border-transparent'
              } hover:border-blue-300`}
              onClick={() => setSelectedTemplateIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Selected Template Preview and Text Inputs */}
      {selectedTemplateIndex !== null && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Customize Your Template</h3>
          <div className="flex flex-col md:flex-row md:space-x-6">
            {/* Image Preview */}
            <div className="md:w-1/2 flex justify-center">
              <div className="relative" ref={previewRef}>
                <img
                  src={imageTemplates[selectedTemplateIndex].src}
                  alt="Selected Template"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                {/* Overlay Texts */}
                {imageTemplates[selectedTemplateIndex].textAreas.map((area) => (
                  <span
                    key={area.key}
                    className="absolute text-white font-bold text-center"
                    style={{
                      top: area.position.top,
                      left: area.position.left,
                      transform: 'translate(-50%, -50%)',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                      width: '90%', // Adjust as needed
                    }}
                  >
                    {textInputs[area.key] || ''}
                  </span>
                ))}
              </div>
            </div>

            {/* Text Inputs */}
            <div className="md:w-1/2">
              {imageTemplates[selectedTemplateIndex].textAreas.map((area) => (
                <div key={area.key} className="mb-4">
                  <label className="block text-gray-700 mb-2">{area.placeholder}</label>
                  <input
                    type="text"
                    placeholder={`Enter ${area.placeholder}`}
                    value={textInputs[area.key] || ''}
                    onChange={(e) => handleTextChange(area.key, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleAddPost}
        disabled={loading}
        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50"
      >
        {loading ? 'Creating Post...' : 'Create Post'}
      </button>

      {/* Feedback Message */}
      {message && (
        <p className="mt-4 text-center text-green-500">
          {message}
        </p>
      )}
    </div>
    </div>
  );
}
  export default AddPost
