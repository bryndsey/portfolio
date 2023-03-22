import { AndroidTag, Tag, UnityTag } from "../../ProjectDescription";
import SongSparkIcon from "./icons/songspark_icon.png";
import TapBandIcon from "./icons/tap_band_icon.png";
import AndroidBryanIcon from "./icons/androidify_bryan.png";
import TiltArcheryTrainerIcon from "./icons/tilt_archery_trainer_icon.webp";

export type AndroidApp = {
  name: string;
  description: string;
  url?: string;
  icon?: string;
  iconBackgroundColor?: string;
  iconScale?: number;
  projectTags?: Tag[];
};
// TODO: Maybe move this into a context/state holder instead of global public variable

export const androidApps: AndroidApp[] = [
  {
    name: "SongSpark",
    description: "The original version of SongSpark, made on Android",
    url: "https://play.google.com/store/apps/details?id=com.bryndsey.songspark",
    icon: SongSparkIcon,
    iconBackgroundColor: "bg-blue-500",
    iconScale: 0.8,
    projectTags: [AndroidTag],
  },
  {
    name: "Tap Band",
    description: "Idle clicker game. Get a band together and rise to stardom",
    url: "https://play.google.com/store/apps/details?id=com.blinz117.tapband",
    icon: TapBandIcon,
    iconBackgroundColor: "bg-red-800",
    iconScale: 0.8,
    projectTags: [AndroidTag, UnityTag],
  },
  {
    name: "Tilt Archery Trainer",
    description:
      "Practice your aim to take down balloons with your trusty bow and arrow. Putting the AR in ARchery",
    url: "https://play.google.com/store/apps/details?id=com.bryndsey.tiltarcherytrainer",
    icon: TiltArcheryTrainerIcon,
    iconScale: 1.2,
    projectTags: [AndroidTag, UnityTag],
  },
  {
    name: "Professional Work",
    description:
      "I've built apps for Android professionally since 2015. In that time, I've worked on apps for food ordering, banking, controlling smart lights, and more!",
    iconBackgroundColor: "bg-slate-500",
    icon: AndroidBryanIcon,
  },
  // {
  //   name: "Connected Light App",
  //   description: "Control smart lights via Bluetooth and Wi-fi",
  //   iconBackgroundColor: "bg-teal-600",
  //   projectTags: [AndroidTag],
  // },
  // {
  //   name: "Banking App",
  //   description: "White-label banking application",
  //   iconBackgroundColor: "bg-blue-400",
  //   projectTags: [AndroidTag],
  // },
  // {
  //   name: "Food Ordering App",
  //   description: "Food ordering from a popular fast food chain",
  //   iconBackgroundColor: "bg-red-600",
  //   projectTags: [AndroidTag],
  // },
];
