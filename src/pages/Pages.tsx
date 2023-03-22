import { LinksPage } from "./LinksPage";
import { AndroidPage } from "./android/AndroidPage";
import { SongSparkPage } from "./react/music/songspark/SongSparkPage";
import { IntroPage } from "./intro/IntroPage";
import { AboutPage } from "./AboutPage";
import { PedalsPage } from "./react/music/pedals/PedalsPage";
import { ChoresPage } from "./react/chores/ChoresPage";
import { TicTacToePage } from "./react/tictactoe/TicTacToePage";
import { isChrome } from "react-device-detect";

export interface PageComponentProps {
  startPageIndex: number;
  exitPageIndex: number;
}

interface Page {
  id: string;
  component: (props: PageComponentProps) => JSX.Element;
  contentLength: number;
}

const pagesShapes: Page[] = [
  { id: "intro", component: IntroPage, contentLength: 0 },
  { id: "about", component: AboutPage, contentLength: 0 },
  { id: "songspark", component: SongSparkPage, contentLength: 0.5 },
  { id: "pedals", component: PedalsPage, contentLength: 0.5 },
  // { id: "chores", component: ChoresPage, contentLength: 0.25 },
  { id: "tictactoeplus", component: TicTacToePage, contentLength: 0.5 },
  ...(isChrome
    ? [{ id: "android", component: AndroidPage, contentLength: 0.5 }]
    : []),
  { id: "links", component: LinksPage, contentLength: 0 },
];

type PageWithStartIndex = { page: Page; startIndex: number };

type Pages = { pagesWithStartIndex: PageWithStartIndex[]; totalPages: number };

export const pages: Pages = pagesShapes.reduce(
  (accumulator, page) => {
    // Add 1 to account for overlapping transistions
    const newPageTotal = accumulator.totalPages + page.contentLength + 1;
    const pageWithStartIndex: PageWithStartIndex = {
      page: page,
      startIndex: accumulator.totalPages + 1,
    };
    return {
      pagesWithStartIndex:
        accumulator.pagesWithStartIndex.concat(pageWithStartIndex),
      totalPages: newPageTotal,
    };
  },
  // Start with -1 so we end on the last page
  { pagesWithStartIndex: [], totalPages: -1 } as Pages
);

// console.table(totalPageStuff);
