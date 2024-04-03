import { getGPUTier } from "detect-gpu";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type GpuType = "mobile" | "desktop";
export type GpuRating = {
  type: GpuType;
  tier: number;
};

const GpuContext = createContext<GpuRating | null | undefined>(undefined);

export const GpuProvider = ({ children }: { children: ReactNode }) => {
  const [gpuSettings, setGpuSettings] = useState<GpuRating | null>(null);

  const fetchGpuInfo = async function getGpuSettings() {
    const gpuTier = await getGPUTier();

    const useFallback =
      gpuTier.device === undefined &&
      gpuTier.gpu?.toLowerCase().includes("apple");
    // Pick reasonable default for fallback
    const tier = useFallback ? 2 : gpuTier.tier;

    const rating: GpuRating = {
      type: gpuTier.isMobile ? "mobile" : "desktop",
      tier,
    };

    setGpuSettings(rating);
  };

  useEffect(() => {
    fetchGpuInfo();
  }, []);

  return (
    <GpuContext.Provider value={gpuSettings}>{children}</GpuContext.Provider>
  );
};

export const useGpuSettings = () => {
  const gpuSettings = useContext(GpuContext);
  if (gpuSettings === undefined) {
    throw new Error("useGpuSettings must be used within a GpuProvider");
  }
  return gpuSettings;
};
