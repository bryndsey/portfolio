// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAr8FaiGAVirQLxvU3jJVV-5aP36cuQTQk",
  authDomain: "bryanlindsey-portfolio.firebaseapp.com",
  projectId: "bryanlindsey-portfolio",
  storageBucket: "bryanlindsey-portfolio.appspot.com",
  messagingSenderId: "967994969881",
  appId: "1:967994969881:web:7ad8367ceee9cb19df3f88",
  measurementId: "G-BN01QZZRC9",
};

let logGoogleAnalyticsEvent: (event: string, payload?: unknown) => void;
if (import.meta.env.DEV) {
  logGoogleAnalyticsEvent = (event: string, payload?: unknown) => {
    console.debug("Analytic event logged", event, payload);
  };
} else {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  logGoogleAnalyticsEvent = (event: string, payload?: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logEvent(analytics, event, payload as any);
  };
}

export const logAnalyticsEvent = logGoogleAnalyticsEvent;
