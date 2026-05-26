(() => {
  const MARK = "data-classic-favicon";

  function pickApp() {
    const host = location.hostname;
    if (host === "mail.google.com") return "gmail";
    if (host === "calendar.google.com") return "calendar";
    if (host === "drive.google.com") return "drive";
    if (host === "meet.google.com") return "meet";
    if (host === "docs.google.com") {
      const p = location.pathname;
      if (p.startsWith("/document")) return "docs";
      if (p.startsWith("/spreadsheets")) return "sheets";
      if (p.startsWith("/presentation")) return "slides";
      return "docs";
    }
    return null;
  }

  const app = pickApp();
  if (!app) return;

  const TARGET_HREF = chrome.runtime.getURL(`icons/${app}.png`);

  function enforce() {
    if (!document.head) return;

    for (const link of document.head.querySelectorAll('link[rel~="icon"]')) {
      if (!link.hasAttribute(MARK)) link.remove();
    }

    let ours = document.head.querySelector(`link[${MARK}]`);
    if (!ours) {
      ours = document.createElement("link");
      ours.rel = "icon";
      ours.type = "image/png";
      ours.href = TARGET_HREF;
      ours.setAttribute(MARK, "");
      document.head.appendChild(ours);
    } else if (ours.href !== TARGET_HREF) {
      ours.href = TARGET_HREF;
    }
  }

  function start() {
    enforce();
    const observer = new MutationObserver(enforce);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["rel", "href"],
    });
  }

  if (document.head) {
    start();
  } else {
    const wait = new MutationObserver(() => {
      if (document.head) {
        wait.disconnect();
        start();
      }
    });
    wait.observe(document.documentElement, { childList: true });
  }
})();
