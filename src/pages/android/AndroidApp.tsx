import { AndroidTag, Tag, UnityTag } from "../../ProjectDescription";

export type AndroidApp = {
  name: string;
  tempIconColor: string;
  description: string;
  url?: string;
  projectTags: Tag[];
};
// TODO: Maybe move this into a context/state holder instead of global public variable

export const androidApps: AndroidApp[] = [
  {
    name: "SongSpark",
    tempIconColor: "bg-blue-500",
    description: "The original version of SongSpark, made on Android",
    url: "https://play.google.com/store/apps/details?id=com.bryndsey.songspark",
    projectTags: [AndroidTag],
  },
  {
    name: "Tap Band",
    tempIconColor: "bg-red-800",
    description: "Idle clicker game. Get a band together and rise to stardom",
    url: "https://play.google.com/store/apps/details?id=com.blinz117.tapband",
    projectTags: [AndroidTag, UnityTag],
  },
  {
    name: "Tilt Archery Trainer",
    tempIconColor: "bg-green-400",
    description:
      "Practice your aim to take down balloons with your trusty bow and arrow. Putting the AR in ARchery",
    url: "https://play.google.com/store/apps/details?id=com.bryndsey.tiltarcherytrainer",
    projectTags: [AndroidTag, UnityTag],
  },
  {
    name: "Connected Light App",
    tempIconColor: "bg-teal-600",
    description: "Control smart lights via Bluetooth and Wi-fi",
    projectTags: [AndroidTag],
  },
  {
    name: "Banking App",
    tempIconColor: "bg-blue-400",
    description: "White-label banking application",
    projectTags: [AndroidTag],
  },
  {
    name: "Food Ordering App",
    tempIconColor: "bg-red-600",
    description: "Food ordering from a popular fast food chain",
    projectTags: [AndroidTag],
  },
];
