import Sidebar from "../Components/Sidebar";
import styles from "./AppLayout.module.css";
import User from "../components/User";
function AppLayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <User />
    </div>
  );
}

export default AppLayout;