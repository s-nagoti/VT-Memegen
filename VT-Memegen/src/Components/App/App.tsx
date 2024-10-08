import { useAuth } from '../../Contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Header from '../Header/Header'
import PostGallery from '../PostGallery/PostGallery'
import './App.css'

function App() {


  const handleHomeClick = () => {
    navigate('/')
  };

  const handleProfileClick = () => {
    navigate('/profile-page')
    // Navigate or perform other actions
  };

  const handleCreatePostClick = () => {
    navigate('/add-post')
    // Navigate or perform other actions
  };


  const { currentUser } = useAuth()
  const navigate = useNavigate()

  return (
    <div>
      <Header   
        title="VT Memegen"
        email={currentUser?.email ?? "unknown"}
        onHomeClick={handleHomeClick}
        onProfileClick={handleProfileClick}
        onCreatePostClick={handleCreatePostClick}
        showCreatePost={true}
        showProfile={true}
        />
        <PostGallery />
    </div>
  )
}

export default App
