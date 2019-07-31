import { initDiscovery } from "./setupDiscovery";
let json = { x: true };
let raw = JSON.stringify(json);

document.body.innerHTML = "";

const wrapper = document.createElement("div");
wrapper.classList.add("discovery");

document.body.appendChild(wrapper);

wrapper.style["background-color"] = "#fff";

initDiscovery({
  wrapper,
  raw,
  data: json,
  settings: {}
});
