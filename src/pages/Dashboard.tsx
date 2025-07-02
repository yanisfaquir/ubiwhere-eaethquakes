import Map from "../components/Map";
import Navbar from "../components/Navbar";
export default function Dashboard() {

  return (
   <div className="h-screen w-screen bg-white overflow-hidden">
      <Navbar />
      <div style={{ paddingTop: "64px", height: "calc(100vh - 64px)", overflow: "hidden" }}>
        <Map />
      </div>
    </div>
  );
}
