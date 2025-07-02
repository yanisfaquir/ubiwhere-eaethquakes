import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import styles from "../styles/Login.module.css"; 

export default function Login() {
  // const [email, setEmail] = useState("yanismarinafaquir@gmail.com");
  // const [password, setPassword] = useState("Ubiwhere123");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setTokens = useAuthStore((state) => state.setTokens);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/token", { email, password });
      const { access_token, refresh_token } = response.data;
      setTokens(access_token, refresh_token);
      localStorage.setItem("token", access_token);
      navigate("/dashboard");
      console.log(response.data)
    } catch (err) {
      setError("Falha no login. Verifique as credenciais.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Lado esquerdo */}
      <div className={styles.leftPanel}>
        <div className={styles.logoArea}>
          <img src="/ubiwhere_logo.jpg" alt="Ubiwhere" className={styles.logoImage} />
          <div className={styles.logoLine} />
        </div>
        <div className={styles.title}>Frontend</div>
        <div className={styles.subtitle}>Recruitment Exercise</div>
        <div className={styles.recipientLabel}>Recipient:</div>
        <div className={styles.recipientName}>Yanis Marina Faquir</div>
      </div>

     {/* Lado direito */}
      <div className={styles.rightPanel}>
        <div className={styles.rightTitle}>Earthquake Events Platform</div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formTitle}>Login</h2>

          <div className={styles.inputGroup}>
            <MdAlternateEmail color="#1c57fd" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <FaFingerprint color="#1c57fd" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
            {showPassword ? (
              <FaRegEyeSlash
                color="#1c57fd"
                onClick={() => setShowPassword(false)}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <FaRegEye
                color="#1c57fd"
                onClick={() => setShowPassword(true)}
                style={{ cursor: "pointer" }}
              />
            )}
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
