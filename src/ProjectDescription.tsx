interface ProjectDescriptionProps {
  projectName: string;
  descriptionText: string;
  tags?: Tag[];
  className?: string;
}

export const ProjectDescription = (props: ProjectDescriptionProps) => {
  return (
    // TODO: Re-add ability to combine with props style (or remove props style?)
    <div className={"flex flex-col gap-4"}>
      <h2 className="text-4xl font-bold">{props.projectName}</h2>
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

type Tag = { name: string; color: string };
export const AndroidTag: Tag = { name: "Android", color: "lightgreen" };
export const ReactTag: Tag = { name: "React", color: "deepskyblue" };
export const UnityTag: Tag = { name: "Unity", color: "lightgrey" };
