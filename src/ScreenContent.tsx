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
    <div style={{ padding: 8 }}>
      <DeviceClock />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 16,
          padding: 8,
        }}
      >
        <DeviceAppIcon appName="Test 1" color="green" />
        <DeviceAppIcon appName="Test 2" color="blue" />
        <DeviceAppIcon appName="Test 3" color="red" />
        <DeviceAppIcon appName="Test 4" color="tan" />
        <DeviceAppIcon appName="Test 5" color="grey" />
      </div>
    </div>
  );
}
