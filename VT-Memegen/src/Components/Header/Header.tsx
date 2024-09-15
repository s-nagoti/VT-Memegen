// Header.tsx
import React from 'react';

interface HeaderProps {
  title?: string;
  email?: string;
  onHomeClick?: () => void;
  onProfileClick?: () => void;
  onCreatePostClick?: () => void;

  //categories
  onHousingClick?: () => void;
  onClassesClick?: () => void;
  onDiningClick?: () => void;
  onNightLifeClick?: () => void;
  onSportsClick?: () => void;

  showCreatePost?: boolean;
}

const Header = ({
  title = 'VT MemeGen', // Default title
  email,
  onHomeClick,
  onProfileClick,
  onCreatePostClick,
  showCreatePost,
}: HeaderProps) => {
  // Extract the username from the email
  const username = email ? email.split('@')[0] : 'Profile';

  return (
    <header className="flex justify-between items-center p-5 bg-gray-100 shadow-md">
      <div className="text-2xl text-[#800000] font-bold ">{title}</div>
      <div className="flex items-center gap-4">
        <button
          className="px-4 py-2 font-medium hover:bg-gray-200 rounded"
          onClick={onHomeClick}
        >
          Home
        </button>

        <div className="relative">
          <button
            className="px-4 py-2 font-medium hover:bg-gray-200 rounded inline-flex items-center"
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
        </div>
        {showCreatePost &&
          <button
            className="px-4 py-2 font-medium text-white bg-orange-600 hover:bg-orange-700 rounded"
            onClick={onCreatePostClick}
          >
            Create Post
          </button>
        }

      </div>
    </header>
  );
};

export default Header;
