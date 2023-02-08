import { ContactPage } from "./ContactPage";
import { DevicePage } from "./DevicePage";
import { GuitarPage } from "./GuitarPage";
import { IntroText } from "./IntroText";

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
  { id: "intro", component: IntroText, contentLength: 0 },
  { id: "guitar", component: GuitarPage, contentLength: 1 },
  { id: "device", component: DevicePage, contentLength: 1 },
  { id: "contact", component: ContactPage, contentLength: 0 },
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
