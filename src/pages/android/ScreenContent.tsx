import { PropsWithChildren, useEffect, useState } from "react";
import { useSelectedAndroidApp } from "./useSelectedAndroidApp";
import { AndroidApp, androidApps } from "./AndroidApp";
import { ProjectDescription } from "../../ProjectDescription";
import {
  MdSignalWifiStatusbar3Bar,
  MdSignalCellular3Bar,
  MdBattery80,
  MdOutlineCircle,
  MdArrowBackIos,
  MdArrowBack,
} from "react-icons/md";

interface DeviceAppIconProps {
  app: AndroidApp;
}

const DeviceAppIcon = (props: DeviceAppIconProps) => {
  const { app } = props;
  const [, selectApp] = useSelectedAndroidApp();
  return (
    <div onClick={() => selectApp(props.app)}>
      <div
        className={`${app.iconBackgroundColor} rounded-xl aspect-square shadow-md hover:shadow-lg active:shadow-sm transition-shadow overflow-clip`}
      >
        {app.icon && (
          <img
            style={{ transform: `scale(${app.iconScale ?? 1})` }}
            src={app.icon}
          />
        )}
      </div>
      <p className="text-center text-sm sm:text-base pt-2 truncate">
        {app.name}
      </p>
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

const NavigationBar = () => {
  const [, selectApp] = useSelectedAndroidApp();
  return (
    <div className="flex flex-row justify-evenly bg-gray-700 bg-opacity-30 p-4">
      <button onClick={() => selectApp(null)}>
        <MdArrowBackIos color="white" size={"1.5rem"} />
      </button>
      <button onClick={() => selectApp(null)}>
        <MdOutlineCircle color="white" size={"1.5rem"} />
      </button>
    </div>
  );
};

const TopBar = () => {
  const currentTime = useClock();
  return (
    <div className="flex justify-end items-center gap-2 p-5 w-full">
      <p className="text-md text-start tabular-nums text-white flex-grow">
        {currentTime.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })}
      </p>
      <MdSignalWifiStatusbar3Bar color="white" />
      <MdSignalCellular3Bar color="white" />
      <MdBattery80 color="white" />
    </div>
  );
};

const HomeScreen = () => {
  return (
    <div className="h-full">
      <div className="p-4">
        {
          // TODO: Find a different font
        }
        <div className="text-4xl sm:text-5xl text-center p-6 font-bold">
          {"Bryan's Android Apps"}
        </div>
        <div className="grid grid-cols-3 gap-x-5 gap-y-8 sm:gap-8 p-1 sm:p-2">
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
        <MdArrowBack size={"2rem"} />
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
    <div className="h-full flex flex-col bg-blue-300">
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
