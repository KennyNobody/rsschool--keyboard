import "../css/normalize.scss";
import "../css/main.scss";
import Keyboard from "./keyboard";

document.addEventListener('DOMContentLoaded', () => {
  window.app = new Keyboard();
});