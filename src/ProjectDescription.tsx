interface ProjectDescriptionProps {
  projectName: string;
  descriptionText: string;
  tags?: Tag[];
  className?: string;
}

export const ProjectDescription = (props: ProjectDescriptionProps) => {
  return (
    <div className={props.className}>
      <h2>{props.projectName}</h2>
      <p>{props.descriptionText}</p>
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
