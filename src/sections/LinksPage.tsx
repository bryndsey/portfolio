import { logAnalyticsEvent } from "@analytics/firebase";
import { useHtmlPortal } from "@hooks/useHtmlPortal";
import { Html, ScreenSpace } from "@react-three/drei";
import { useRef } from "react";
import { IconType } from "react-icons";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { IoCubeSharp } from "react-icons/io5";
import { RxSquare } from "react-icons/rx";
import { SiItchdotio } from "react-icons/si";
import { Group } from "three";
import { PageComponentProps } from "./Pages";
import { LinkButton } from "./components/LinkButton";
import { useScrollPages } from "./useScrollPages";

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
    url: "https://www.linkedin.com/in/bryan-c-lindsey/",
    icon: FaLinkedinIn,
    iconColor: "white",
    backgroundColor: "bg-blue-600",
    displayName: "LinkedIn",
  },
  {
    url: "https://codesandbox.io/u/bryanlindsey",
    icon: RxSquare,
    iconColor: "white",
    backgroundColor: "bg-gray-800",
    displayName: "CodeSandbox",
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

  return (
    <ScreenSpace depth={2}>
      <group ref={groupRef}>
        <Html ref={contentRef} fullscreen portal={{ current: htmlPortal }}>
          <FooterContent />
        </Html>
      </group>
    </ScreenSpace>
  );
};

function FooterContent() {
  return (
    <section className="w-full h-full flex flex-col">
      <div className="flex-grow grid place-content-center">
        <CallToActionContent />
      </div>
      <Footer />
    </section>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center space-y-4 text-center mt-10 p-4 bg-yellow-300">
      <div className="flex space-x-4 p-[2dvh]">
        {links.map((link) => (
          <FooterLink key={link.url} link={link} />
        ))}
      </div>
      <p className="text-xs text-yellow-600">
        © 2024 Bryan Lindsey. All rights reserved.
      </p>
    </footer>
  );
}

function FooterLink({ link }: { link: LinkData }) {
  return (
    <a
      href={link.url}
      className={`${link.backgroundColor} rounded-full p-2 shadow-sm`}
      onClick={() =>
        logAnalyticsEvent("bryan_external_link_clicked", {
          bryan_link_url: link.url,
        })
      }
    >
      <link.icon className="text-white size-5 md:size-6" />
    </a>
  );
}

function CallToActionContent() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-2">
      <h2 className="font-bold tracking-tighter text-[calc(3vh+3vw)]">
        Wanna get in touch?
      </h2>
      <p className="max-w-[40ch] text-pretty text-[calc(1.5vh+1.5vw)]">
        {
          "Interested in learning more about me or any of the things I've made? Let's chat!"
        }
      </p>
      <div className="flex flex-row items-baseline gap-2 mt-4">
        <LinkButton text="Hit me up" linkUrl="mailto:me@bryanlindsey.dev" />
        <LinkButton
          text="Connect"
          linkUrl="https://www.linkedin.com/in/bryan-c-lindsey/"
        />
      </div>
    </div>
  );
}
