import axios from "axios";

const LoginFunction = async (password) => {
  try {
    const response = await axios.post("http://localhost:5296/user/auth", {
      password,
    });

    console.log(response.data);

    // Save the token to local storage or state
    const token = response.data;
    localStorage.setItem("token", token);

    // Decode the token to extract user info
  } catch (error) {
    if (error.response) {
      console.error("Login failed:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
};

export default LoginFunction;
