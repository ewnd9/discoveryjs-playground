import {
  Widget,
  router,
  complexViews
} from "@discoveryjs/discovery/dist/lib.umd.js";
// import settingsPage from '../settings';
import "@discoveryjs/discovery/dist/lib.css";
import "@discoveryjs/discovery/client/common.css";
// import './index.css';

document.getElementById("app").innerHTML = `
<h1>Hello Parcel!</h1>
<div>
  Look
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>
  for more info about Parcel.
</div>
`;

/**
 * Discovery initialization
 * @param {Object} options
 * @returns {Discovery}
 */
export function initDiscovery(options) {
  const { settings } = options;
  const discovery = new Widget(options.wrapper);

  discovery.apply(router);
  discovery.apply(complexViews);

  // settingsPage(discovery);

  discovery.page.define("default", [
    {
      view: "struct",
      expanded: parseInt(settings.expandLevel, 10) || 0
    }
  ]);

  discovery.view.define("raw", el => {
    const { raw } = discovery.context;
    const div = document.createElement("div");

    div.classList.add("user-select");
    div.innerHTML = raw;

    el.appendChild(div);
  });

  discovery.page.define("raw", [
    {
      view: "raw"
    }
  ]);

  discovery.addBadge(
    "Index",
    () => {
      discovery.setPage("default");
      // history.replaceState(null, null, ' ');
    },
    host => host.pageId !== "default"
  );
  discovery.addBadge(
    "Make report",
    () => discovery.setPage("report"),
    host => host.pageId !== "report"
  );
  discovery.addBadge("Settings", () => discovery.setPage("settings"));
  discovery.addBadge(
    "Raw",
    () => discovery.setPage("raw"),
    host => host.pageId !== "raw"
  );
  discovery.addBadge(
    "Copy raw",
    function() {
      const { raw } = discovery.context;
      const div = document.createElement("div");
      div.innerHTML = raw;
      const rawText = div.textContent;
      const el = document.createElement("textarea");
      el.value = rawText;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);

      this.textContent = "Copied!";
      setTimeout(() => {
        this.textContent = "Copy raw";
      }, 700);
    },
    host => {
      if (host.pageId === "raw") {
        document.body.classList.add("no-user-select");
      } else {
        document.body.classList.remove("no-user-select");
      }

      return host.pageId === "raw";
    }
  );

  discovery.setData(options.data, {
    name: options.title,
    raw: options.raw,
    settings,
    createdAt: new Date().toISOString() // TODO fix in discovery
  });

  return discovery;
}
