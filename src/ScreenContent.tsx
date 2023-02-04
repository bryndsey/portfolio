import { useEffect, useState } from "react";

interface DeviceAppIconProps {
  appName: string;
  color: string;
}

const DeviceAppIcon = (props: DeviceAppIconProps) => {
  return (
    <div>
      <div
        style={{
          backgroundColor: props.color,
          borderRadius: 8,
          aspectRatio: "1 / 1",
          boxShadow: "0px 2px 4px 2px rgba(0, 0, 0, 0.1)",
        }}
      />
      <p style={{ textAlign: "center" }}>{props.appName}</p>
    </div>
  );
};

const DeviceClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    });

    return () => clearInterval(interval);
  }, []);

  return <p>{currentTime.toLocaleTimeString()}</p>;
};

export function ScreenContent() {
  return (
    <div style={{ padding: 8, backgroundColor: "lightblue", height: "100%" }}>
      <DeviceClock />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 16,
          padding: 8,
        }}
      >
        <DeviceAppIcon appName="SongSpark" color="royalblue" />
        <DeviceAppIcon appName="Tilt Archery Trainer" color="forestgreen" />
        <DeviceAppIcon appName="Tap Band" color="brown" />
        <DeviceAppIcon appName="Connected Light App" color="steelblue" />
        <DeviceAppIcon appName="Banking App" color="white" />
        <DeviceAppIcon appName="Fast Food App" color="red" />
      </div>
    </div>
  );
}
