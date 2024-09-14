import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import App from "../App/App";
import Register from "../../Pages/Register/Register";
import Login from "../../Pages/Login/Login";
import Logout from "../../Pages/Logout/Logout";
import EmailConfirmation from "../../Pages/EmailConfirmation/EmailConfirmation";
import { useAuth } from '../../Contexts/AuthContext';

function AuthWrapper() {
  
    const { currentUser, isEmailVerified} = useAuth();
  
    return (
      <Routes>
        {currentUser ? (
          <Route path="/*" element={<App />} />
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
      </Routes>
    );
  }

  export default AuthWrapper
  