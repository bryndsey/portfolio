import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Group, Vector3 } from "three";
import { GLTF } from "three-stdlib";
import * as THREE from "three";
import { normalizedMousePosition } from "@/components/MousePosition";
import Avatar from "./avatar.glb?url";

type GLTFResult = GLTF & {
  nodes: {
    Body: THREE.Mesh;
    PantsLegs: THREE.Mesh;
    Shoes_1: THREE.Mesh;
    Shoes_2: THREE.Mesh;
    PantsTop: THREE.Mesh;
    Arms_Down: THREE.Mesh;
    Sleeves_Down: THREE.Mesh;
    Ears: THREE.Mesh;
    Eyebrows: THREE.Mesh;
    Eyes: THREE.Mesh;
    Hair_Parted: THREE.Mesh;
    Head: THREE.Mesh;
    Nose: THREE.Mesh;
  };
  materials: {
    Shirt: THREE.MeshStandardMaterial;
    Pants: THREE.MeshStandardMaterial;
    Shoes_main: THREE.MeshStandardMaterial;
    Shoes_bottom: THREE.MeshStandardMaterial;
    skin: THREE.MeshStandardMaterial;
    hair: THREE.MeshStandardMaterial;
    eye: THREE.MeshStandardMaterial;
    nose: THREE.MeshStandardMaterial;
  };
};

const lastTargetVector = new Vector3();
const targetVector = new Vector3();
export function AvatarModel(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(Avatar) as GLTFResult;
  const headGroup = useRef<Group | null>(null);

  useFrame((state) => {
    if (headGroup.current === null) return;

    let lerpFactor = 0.1;
    if (normalizedMousePosition === null) {
      targetVector.set(0, 0, 0);
      targetVector.unproject(state.camera);
      lerpFactor = 0.025;
    } else {
      targetVector.set(
        normalizedMousePosition.x,
        normalizedMousePosition.y,
        0.9
      );
      targetVector.unproject(state.camera);
      targetVector.y -= 0.13;
    }

    const actualLookVector = lastTargetVector.lerp(targetVector, lerpFactor);
    headGroup.current.lookAt(actualLookVector);
  });

  return (
    <Suspense fallback={null}>
      <group {...props} dispose={null}>
        <group position={[0, 0.38, 0]} ref={headGroup}>
          <mesh geometry={nodes.Ears.geometry} material={materials.skin} />
          <mesh
            geometry={nodes.Eyebrows.geometry}
            material={materials.hair}
            rotation={[Math.PI / 2, 0, 0]}
          />
          <mesh
            geometry={nodes.Eyes.geometry}
            material={materials.eye}
            position={[0, 0.13, 0]}
          />
          <mesh geometry={nodes.Nose.geometry} material={materials.nose} />
          <mesh
            geometry={nodes.Hair_Parted.geometry}
            material={materials.hair}
          />
          <mesh geometry={nodes.Head.geometry} material={materials.skin} />
        </group>
        <mesh geometry={nodes.PantsLegs.geometry} material={materials.Pants} />
        <mesh
          geometry={nodes.Shoes_1.geometry}
          material={materials.Shoes_main}
        />
        <mesh
          geometry={nodes.Shoes_2.geometry}
          material={materials.Shoes_bottom}
        />
        <mesh geometry={nodes.PantsTop.geometry} material={materials.Pants} />
        <mesh geometry={nodes.Body.geometry} material={materials.Shirt} />
        <mesh
          geometry={nodes.Sleeves_Down.geometry}
          material={materials.Shirt}
        />
        <mesh geometry={nodes.Arms_Down.geometry} material={materials.skin} />
      </group>
    </Suspense>
  );
}

useGLTF.preload(Avatar);
