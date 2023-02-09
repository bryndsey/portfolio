import { useEffect, useState } from "react";

interface DeviceAppIconProps {
  appName: string;
  color: string;
}

const DeviceAppIcon = (props: DeviceAppIconProps) => {
  return (
    <div>
      <div
        className="rounded-lg aspect-square shadow-md hover:shadow-lg active:shadow-sm transition-shadow"
        style={{
          backgroundColor: props.color,
        }}
      />
      <p className="text-center text-base pt-2">{props.appName}</p>
    </div>
  );
};

const DeviceClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-6xl text-center p-6 tabular-nums">
      {currentTime.toLocaleTimeString()}
    </p>
  );
};

export function ScreenContent() {
  return (
    <div className="h-full bg-blue-300">
      <div className="p-4">
        <DeviceClock />
        <div className="grid grid-cols-3 gap-8 p-2">
          <DeviceAppIcon appName="SongSpark" color="royalblue" />
          <DeviceAppIcon appName="Tap Band" color="brown" />
          <DeviceAppIcon appName="Tilt Archery Trainer" color="forestgreen" />
          <DeviceAppIcon appName="Connected Light App" color="steelblue" />
          <DeviceAppIcon appName="Banking App" color="white" />
          <DeviceAppIcon appName="Fast Food App" color="red" />
        </div>
      </div>
    </div>
  );
}
