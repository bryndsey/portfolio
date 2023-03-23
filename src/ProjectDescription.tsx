import { IconType } from "react-icons";
import { FaAndroid, FaReact, FaUnity } from "react-icons/fa";
import { SiThreedotjs, SiKonva, SiTypescript } from "react-icons/si";
import { GiSoundWaves } from "react-icons/gi";
import { logAnalyticsEvent } from "./firebase";

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
            className="tooltip tooltip-top xs:tooltip-bottom tooltip-secondary"
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

interface LinkButtonProps {
  linkUrl: string;
  actionText?: string;
}

const LinkButton = (props: LinkButtonProps) => {
  return (
    <a
      href={props.linkUrl}
      onClick={() =>
        logAnalyticsEvent("bryan_project_link_clicked", {
          bryan_link_url: props.linkUrl,
        })
      }
      className="px-3 sm:px-4 py-2 text-sm sm:text-lg bg-yellow-400 rounded hover:bg-yellow-300 active:bg-yellow-500 font-bold uppercase duration-300 w-fit select-none"
    >
      {props.actionText ?? "Try it"}
    </a>
  );
};

export const ProjectDescription = (props: ProjectDescriptionProps) => {
  return (
    // TODO: Re-add ability to combine with props style (or remove props style?)
    <div className={"flex flex-col gap-4 sm:gap-6"}>
      <h2 className="text-4xl sm:text-6xl font-bold">{props.projectName}</h2>
      <p className="text-2xl sm:text-3xl">{props.descriptionText}</p>

      <div className="flex flex-col-reverse xs:flex-row xs:flex-wrap-reverse justify-between gap-y-4 gap-x-6">
        {props.url && (
          <LinkButton linkUrl={props.url} actionText={props.actionText} />
        )}
        {props.tags && (
          <div className="flex flex-row items-center gap-2">
            <p className="text-sm m-0 opacity-50">Made with</p>
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
