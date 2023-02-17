import { Children, PropsWithChildren, useEffect, useState } from "react";
import { useSelectedAndroidApp } from "./useSelectedAndroidApp";
import { AndroidApp, androidApps } from "./AndroidApp";
import { ProjectDescription } from "../../ProjectDescription";

interface DeviceAppIconProps {
  app: AndroidApp;
}

const DeviceAppIcon = (props: DeviceAppIconProps) => {
  const [, selectApp] = useSelectedAndroidApp();
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

const NavigationBar = () => {
  const [, selectApp] = useSelectedAndroidApp();
  return (
    <div className="flex flex-row justify-evenly bg-gray-700 opacity-30 p-4">
      <button onClick={() => selectApp(null)}>Back</button>
      <button onClick={() => selectApp(null)}>Home</button>
    </div>
  );
};

const HomeScreen = () => {
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
};

const AppDisplay = () => {
  const [selectedApp] = useSelectedAndroidApp();
  if (selectedApp === null) throw new Error("Selected app should not be null");
  return (
    <div className="h-full bg-gray-100 p-8">
      <ProjectDescription
        projectName={selectedApp.name}
        descriptionText={selectedApp.description}
        tags={selectedApp.projectTags}
        url={selectedApp.url}
        actionText={"Play Store"}
      />
    </div>
  );
};

const ScreenScaffold = (props: PropsWithChildren) => {
  return (
    <div className="h-full">
      {props.children}
      <div className="absolute bottom-0 left-0 right-0">
        <NavigationBar />
      </div>
    </div>
  );
};

export function ScreenContent() {
  const [selectedApp] = useSelectedAndroidApp();
  return (
    <ScreenScaffold>
      {selectedApp ? <AppDisplay /> : <HomeScreen />}
    </ScreenScaffold>
  );
}
