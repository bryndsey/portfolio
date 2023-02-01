import { Float, RoundedBox } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Euler } from "three";

function App() {
  return (
    <div id="App" style={{ height: "100%" }}>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {/* <Float speed={10}> */}
        <RoundedBox args={[1, 2, 0.1]} rotation={new Euler(-0.2, 0.2, 0.1)}>
          <meshStandardMaterial color="green" />
        </RoundedBox>
        {/* </Float> */}
      </Canvas>
      {/* <h1 style={{ position: "absolute" }}>Hello, World!</h1> */}
    </div>
  );
}

export default App;
