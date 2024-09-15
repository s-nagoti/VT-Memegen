// src/components/AddPost.tsx

import React, { useState, useRef } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { db, storage } from "../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imageTemplates, ImageTemplate } from "../../Utility/imageTemplates";
import html2canvas from "html2canvas";
import Header from "../../Components/Header/Header";
import { useAuth } from "../../Contexts/AuthContext";
import { useUser } from "../../Contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import axios from "axios";

const AddPost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<
    number | null
  >(null);
  const [textInputs, setTextInputs] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [createdPostId, setCreatedPostId] = useState<string | null>(null);

  const [textColors, setTextColors] = useState<{ [key: string]: string }>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // New state for tags

  const { currentUser } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const previewRef = useRef<HTMLDivElement>(null);

  const tags = ["Dorms", "Classes", "Dining Halls", "Night Life", "Sports"]; // Tag options

  // Handle text input changes
  const handleTextChange = (key: string, value: string) => {
    setTextInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleColorChange = (key: string, color: string) => {
    setTextColors((prevColors) => ({
      ...prevColors,
      [key]: color,
    }));
    console.log("Updated Colors:", textColors);
  };

  // Handle form submission
  const handleAddPost = async () => {
    // Reset messages
    setMessage(null);

    if (!title.trim()) {
      setMessage({ type: "error", text: "Title is required." });
      return;
    }

    if (!description.trim()) {
      setMessage({ type: "error", text: "Description is required." });
      return;
    }

    if (selectedTemplateIndex === null) {
      setMessage({ type: "error", text: "Please select an image template." });
      return;
    }

    const selectedTemplate: ImageTemplate =
      imageTemplates[selectedTemplateIndex];
    const { src: imageUrl, textAreas } = selectedTemplate;

    // Validate text inputs
    for (let area of textAreas) {
      if (!textInputs[area.key]?.trim()) {
        setMessage({
          type: "error",
          text: `Please enter text for "${area.placeholder}".`,
        });
        return;
      }
    }

    setLoading(true);
    try {
      // Generate the final image with text overlays
      if (previewRef.current) {
        const canvas = await html2canvas(previewRef.current, { useCORS: true });
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/jpeg")
        );
        if (!blob) throw new Error("Failed to generate image");


        // Add a new document to Firestore
        const docRef = await addDoc(collection(db, "posts"), {
          title: title.trim(),
          description: description.trim(),
          texts: textInputs, // Store the custom texts
          createdAt: new Date(),
          authorId: user?.id ?? "",
          upvotes: [],
          categories: selectedTags,
        });

         // Upload the image to Firebase Storage
         const storageRef = ref(
            storage,
            `posts/${docRef.id}.jpg`
          );
          await uploadBytes(storageRef, blob);
          const finalImageUrl = await getDownloadURL(storageRef);

        // Update the document to include the generated ID
        await updateDoc(doc(db, "posts", docRef.id), { id: docRef.id, imageUrl: finalImageUrl, 
        });
        

        // Update user's posts array
        if (user?.id) {
          await updateDoc(doc(db, "users", user.id), {
            posts: arrayUnion(docRef.id),
          });
        }

        setMessage({ type: "success", text: "Post created successfully!" });
        setCreatedPostId(docRef.id);

        // Reset form
        setTitle("");
        setDescription("");
        setSelectedTemplateIndex(null);
        setTextInputs({});
      }
    } catch (error: any) {
      console.error("Error adding post: ", error);
      setMessage({
        type: "error",
        text: "Error adding post. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTagChange = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleGoToPost = () => {
    if (createdPostId) {
      navigate(`/posts/${createdPostId}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        email={currentUser?.email ?? "unknown"}
        onHomeClick={() => navigate("/")}
        showHome={true}
        showProfile={true}
      />

      {/* Main Content */}
      <div className="flex-grow container mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Create a New Post
          </h2>

          {/* Feedback Messages */}
          {message && (
            <div
              className={`flex items-center mb-6 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.type === "success" ? (
                <FaCheckCircle className="w-6 h-6 mr-2" />
              ) : (
                <FaExclamationCircle className="w-6 h-6 mr-2" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Title Input */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 mb-2 font-medium"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Description Input */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-gray-700 mb-2 font-medium"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter post description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              rows={4}
            />
          </div>

          {/* Tag Selection */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Select Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <label key={tag} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagChange(tag)}
                    className="mr-2"
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>

          {/* Image Template Selection */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">
              Select an Image Template
            </h3>
            <div className="flex space-x-4 overflow-x-auto">
              {imageTemplates.map((template, index) => (
                <img
                  key={index}
                  src={template.src}
                  alt={template.alt}
                  className={`w-32 h-32 object-cover rounded-lg cursor-pointer border-4 ${
                    selectedTemplateIndex === index
                      ? "border-blue-500"
                      : "border-transparent"
                  } hover:border-blue-300`}
                  onClick={() => setSelectedTemplateIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Selected Template Preview and Text Inputs */}
          {selectedTemplateIndex !== null && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Customize Your Template
              </h3>
              <div className="flex flex-col md:flex-row md:space-x-6">
                {/* Image Preview */}
                <div className="md:w-2/3 flex justify-center mb-6 md:mb-0">
                  <div className="relative" ref={previewRef}>
                    <img
                      src={imageTemplates[selectedTemplateIndex].src}
                      alt="Selected Template"
                      className="w-full h-full rounded-lg shadow-lg"
                    />
                    {/* Overlay Texts */}
                    {imageTemplates[selectedTemplateIndex].textAreas.map(
                      (area) => (
                        <span
                          key={area.key}
                          className="absolute text-white font-bold text-center px-2"
                          style={{
                            top: area.position.top,
                            left: area.position.left,
                            transform: "translate(-50%, -50%)",
                            width: "90%", // Adjust as needed
                            maxWidth: "150px", // Set maximum width for the text box
                            whiteSpace: "pre-wrap", // Allow text to wrap
                            lineHeight: "1.2",
                            color: textColors[area.key] || "#ffffff",
                          }}
                        >
                          {textInputs[area.key] || ""}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Text Inputs */}
                <div className="md:w-1/2">
                  {imageTemplates[selectedTemplateIndex].textAreas.map(
                    (area) => (
                      <div key={area.key} className="mb-4">
                        <label
                          htmlFor={area.key}
                          className="block text-gray-700 mb-2 font-medium"
                        >
                          {area.placeholder}
                        </label>
                        <input
                          id={area.key}
                          type="text"
                          placeholder={`Enter ${area.placeholder}`}
                          value={textInputs[area.key] || ""}
                          onChange={(e) =>
                            handleTextChange(area.key, e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        {/* Color Picker */}
                        <div className="mt-2 flex items-center">
                          <label className="text-gray-700 mr-2">
                            Text Color:
                          </label>
                          <input
                            type="color"
                            value={textColors[area.key] || "#ffffff"}
                            onChange={(e) =>
                              handleColorChange(area.key, e.target.value)
                            }
                            className="w-10 h-10 p-1 border border-gray-300 rounded-full cursor-pointer"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleAddPost}
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-lg transition duration-200 ${
              loading
                ? "bg-blue-400 cursor-not-allowed flex items-center justify-center"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Creating Post...
              </>
            ) : (
              "Create Post"
            )}
          </button>

          {/* Success Button to Navigate to Post */}
          {createdPostId && (
            <button
              onClick={handleGoToPost}
              className="mt-4 w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center"
            >
              View Your Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPost;
