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
        <div style={{ display: "flex", flexDirection: "row", gap: "0.5em" }}>
          {props.tags.map((tag) => {
            return (
              <div
                key={tag.name}
                style={{
                  padding: "0.5em",
                  backgroundColor: tag.color,
                  borderRadius: "0.25em",
                  fontSize: "0.75em",
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
