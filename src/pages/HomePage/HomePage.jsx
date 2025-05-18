import React, { useState } from "react";
import SideBar from "../../components/Sidebar/SideBar";
import Header from "../../components/Header/Header";
import ScreenPage from "../../components/ScreenPage/ScreenPage";

function HomePage() {
  // Mobilde sidebar'ı açıp kapamak için state
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(window.matchMedia('(max-width: 800px)').matches);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: "rgba(31, 31, 31, 1)" }}>
      <Header broken={broken} toggled={toggled} setToggled={setToggled} />
      <div style={{ display: 'flex', flex: 1 }}>
        <SideBar broken={broken} toggled={toggled} setToggled={setToggled} setBroken={setBroken} />
        <ScreenPage/>
      </div>
    </div>
  );
}

export default HomePage;
