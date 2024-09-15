import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import App from "../App/App";
import Register from "../../Pages/Register/Register";
import Login from "../../Pages/Login/Login";
import Logout from "../../Pages/Logout/Logout";
import EmailConfirmation from "../../Pages/EmailConfirmation/EmailConfirmation";
import AddPost from "../../Pages/AddPost/AddPost";
import PostDetailPage from "../../Pages/PostDetailPage/PostDetailPage";
import ProfilePage from "../../Pages/ProfilePage/ProfilePage";
import { useAuth } from '../../Contexts/AuthContext';
import { UserProvider } from '../../Contexts/UserContext';
function AuthWrapper() {
  
    const { currentUser} = useAuth();
  
    return (
        <UserProvider>
      <Routes>
        {currentUser ? (
            currentUser.emailVerified ? (
                <Route path="/*" element={<App />} />
            ) : (
                <Route path="/*" element={<Navigate to="/email-confirmation" replace />} />
            )
        ) : (
          <Route path="/*" element={<Navigate to="/login" replace />} />
        )}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        {currentUser?.emailVerified ? (
          <Route path="/*" element={<App />} />
        ) : (
          <Route path="/email-confirmation" element={<EmailConfirmation/>} />
        )}
        <Route path="/add-post" element={<AddPost />} />
        <Route path="/posts/:postId" element={<PostDetailPage />} />
        <Route path="/profile-page" element={<ProfilePage />} />
      </Routes>
      </UserProvider>
    );
  }

  export default AuthWrapper
  