import { Html } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import { useHtmlPortal } from "../useHtmlPortal";
import { PageComponentProps } from "./Pages";
import { useScrollPages } from "./useScrollPages";
import { FaGithub } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { RxSquare } from "react-icons/rx";
import { SiItchdotio } from "react-icons/si";
import { IconType } from "react-icons";

interface LinkData {
  url: string;
  icon: IconType;
  iconColor: string;
  backgroundColor: string;
}

const links: LinkData[] = [
  {
    url: "http://www.github.com/bryndsey",
    icon: FaGithub,
    iconColor: "white",
    backgroundColor: "bg-black",
  },
  {
    url: "https://codesandbox.io/u/bryanlindsey",
    icon: RxSquare,
    iconColor: "white",
    backgroundColor: "bg-gray-800",
  },
  {
    url: "http://www.https://bryndsey.itch.io/.com/bryndsey",
    icon: SiItchdotio,
    iconColor: "white",
    backgroundColor: "bg-red-500",
  },
  {
    url: "https://www.linkedin.com/in/bryan-lindsey-1b320998",
    icon: FaLinkedinIn,
    iconColor: "white",
    backgroundColor: "bg-blue-600",
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
    <group ref={groupRef}>
      <Html ref={contentRef} fullscreen portal={{ current: htmlPortal }}>
        <div className="h-full flex flex-row portrait:flex-col justify-evenly items-center m-0">
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              className={`${link.backgroundColor} p-3 rounded-xl`}
            >
              <link.icon className="w-12 h-12" color={link.iconColor} />
            </a>
          ))}
        </div>
      </Html>
    </group>
  );
};
