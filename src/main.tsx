import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./i18n";
import { bootLanguage } from "./lib/lang-boot";
import "./index.css";

// Pick the language from the URL prefix (/ar/, /fr/, /en/) before mounting,
// so the very first paint is already in the right language and direction.
const { basename } = bootLanguage();

createRoot(document.getElementById("root")!).render(<App basename={basename} />);
