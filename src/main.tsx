import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Home from "./App";
import "./styles/globals.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { isInStandaloneMode } from "./utils";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "ethereum";

export default function App() {
  const [installPromptEvent, setInstallPromptEvent] = useState<
    any | undefined
  >();

  useEffect(() => {
    if (isInStandaloneMode()) {
      return;
    }

    const beforeInstallPromptListener = (event: any) => {
      event.preventDefault();
      setInstallPromptEvent(event);
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptListener);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        beforeInstallPromptListener
      );
    };
  }, []);

  // Button click handler
  const handleInstallClick = () => {
    if (installPromptEvent && installPromptEvent.prompt) {
      installPromptEvent.prompt();
    }
  };

  // Checks if the app is openened in standalone mode or on browser
  return !isInStandaloneMode() ? (
    <main className="main">
      <div className="container">
        <div
          className="header"
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1 className="title">
            Welcome to{" "}
            <span className="gradient-text-0">
              <a
                href="https://thirdweb.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                thirdweb.
              </a>
            </span>
          </h1>
          {installPromptEvent ? (
            <button
              id="install-button"
              className="installButton"
              onClick={handleInstallClick}
            >
              Install App
            </button>
          ) : (
            // The install prompt event is still experimental
            // and not supported by all browsers. You can ask
            // the user to manually install the app instead.
            <div style={{ maxWidth: 600, textAlign: "center" }}>
              Install this app by pressing the installation button on your
              browser's search bar or if on mobile, by adding the app to your
              home screen
            </div>
          )}
        </div>
      </div>
    </main>
  ) : (
    <ThirdwebProvider
      clientId={import.meta.env.VITE_TEMPLATE_CLIENT_ID}
      activeChain={activeChain}
    >
      <Home />
    </ThirdwebProvider>
  );
}

window.addEventListener("appinstalled", () => {
  console.log("PWA was installed");
  // Reloading the page after installation to
  // dismiss the install button
  window.location.reload();
});

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
