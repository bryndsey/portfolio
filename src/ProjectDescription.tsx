interface ProjectDescriptionProps {
  projectName: string;
  descriptionText: string;
  url?: string;
  actionText?: string;
  tags?: Tag[];
  className?: string;
}

export const ProjectDescription = (props: ProjectDescriptionProps) => {
  return (
    // TODO: Re-add ability to combine with props style (or remove props style?)
    <div className={"flex flex-col gap-4"}>
      <div className="flex flex-row flex-wrap items-center gap-4">
        <h2 className="text-4xl font-bold">{props.projectName}</h2>
        {props.url && (
          <a
            href={props.url}
            className="p-2 text-sm bg-yellow-400 rounded hover:bg-yellow-300 active:bg-yellow-500 font-bold uppercase duration-300"
          >
            {props.actionText ?? "Try it"}
          </a>
        )}
      </div>
      <p className="text-lg">{props.descriptionText}</p>
      {props.tags && (
        <div className="flex flex-row gap-2">
          {props.tags.map((tag) => {
            return (
              <div
                key={tag.name}
                className="p-2 text-xs rounded"
                style={{
                  backgroundColor: tag.color,
                }}
              >
                {tag.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export type Tag = { name: string; color: string };
export const AndroidTag: Tag = { name: "Android", color: "lightgreen" };
export const ReactTag: Tag = { name: "React", color: "deepskyblue" };
export const UnityTag: Tag = { name: "Unity", color: "lightgrey" };
