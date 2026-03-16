import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FullPageLoader } from '../shared/UI';
import toast from 'react-hot-toast';

export default function OAuth2RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleOAuthLogin } = useAuth(); // You'll need to add this to AuthContext

  useEffect(() => {
    // Extract the token parameter from the URL query string
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    if (token) {
        // Save the token and grab the user payload
        try {
            handleOAuthLogin(token);
            toast.success("Successfully logged in with Google!");
            // The RootRedirect in App.jsx will automatically handle routing based on role
            navigate('/');
        } catch (error) {
            toast.error("Failed to authenticate with Google");
            navigate('/login');
        }
    } else {
        toast.error("Authentication failed. No token provided.");
        navigate('/login');
    }
  }, [location.search, navigate, handleOAuthLogin]);

  return <FullPageLoader message="Finalizing authentication..." />;
}
