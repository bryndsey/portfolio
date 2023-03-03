import { PropsWithChildren, useEffect, useState } from "react";
import { useSelectedAndroidApp } from "./useSelectedAndroidApp";
import { AndroidApp, androidApps } from "./AndroidApp";
import { ProjectDescription } from "../../ProjectDescription";
import {
  FaArrowLeft,
  FaRegCircle,
  FaChevronLeft,
  FaWifi,
  FaSignal,
} from "react-icons/fa";

interface DeviceAppIconProps {
  app: AndroidApp;
}

const DeviceAppIcon = (props: DeviceAppIconProps) => {
  const { app } = props;
  const [, selectApp] = useSelectedAndroidApp();
  return (
    <div onClick={() => selectApp(props.app)}>
      <div
        className={`${app.iconBackgroundColor} rounded-lg aspect-square shadow-md hover:shadow-lg active:shadow-sm transition-shadow overflow-clip`}
      >
        {app.icon && (
          <img
            style={{ transform: `scale(${app.iconScale ?? 1})` }}
            src={app.icon}
          />
        )}
      </div>
      <p className="text-center text-base pt-2">{app.name}</p>
    </div>
  );
};

const useClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return currentTime;
};

const DeviceClock = () => {
  const currentTime = useClock();

  return (
    <p className="text-6xl text-center p-6 tabular-nums">
      {currentTime.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })}
    </p>
  );
};

const NavigationBar = () => {
  const [, selectApp] = useSelectedAndroidApp();
  return (
    <div className="flex flex-row justify-evenly bg-gray-700 bg-opacity-30 p-4">
      <button onClick={() => selectApp(null)}>
        <FaChevronLeft color="white" size={"1.5rem"} />
      </button>
      <button onClick={() => selectApp(null)}>
        <FaRegCircle color="white" size={"1.5rem"} />
      </button>
    </div>
  );
};

const TopBar = () => {
  const currentTime = useClock();
  return (
    <div className="flex justify-end items-center gap-4 p-4">
      <FaWifi color="white" />
      <FaSignal color="white" />
      <p className="text-lg text-end tabular-nums text-white">
        {currentTime.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
};

const HomeScreen = () => {
  return (
    <div className="h-full">
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
  const [selectedApp, selectApp] = useSelectedAndroidApp();
  if (selectedApp === null) throw new Error("Selected app should not be null");
  return (
    <div className="h-full bg-gray-100 p-8">
      <button onClick={() => selectApp(null)} className="p-2 mb-4">
        <FaArrowLeft size={"2rem"} />
      </button>
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
    <div className="h-full flex flex-col bg-blue-300 rounded-[36px]">
      <div className="w-full">
        <TopBar />
      </div>
      {props.children}
      <div className="w-full">
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
