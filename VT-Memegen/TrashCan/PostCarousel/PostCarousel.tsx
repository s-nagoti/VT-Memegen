// PostCarousel.tsx
import React from 'react';
import Slider from 'react-slick';
import './PostCarousel.css'; // Import custom CSS for additional styling


interface Post {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
}

interface PostCarouselProps {
  posts: Post[];
}

const PostCarousel: React.FC<PostCarouselProps> = ({ posts }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {posts.map((post) => (
          <div key={post.id} className="carousel-slide">
            <img src={post.imageUrl} alt={post.title} className="carousel-image" />
            <div className="carousel-content">
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PostCarousel;
