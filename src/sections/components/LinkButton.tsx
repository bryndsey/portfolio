import { logAnalyticsEvent } from "@analytics/firebase";

export interface LinkButtonProps {
  linkUrl: string;
  text: string;
}

export function LinkButton(props: LinkButtonProps) {
  return (
    <a
      href={props.linkUrl}
      onClick={() =>
        logAnalyticsEvent("bryan_link_clicked", {
          bryan_link_url: props.linkUrl,
        })
      }
      className="px-3 sm:px-4 py-2 text-sm sm:text-lg bg-yellow-400 rounded hover:bg-yellow-300 active:bg-yellow-500 font-bold duration-300 w-fit select-none shadow hover:shadow-md active:shadow-sm hover:scale-105 active:scale-95"
    >
      {props.text}
    </a>
  );
}
