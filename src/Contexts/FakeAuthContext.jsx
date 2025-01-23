import PropTypes from "prop-types";
import { createContext, useContext, useReducer, useEffect } from "react";
const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    default:
      throw new Error("Unknown action");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch({ type: "login", payload: { token } }); // Storing token as user info
    }
  }, []);

  function login(token) {
    if (token) {
      localStorage.setItem("token", token); // Store token in localStorage
      dispatch({ type: "login", payload: { token } });
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    dispatch({ type: "logout" });
  }
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
