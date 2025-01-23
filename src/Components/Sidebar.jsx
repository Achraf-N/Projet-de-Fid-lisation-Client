import styles from "./Sidebar.module.css";
import Logo from "./Logo";
import AppNav from "./AppNav";
import { Outlet } from "react-router-dom";
import Weather from "../Pages/Weather";
function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />

      <Outlet />
      <Weather />
      <footer className={styles.footer}>
        &copy; Copyright {new Date().getFullYear()} by WorldWise Inc
      </footer>
    </div>
  );
}

export default Sidebar;
