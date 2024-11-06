import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { useState } from "react";
import Scraper from "./components/webScrap";
import "./index.css";
function App() {
  // fetchAudio
  // const [audio, setAudio] = useState(null); // Declare state for audio

  //
  return (
    <>
      {/* <Scraper /> */}
      <Loader />
      <Leva hidden />
      <UI />
      <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
