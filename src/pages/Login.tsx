import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import axios from "axios";
export default function Login(){
    const [email, setEmail] = useState("yanismarinafaquir@gmail.com"); 
    const [password, setPassword] = useState("Ubiwhere123"); 
    const [error, setError] = useState(""); 
    const navigate = useNavigate(); 
    const setTokens = useAuthStore((state) => state.setTokens); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        try{
            const response = await axios.post("/api/token", {
                email, 
                password
            }); 

            console.log("✅ Login bem-sucedido:");
            console.log("Resposta completa:", response);
            console.log("Access Token:", response.data.access_token);
            console.log("Refresh Token:", response.data.refresh_token);

            const { access_token, refresh_token } = response.data;
            setTokens(access_token, refresh_token);
            navigate("/dashboard"); 
            console.log(response);
        } catch (err) {
            setError("Falha no login. Verifique as credenciais.")
        }
       
    }; 
    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-white rounded shadow-md">
          <h1 className="text-xl font-bold">Login</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Entrar
          </button>
          
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    )
}