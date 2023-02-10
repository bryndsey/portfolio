import { atom, useAtom } from "jotai";
import { AndroidApp } from "./AndroidApp";

const selectedAppAtom = atom<AndroidApp | null>(null);
export const useSelectedAndroidApp = () => useAtom(selectedAppAtom);
