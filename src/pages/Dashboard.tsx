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
    console.log("accessToken:", localStorage.getItem("access_token")); // deve ser null
    console.log("refreshToken:", localStorage.getItem("refresh_token")); // deve ser null

    
    navigate("/login");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <Map />
      </div>
      
    </div>
  );
}
