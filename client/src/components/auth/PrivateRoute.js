import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const PrivateRoute = ({ children }) => {
  const { loggedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
  }, [loggedIn, navigate]);

  if (!loggedIn) {
    return <></>;
  }

  return children;
};

export default PrivateRoute;
