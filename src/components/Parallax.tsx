import { useFrame } from "@darkroom.engineering/hamo";
import { animated, useSpringValue } from "@react-spring/web";
import { useRef } from "react";

export function Parallax({
  children,
  className,
  speed = 1,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  const divRef = useRef<HTMLDivElement>(null);

  const translateY = useSpringValue(0, { config: { duration: 100 } });

  useFrame(() => {
    if (!divRef.current) return 0;
    const rect = divRef.current.getBoundingClientRect();
    const viewMidpoint = rect.top + rect.height / 2;
    const viewportMidpoint = window.innerHeight / 2;
    translateY.start((speed * (viewMidpoint - viewportMidpoint)) / 10);
  });

  return (
    <animated.div ref={divRef} style={{ translateY }} className={className}>
      {children}
    </animated.div>
  );
}
