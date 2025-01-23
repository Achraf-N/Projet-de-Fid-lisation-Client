import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoute = ({ element: Component, ...rest }) => {
  const userId = parseInt(localStorage.getItem("userId"), 10); // Parse userId as an integer

  // Redirect to login if not authenticated or not admin (userId !== 1)
  if (userId !== 1) return <Navigate to="/*" />;

  // Render the component if the user is an admin
  return <Component {...rest} />;
};

PrivateRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
};

export default PrivateRoute;
