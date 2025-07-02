import styles from "../styles/Navbar.module.css";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <span className={styles.name}>Ubiwhere - Yanis Marina Faquir</span>
      </div>
      <div className={styles.right}>
        
        <button onClick={handleLogout} className={styles.logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
