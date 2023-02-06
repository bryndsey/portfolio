import { PerspectiveCamera, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { types, useControls } from "theatric";
import { Device } from "./Device";
import { Guitar } from "./Guitar";

const deviceStartPosition = { x: -0.5, y: -0.5, z: 0 };
const deviceStartRotation = { x: -0.5 * Math.PI, y: 0, z: 0.66 };
const deviceSize = { width: 0.15, height: 0.3, thickness: 0.02 };
const deviceBezelSize = 64;

const DeviceContainer = () => {
  const { position, rotation, size, bezelSize } = useControls(
    {
      position: {
        x: types.number(deviceStartPosition.x, { nudgeMultiplier: 0.1 }),
        y: types.number(deviceStartPosition.y, { nudgeMultiplier: 0.1 }),
        z: types.number(deviceStartPosition.z, { nudgeMultiplier: 0.1 }),
      },
      rotation: {
        x: types.number(deviceStartRotation.x, { range: [-Math.PI, Math.PI] }),
        y: types.number(deviceStartRotation.y, { range: [-Math.PI, Math.PI] }),
        z: types.number(deviceStartRotation.z, { range: [-Math.PI, Math.PI] }),
      },
      size: {
        width: types.number(deviceSize.width, { nudgeMultiplier: 0.1 }),
        height: types.number(deviceSize.height, { nudgeMultiplier: 0.1 }),
        thickness: types.number(deviceSize.thickness, {
          nudgeMultiplier: 0.01,
        }),
      },
      bezelSize: deviceBezelSize,
    },
    { folder: "device" }
  );

  // const rotation = startRotation;
  // const size = deviceSize;
  // const bezelSize = deviceBezelSize;

  // const groupRef = useRef<Group>(null);

  // const scrollData = useScroll();
  // useFrame(() => {
  //   const deviceGroup = groupRef.current;
  //   if (deviceGroup === null) return;
  //   const scrollRange = scrollData.range(0, 2 / 3);
  //   const currentRotation = {
  //     x: MathUtils.lerp(rotation.x, 0, scrollRange),
  //     y: MathUtils.lerp(rotation.y, 0, scrollRange),
  //     z: MathUtils.lerp(rotation.z, 0, scrollRange),
  //   };
  //   deviceGroup.setRotationFromEuler(
  //     new Euler(currentRotation.x, currentRotation.y, currentRotation.z)
  //   );
  //   deviceGroup.position.setX(MathUtils.lerp(position.x, 0, scrollRange));
  //   deviceGroup.position.setY(MathUtils.lerp(position.y, 0, scrollRange));
  //   deviceGroup.position.setZ(MathUtils.lerp(position.z, 0.5, scrollRange));
  // });

  return (
    <group
      // ref={groupRef}
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      onClick={() => {
        console.log("Clicked group");
      }}
      onPointerMissed={() => console.log("Clicked outside group")}
    >
      <Device {...size} bezelSize={bezelSize} />
    </group>
  );
};

const backgroundColor = "mediumseagreen";

function App() {
  const { cameraPosition } = useControls(
    {
      cameraPosition: { x: 0, y: 0, z: 3 },
    },
    { folder: "scene" }
  );

  return (
    <div id="App" style={{ height: "100%" }}>
      <Canvas style={{ backgroundColor: backgroundColor }}>
        {/* <Stats /> */}
        <PerspectiveCamera
          makeDefault
          position={[cameraPosition.x, cameraPosition.y, cameraPosition.z]}
        />
        <ambientLight intensity={0.5} color={backgroundColor} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <DeviceContainer />
        <Guitar />
      </Canvas>
    </div>
  );
}

export default App;
