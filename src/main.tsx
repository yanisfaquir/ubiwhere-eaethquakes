import ReactDOM from "react-dom/client";
import AppRouter from "./routes/AppRouter";
import "./index.css";
import "leaflet/dist/leaflet.css";


ReactDOM.createRoot(document.getElementById("root")!).render(<AppRouter />);