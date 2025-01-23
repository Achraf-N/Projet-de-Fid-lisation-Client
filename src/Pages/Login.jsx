import styles from "./Login.module.css";
import PageNav from "../Components/PageNav";
import { useState, useEffect } from "react";
import styles1 from "../Components/Button.module.css";
import { useAuth } from "../Contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";
import LoginFunction from "../Components/LoginFunction";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [password, setPassword] = useState("qwerty");

  const { login, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await LoginFunction(password);
    const token = localStorage.getItem("token");

    const userResponse = await fetch(`http://192.168.1.115:5296/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!userResponse.ok) {
      throw new Error("Failed to fetch data get product");
    }
    const data = await userResponse.json();

    localStorage.setItem("userId", data);
    // If a token is received, save it to localStorage and redirect
    if (token) {
      if (token) login(token);
    }
  };

  useEffect(
    function () {
      if (isAuthenticated) navigate("/app", { replace: true });
    },
    [isAuthenticated, navigate]
  );

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        {/*
        <div className={styles.row}>
          <label htmlFor="email">Enter Token</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
           */}

        <div className={styles.row}>
          <label htmlFor="password">Enter Token</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <button className={`${styles1.primary} ${styles1.btn}`}>Login</button>
        </div>
      </form>
    </main>
  );
}
