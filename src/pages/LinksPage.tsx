import { Html, ScreenSpace } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import { useHtmlPortal } from "@hooks/useHtmlPortal";
import { PageComponentProps } from "./Pages";
import { useScrollPages } from "./useScrollPages";
import { FaGithub } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { RxSquare } from "react-icons/rx";
import { SiItchdotio } from "react-icons/si";
import { BsGooglePlay } from "react-icons/bs";
import { IoCubeSharp } from "react-icons/io5";
import { IconType } from "react-icons";
import { logAnalyticsEvent } from "@analytics/firebase";
import { useScreenState } from "@hooks/useScreenState";

interface LinkData {
  url: string;
  icon: IconType;
  iconColor: string;
  backgroundColor: string;
  displayName: string;
}

const links: LinkData[] = [
  {
    url: "http://www.github.com/bryndsey",
    icon: FaGithub,
    iconColor: "white",
    backgroundColor: "bg-black",
    displayName: "GitHub",
  },
  {
    url: "https://codesandbox.io/u/bryanlindsey",
    icon: RxSquare,
    iconColor: "white",
    backgroundColor: "bg-gray-800",
    displayName: "CodeSandbox",
  },
  {
    url: "https://play.google.com/store/apps/developer?id=Bryndsey",
    icon: BsGooglePlay,
    iconColor: "white",
    backgroundColor: "bg-amber-500",
    displayName: "Google Play",
  },
  {
    url: "https://bryndsey.itch.io/",
    icon: SiItchdotio,
    iconColor: "white",
    backgroundColor: "bg-red-500",
    displayName: "itch.io",
  },
  {
    url: "https://sketchfab.com/bryndsey",
    icon: IoCubeSharp,
    iconColor: "white",
    backgroundColor: "bg-sky-500",
    displayName: "Sketchfab",
  },
  {
    url: "https://www.linkedin.com/in/bryan-c-lindsey/",
    icon: FaLinkedinIn,
    iconColor: "white",
    backgroundColor: "bg-blue-600",
    displayName: "LinkedIn",
  },
];

export const LinksPage = (props: PageComponentProps) => {
  const groupRef = useRef<Group>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const htmlPortal = useHtmlPortal();

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    ({ enterAmount, exitAmount, isPageVisible, state }) => {
      if (groupRef.current === null) return;

      groupRef.current.visible = isPageVisible;

      if (contentRef.current === null) return;
      contentRef.current.hidden = !isPageVisible;

      const yPercent = enterAmount + exitAmount;

      const viewportHeight = state.viewport.height;
      groupRef.current.position.setY(yPercent * viewportHeight);
    }
  );

  const state = useScreenState();

  return (
    <ScreenSpace depth={2}>
      <group ref={groupRef}>
        <Html
          ref={contentRef}
          fullscreen
          portal={{ current: htmlPortal }}
          className="bg-yellow-300"
        >
          <div className="h-full flex flex-col md:gap-4 items-center justify-center p-4 landscape:p-2 landscape:md:p-12 sm:p-8 md:p-12">
            <h3 className="text-center pt-4 md:pt-8 text-4xl landscape:text-2xl md:text-6xl landscape:md:text-6xl font-bold font-handwritten">
              More things:
            </h3>
            <div className="flex-1 max-w-4xl w-fit sm:w-full grid sm:portrait:grid-cols-2 grid-cols-1 landscape:grid-cols-3 place-content-evenly sm:place-items-center gap-4 m-auto px-6 md:px-10">
              {links.map((link) => (
                <a
                  href={link.url}
                  key={link.url}
                  onClick={() =>
                    logAnalyticsEvent("bryan_external_link_clicked", {
                      bryan_link_url: link.url,
                    })
                  }
                  className="flex landscape:flex-col sm:flex-col flex-row gap-x-4 gap-y-2 md:gap-y-4 items-center justify-start"
                >
                  <div
                    className={`${link.backgroundColor} flex-shrink aspect-square p-2 md:p-4 rounded-[25%] shadow-lg`}
                  >
                    <link.icon
                      className={
                        state.orientation === "landscape" &&
                        state.deviceClass === "small"
                          ? "w-6 h-6"
                          : "w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10"
                      }
                      color={link.iconColor}
                    />
                  </div>
                  <p className="font-semibold text-sm landscape:text-xs md:text-base landscape:md:text-base">
                    {link.displayName}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </Html>
      </group>
    </ScreenSpace>
  );
};
