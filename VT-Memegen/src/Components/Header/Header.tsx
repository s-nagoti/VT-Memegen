// src/components/Header.tsx
import React, { useState } from 'react';


interface HeaderProps {
  title?: string;
  email?: string;
  onHomeClick?: () => void;
  onProfileClick?: () => void;
  onCreatePostClick?: () => void;
  showCreatePost?: boolean;
  showHome?: boolean;
  showProfile?: boolean;
}

const Header = ({
  title = "VT Memegen", // Default title
  email,
  onHomeClick,
  onProfileClick,
  onCreatePostClick,
  showCreatePost,
  showHome,
  showProfile,
}: HeaderProps) => {
  // Extract the username from the email
  const username = email ? email.split("@")[0] : "Profile";

  // State for mobile menu toggle (optional)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (

    <header className="flex justify-between items-center p-5 bg-gray-100 shadow-md">
      <div className="text-2xl font-bold">{title}</div>
      <div className="flex items-center gap-4">
        {showHome &&
        <button
          className="px-4 py-2 font-medium hover:bg-gray-200 rounded"
          onClick={onHomeClick}
        >
          Home
        </button>
        }

        {showProfile &&
        <div className="relative">
          <button
            className="px-4 py-2 font-medium text-white hover:text-accentRed transition-colors duration-200 rounded"
            onClick={onHomeClick}
          >
            Home
          </button>

          {/* Profile Button */}
          <div className="relative">
            <button
              className="px-4 py-2 font-medium text-white hover:text-accentRed transition-colors duration-200 rounded inline-flex items-center"
              onClick={onProfileClick}
            >
              {username}
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            {/* Optional Dropdown Menu */}
            {/* 
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-20">
              <button className="block px-4 py-2 text-sm text-white hover:bg-maroon">Profile</button>
              <button className="block px-4 py-2 text-sm text-white hover:bg-maroon">Settings</button>
              <button className="block px-4 py-2 text-sm text-white hover:bg-maroon">Logout</button>
            </div>
            */}
          </div>

          {/* Create Post Button */}
          {showCreatePost && (
            <button
              className="px-4 py-2 font-medium text-white bg-maroon hover:bg-maroonDark transition-colors duration-200 rounded"
              onClick={onCreatePostClick}
            >
              Create Post
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-accentRed focus:outline-none focus:ring-2 focus:ring-accentRed rounded"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              // Close Icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger Icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        }

        {showCreatePost && (
          <button
            className="px-4 py-2 font-medium text-white bg-red-600 hover:bg-red-700 rounded"
            onClick={onCreatePostClick}
          >
            Create Post
          </button>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-darkGrey px-4 pb-4">
          <div className="flex flex-col items-start gap-2">
            {/* Home Button */}
            <button
              className="w-full text-left px-4 py-2 font-medium text-white hover:text-accentRed transition-colors duration-200 rounded"
              onClick={() => {
                onHomeClick && onHomeClick();
                setIsMobileMenuOpen(false);
              }}
            >
              Home
            </button>

            {/* Profile Button */}
            <button
              className="w-full text-left px-4 py-2 font-medium text-white hover:text-accentRed transition-colors duration-200 rounded inline-flex items-center"
              onClick={() => {
                onProfileClick && onProfileClick();
                setIsMobileMenuOpen(false);
              }}
            >
              {username}
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            {/* Create Post Button */}
            {showCreatePost && (
              <button
                className="w-full text-left px-4 py-2 font-medium text-white bg-maroon hover:bg-maroonDark transition-colors duration-200 rounded"
                onClick={() => {
                  onCreatePostClick && onCreatePostClick();
                  setIsMobileMenuOpen(false);
                }}
              >
                Create Post
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
