import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";

export default function Dashboard() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("🔴 Logout iniciado...");
    logout();
    console.log("✅ Tokens removidos do Zustand e localStorage:");
    console.log("accessToken:", localStorage.getItem("access_token"));
    console.log("refreshToken:", localStorage.getItem("refresh_token"));
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Botão logout flutuante */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* O mapa vai estar centrado numa janela */}
      <Map />
    </div>
  );
}
