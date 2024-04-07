import AnimatedCursor from "react-animated-cursor";

export function CustomCursor() {
  const hasMouse = matchMedia("(pointer: fine)").matches;

  if (!hasMouse) {
    return null;
  }

  return (
    <AnimatedCursor
      innerSize={20}
      innerScale={2}
      outerAlpha={0}
      innerStyle={{
        backgroundColor: "rgba(0, 150, 60, 0.97)",
        animation: "squiggly-anim 0.66s linear infinite",
      }}
    />
  );
}
