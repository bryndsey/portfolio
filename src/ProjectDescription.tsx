import { IconType } from "react-icons";
import { FaAndroid, FaReact, FaUnity } from "react-icons/fa";

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
            className="tooltip tooltip-bottom"
            data-tip={tag.name}
          >
            <div
              className="p-1 sm:p-1.5 rounded-full"
              style={{
                backgroundColor: tag.color,
              }}
            >
              <tag.icon
                className="w-3 h-3 sm:w-4 sm:h-4"
                color={tag.iconColor}
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

      {props.url && (
        <LinkButton linkUrl={props.url} actionText={props.actionText} />
      )}
      {/* <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-4">
        {props.tags && <Tags tags={props.tags} />}
      </div> */}
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

export const UnityTag: Tag = {
  name: "Unity",
  color: "dimgray",
  icon: FaUnity,
  iconColor: "white",
};
