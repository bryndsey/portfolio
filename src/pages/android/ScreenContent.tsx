import { useEffect, useState } from "react";
import { useSelectedAndroidApp } from "./useSelectedAndroidApp";
import { AndroidApp, androidApps } from "./AndroidApp";

interface DeviceAppIconProps {
  app: AndroidApp;
}

const DeviceAppIcon = (props: DeviceAppIconProps) => {
  const [_, selectApp] = useSelectedAndroidApp();
  return (
    <div onClick={() => selectApp(props.app)}>
      <div
        className={`${props.app.tempIconColor} rounded-lg aspect-square shadow-md hover:shadow-lg active:shadow-sm transition-shadow`}
      />
      <p className="text-center text-base pt-2">{props.app.name}</p>
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
          {androidApps.map((app) => {
            return <DeviceAppIcon key={app.name} app={app} />;
          })}
        </div>
      </div>
    </div>
  );
}
