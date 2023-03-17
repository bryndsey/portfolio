import { Html, ScreenSpace } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import { useHtmlPortal } from "../useHtmlPortal";
import { PageComponentProps } from "./Pages";
import { useScrollPages } from "./useScrollPages";
import { FaGithub } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { RxSquare } from "react-icons/rx";
import { SiItchdotio } from "react-icons/si";
import { BsGooglePlay } from "react-icons/bs";
import { IoCubeSharp } from "react-icons/io5";
import { IconType } from "react-icons";
import { logAnalyticsEvent } from "../firebase";

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
    url: "http://www.https://bryndsey.itch.io/.com/bryndsey",
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

export const ContactPage = (props: PageComponentProps) => {
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
            <h3 className="text-center pt-8 text-4xl landscape:text-2xl md:text-6xl landscape:md:text-6xl font-bold font-handwritten">
              More of my stuff:
            </h3>
            <div className="grow max-w-4xl w-fit sm:w-full grid sm:portrait:grid-cols-2 grid-cols-1 landscape:grid-cols-3 place-content-evenly gap-4 m-auto px-6 md:px-10">
              {links.map((link) => (
                <a
                  href={link.url}
                  key={link.url}
                  onClick={() =>
                    logAnalyticsEvent("external_link_clicked", {
                      linkUrl: link.url,
                    })
                  }
                  className="flex landscape:flex-col sm:flex-col flex-row landscape:gap-6 sm:gap-6 gap-4 items-center justify-start"
                >
                  <div
                    className={`${link.backgroundColor} p-4 rounded-3xl shadow-lg`}
                  >
                    <link.icon
                      className="w-8 h-8 sm:w-12 sm:h-12"
                      color={link.iconColor}
                    />
                  </div>
                  <p className="font-semibold">{link.displayName}</p>
                </a>
              ))}
            </div>
          </div>
        </Html>
      </group>
    </ScreenSpace>
  );
};
