// Circuits Lab's front page: the two breadboard benches, Lab 7 and Lab 8.
import "../assets/css/metahub-app-shell.css";
import "../assets/css/metahub-lab-theme.css";
import "./home.css";
import { mountLabShell } from "../assets/js/metahub-app-shell.js";

mountLabShell({
  host: document.getElementById("circuits-bar"),
  title: "Circuits Lab",
  notes: "/projects/circuits-lab/",
});
