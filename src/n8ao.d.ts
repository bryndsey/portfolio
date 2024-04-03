declare module "n8ao" {
  export class N8AOPostPass {
    constructor(scene: THREE.Scene, camera: THREE.Camera);
    configuration: {
      aoRadius: number;
      distanceFalloff: number;
      intensity: number;
      halfRes: boolean;
      depthAwareUpsampling: boolean;
    };
    setQualityMode(
      mode: "Performance" | "Low" | "Medium" | "High" | "Ultra"
    ): void;
  }
}
