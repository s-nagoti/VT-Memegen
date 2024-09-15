import { useState } from "react";

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
  showProfile
}: HeaderProps) => {
  // Extract the username from the email
  const username = email ? email.split("@")[0] : "Profile";

  // State for mobile menu toggle (optional)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-charcoal shadow-md"> {/* Updated to bg-charcoal */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo or Brand Name */}
        <button onClick={onHomeClick}>
          <div className="text-2xl font-bold text-maroon">{title}</div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {/* Home Button */}
          {showHome &&
          <button
            className="px-4 py-2 font-medium text-white hover:text-accentRed transition-colors duration-200 rounded"
            onClick={onHomeClick}
          >
            Home
          </button>}

          {/* Profile Button */}
          {showProfile &&
          <div className="relative">
            <button
              className="px-4 py-2 font-medium text-white hover:text-accentRed transition-colors duration-200 rounded inline-flex items-center"
              onClick={onProfileClick}
            >
              {username}
            </button>
          </div>}

          {/* Create Post Button */}
          {showCreatePost && (
            <button
              className="px-4 py-2 font-medium text-white bg-maroon hover:bg-maroonLight transition-colors duration-200 rounded"
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
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-charcoal px-4 pb-4"> {/* Updated to bg-charcoal */}
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
            </button>

            {/* Create Post Button */}
            {showCreatePost && (
              <button
                className="w-full text-left px-4 py-2 font-medium text-white bg-maroon hover:bg-maroonLight transition-colors duration-200 rounded"
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
