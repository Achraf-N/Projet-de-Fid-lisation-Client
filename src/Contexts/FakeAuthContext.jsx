import PropTypes from "prop-types";
import { createContext, useContext, useReducer, useEffect } from "react";
import { initialState, reducer } from "./authReducer";
const AuthContext = createContext();

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
