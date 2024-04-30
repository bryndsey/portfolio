import { IconType } from "react-icons";
import { FaAndroid, FaReact, FaUnity } from "react-icons/fa";
import { GiSoundWaves } from "react-icons/gi";
import {
  SiAstro,
  SiKonva,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
} from "react-icons/si";
import { twMerge } from "tailwind-merge";
import { LinkButton } from "./LinkButton";

interface ProjectDescriptionProps {
  projectName: string;
  descriptionText: string;
  url?: string;
  actionText?: string;
  tags?: Tag[];
  className?: string;
}

interface TagsProps {
  tags: Tag[];
}

const Tags = (props: TagsProps) => {
  return (
    <div className="flex flex-row gap-2">
      {props.tags.map((tag) => {
        return (
          <div
            key={tag.name}
            className="tooltip tooltip-top xs:tooltip-bottom"
            data-tip={tag.name}
          >
            <div className="p-1.5 sm:p-2 rounded-full bg-neutral-300">
              <tag.icon
                className="w-3 h-3 sm:w-4 sm:h-4"
                color={"#000000aa"} //tag.iconColor}
              />
              {/* {tag.name} */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const ProjectDescription = (props: ProjectDescriptionProps) => {
  return (
    <div
      className={twMerge(
        "flex flex-col gap-[1em] text-[calc(1.5vw+1.5vh)] leading-tight overflow-x-clip",
        props.className
      )}
    >
      <h2 className="text-[2.5em] font-bold leading-none overflow-ellipsis overflow-x-clip">
        {props.projectName}
      </h2>
      <p>{props.descriptionText}</p>

      <div className="flex flex-col-reverse xs:flex-row xs:flex-wrap-reverse justify-between gap-y-[1em] gap-x-[1em]">
        {props.url && (
          <LinkButton linkUrl={props.url} text={props.actionText ?? "Try it"} />
        )}
        {props.tags && (
          <div className="text-[0.66em] flex flex-row items-center gap-2">
            <p className="m-0 opacity-50">Made with</p>
            <Tags tags={props.tags} />
          </div>
        )}
      </div>
    </div>
  );
};

export type Tag = {
  name: string;
  color: string;
  icon: IconType;
  iconColor: string;
};

export const AndroidTag: Tag = {
  name: "Android",
  color: "rgb(61, 220, 132)",
  icon: FaAndroid,
  iconColor: "white",
};

export const AstroTag: Tag = {
  name: "Astro",
  color: "rgb(23, 24, 28)",
  icon: SiAstro,
  iconColor: "white",
};

export const ReactTag: Tag = {
  name: "React",
  color: "rgb(20, 158, 202)",
  icon: FaReact,
  iconColor: "white",
};

export const TypescriptTag: Tag = {
  name: "TypeScript",
  color: "#3178c6",
  icon: SiTypescript,
  iconColor: "white",
};

export const TailwindTag: Tag = {
  name: "Tailwind CSS",
  color: "#3178c6",
  icon: SiTailwindcss,
  iconColor: "white",
};

export const ThreeJsTag: Tag = {
  name: "Three.js",
  color: "rgb(24, 24, 24)",
  icon: SiThreedotjs,
  iconColor: "white",
};

export const KonvaTag: Tag = {
  name: "Konva",
  color: "#0d83cd",
  icon: SiKonva,
  iconColor: "white",
};

export const WebAudioTag: Tag = {
  name: "Web Audio",
  color: "#a16207",
  icon: GiSoundWaves,
  iconColor: "white",
};

export const UnityTag: Tag = {
  name: "Unity",
  color: "dimgray",
  icon: FaUnity,
  iconColor: "white",
};
