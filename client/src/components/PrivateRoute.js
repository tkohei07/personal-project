import { useNavigate } from 'react-router-dom';
import { useUser } from './../UserContext';

const PrivateRoute = ({ children }) => {
  const { loggedIn } = useUser();
  const navigate = useNavigate();

  if (!loggedIn) {
    navigate("/login");
    return null;
  }

  return children;
};

export default PrivateRoute;
