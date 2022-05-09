import { dataEng, dataRus } from "./data";

class Keyboard {
  constructor() {
    this.flagCaps = false;
    this.flagShift = false;
    this.flagCtrl = false;
    this.lang = null;
    this.wrap = null;
    this.copyboard = "";

    this.init();
  }

  init() {

    this.createDOM();
    this.createDescription();

    document.addEventListener('keydown', (e) => {
      this.keyboardEventEnable(e);
    });

    document.addEventListener('keyup', (e) => {
      this.keyboardEventDisable(e);
    });

    this.someKeys();
    this.getLanguage()
  }

  createDOM = () => {
    this.wrap = null;
    this.wrap = document.createElement("div");
    this.wrap.classList.add("keyboard");

    this.textarea = document.createElement("textarea");
    this.textarea.classList.add("keyboard__textarea");
    this.wrap.appendChild(this.textarea);

    this.keyboard = document.createElement("div");
    this.keyboard.classList.add("keyboard__control");
    this.wrap.appendChild(this.keyboard);

    this.keyboard.addEventListener("click", (e) => {
      this.mouseEvent(e);
    });

    document.body.appendChild(this.wrap);
  }

  cleanDOM = () => {
    this.keyboard.innerHTML = "";
  }

  getLanguage = () => {
    const langStorage = localStorage.getItem("language");
    let lang = "eng";

    if (langStorage) {
      lang = langStorage;
    }

    this.addKeyboard(lang);
  }

  addKeyboard(langKeyboard) {
    this.lang = langKeyboard;

    if (langKeyboard === "eng") {
      this.keyLang = dataEng
    } else {
      this.keyLang = dataRus
    }

    Object.keys(this.keyLang).forEach((keyCode) => {
      this[keyCode] = document.createElement("div");
      this[keyCode].setAttribute("id", `${keyCode}`);

      if (this.keyLang[keyCode].symbol) {
        this[keyCode].innerHTML = this.keyLang[keyCode].symbol;
      } else {
        this[keyCode].innerHTML = `${this.keyLang[keyCode].value}`;
      }

      /* eslint-disable-next-line */
      for (const i of this.keyLang[keyCode].class) {
        this[keyCode].classList.add(i);
      }

      this.keyboard.appendChild(this[keyCode]);
    });
  }

  createDescription = () => {
    const footerNode = document.createElement("div");
    footerNode.classList.add('keyboard__info');

    const message = `
      <p>Тестировалось в Chrome для Windows (версия 101.0.4951.54)</p>
      <p>Переключение языка: <strong>LShift + LAlt</strong></p>
      <p>Связаться: <a href="https://t.me/Kenny_Nobody">Kenny_Nobody</a></p>
    `;

    footerNode.innerHTML = message;
    this.wrap.prepend(footerNode);
  }

  handleEnter = () => {
    const start = this.getPosition('start');
    const end = this.getPosition('end');
    const text = `${this.textarea.value.substring(0, start)}\n${this.textarea.value.substring(end)}`;

    this.textarea.value = text;
    this.textarea.focus();
    this.textarea.selectionEnd = this.getPosition('end') - this.textarea.value.substring(end).length + 1;
    this.textarea.selectionStart = this.getPosition('end') - this.textarea.value.substring(end).length + 1;
  }

  handleCapsLock = (keyDown) => {
    if (!this.flagCaps) {
      for (let k = 0; k < this.keyboard.children.length; k += 1) {
        const key = this.keyboard.children[k];
        if (key.classList.contains("key--letter")) {
          key.textContent = key.textContent.toUpperCase();
        }
      }
    } else {
      keyDown.classList.remove("key--active");

      for (let k = 0; k < this.keyboard.children.length; k += 1) {
        const key = this.keyboard.children[k];
        if (key.classList.contains("key--letter")) {
          key.textContent = key.textContent.toLowerCase();
        }
      }
    }
    this.flagCaps = !this.flagCaps;
  }

  handleTab = () => {
    const start = this.getPosition('start');
    const end = this.getPosition('end');
    const tabSymbol = "    ";
    const text = this.textarea.value.substring(0, start) + tabSymbol + this.textarea.value.substring(end);

    this.textarea.value = text;
    this.textarea.focus();
    this.textarea.selectionEnd = start === end ? end + tabSymbol.length : end;
  }

  handleDelete = () => {
    const start = this.getPosition('start');
    const end = this.getPosition('end');

    const text = (start === end) ? this.textarea.value.substring(0, start) + this.textarea.value.substring(end + 1) : this.textarea.value.substring(0, start) + this.textarea.value.substring(end);

    this.textarea.value = text;
    this.textarea.focus();
    this.textarea.selectionEnd = start;
    this.textarea.selectionStart = start;
  }

  handleArrowLeft = () => {
    const start = this.getPosition('start');

    if (start) {
      this.textarea.selectionEnd = start - 1;
      this.textarea.selectionStart = start - 1;
    }
  }

  handleArrowRight = () => {
    const start = this.getPosition('start');
    const end = this.getPosition('end');

    if (this.flagShift === true) {
      this.textarea.selectionEnd = end + 1;
    } else {
      this.textarea.selectionEnd = start + 1;
      this.textarea.selectionStart = start + 1;
    }
  }

  handleArrowUp = () => {
    const start = this.getPosition('start');
    const end = this.getPosition('end');
    const text = `${this.textarea.value.substring(0, start)}↑${this.textarea.value.substring(end)}`;

    this.setText(text);
    this.textarea.selectionEnd = (start === end) ? end + 1 : end;
  }

  handleArrowDown = () => {
    const start = this.getPosition('start');
    const end = this.getPosition('end');
    const text = `${this.textarea.value.substring(0, start)}↓${this.textarea.value.substring(end)}`;

    this.setText(text);
    this.textarea.selectionEnd = (start === end) ? end + 1 : end;
  }

  handleBackspace = () => {
    const start = this.getPosition('start');
    const end = this.getPosition('end');

    if (start !== 0) {
      const text = (start === end) ? this.textarea.value.substring(0, start - 1) + this.textarea.value.substring(end) : this.textarea.value.substring(0, start) + this.textarea.value.substring(end);

      this.textarea.value = text;
      this.textarea.focus();
      this.textarea.selectionEnd = start - 1;
      this.textarea.selectionStart = start - 1;
    }
  }

  getPosition = (pos) => {
    if (pos === "start") {
      return this.textarea.selectionStart;
    } if (pos === "end") {
      return this.textarea.selectionEnd;
    } 
      return false;
    
  }

  setText = (text) => {
    this.textarea.value = text;
    this.textarea.focus();
  }

  keyHandle = (keyDown) => {

    const { flagShift } = this;
    // const { flagCtrl } = this;
    const keyCode = keyDown.getAttribute("id");
    const { value } = this.keyLang[keyCode];
    const { valueShift } = this.keyLang[keyCode];
    const start = this.getPosition('start');
    const end = this.getPosition('end');

    keyDown.classList.add("key--active");
    this.textarea.focus();

    if (keyCode === "Enter") {
      this.handleEnter();
    } else if (keyCode === "CapsLock") {
      this.handleCapsLock(keyDown);
    } else if (keyCode === "Tab") {
      this.handleTab();
    } else if (keyCode === "Delete") {
      this.handleDelete();
    } else if (keyCode === "ArrowLeft") {
      this.handleArrowLeft();
    } else if (keyCode === "ArrowRight") {
      this.handleArrowRight();
    } else if (keyCode === "ArrowUp") {
      this.handleArrowUp();
    } else if (keyCode === "ArrowDown") {
      this.handleArrowDown();
    } else if (keyCode === "Backspace") {
      this.handleBackspace();
    } else if (flagShift === true && keyCode === "AltLeft") {
      this.changeLanguage();
      this.flagShift = false;
      this.ShiftLeft.classList.remove("key--active");
      this.ShiftRight.classList.remove("key--active");
    } else if (!keyCode.includes("Shift") && !keyCode.includes("Control") && !keyCode.includes("Alt") && !keyCode.includes("Meta")) {

      const inputSymbol = !this.flagCaps ? value : value.toUpperCase();
      const newSymbol = (flagShift === true) ? valueShift : inputSymbol;
      const text = this.textarea.value.substring(0, start) + newSymbol + this.textarea.value.substring(end);

      this.setText(text);
      this.textarea.selectionEnd = (start === end) ? end + newSymbol.length : end;
    }
  }

  keyboardEventEnable = (event) => {
    const keyDown = this[event.code];

    if (!event.code.includes("Shift") && event.flagShift) this.flagShift = true;
    if (!event.code.includes("Control") && event.flagCtrl) this.flagCtrl = true;

    if (keyDown != null) {
      event.preventDefault();
      this.keyHandle(keyDown);
    }
  }

  keyboardEventDisable = (event) => {
    const keyUp = this[event.code];

    if (event.code.includes("Shift")) {
      this.flagShift = false;
      this.ShiftLeft.classList.remove("key--active");
      this.ShiftRight.classList.remove("key--active");
    }

    if (event.code.includes("Control")) {
      this.flagCtrl = false;
      this.ControlLeft.classList.remove("key--active");
      this.ControlRight.classList.remove("key--active");
    }
    if (keyUp != null && event.code !== "CapsLock") {
      keyUp.classList.remove("key--active");
    }
  }

  mouseEvent = (event) => {
    event.stopImmediatePropagation();
    event.preventDefault();

    const keyCode = event.target.getAttribute("id");

    if (!keyCode) return null;

    if (keyCode.includes("Shift")) {
      if (this.ShiftLeft.classList.contains("key--active") || this.ShiftRight.classList.contains("key--active")) {
        this.flagShift = false;
        this.ShiftLeft.classList.remove("key--active");
        this.ShiftRight.classList.remove("key--active");
      } else {
        this.flagShift = true;
      }
    }

    if (keyCode.includes("Control")) {
      if (
        this.ControlLeft.classList.contains("key--active") ||
        this.ControlRight.classList.contains("key--active")
      ) {
        this.flagCtrl = false;
        this.ControlLeft.classList.remove("key--active");
        this.ControlRight.classList.remove("key--active");
      } else this.flagCtrl = true;
    }

    this.keyHandle(event.target);

    if (keyCode !== "CapsLock" && !keyCode.includes("Shift") && !keyCode.includes("Control")) {
      event.target.classList.remove("key--active");
    }

    if (keyCode.includes("Shift") && !this.flagShift) {
      event.target.classList.remove("key--active");
    }

    if (keyCode.includes("Control") && !this.flagCtrl) {
      event.target.classList.remove("key--active");
    }

    return false;
  }

  changeLanguage = () => {
    if (this.lang === 'eng') {
      this.lang = "rus";
    } else {
      this.lang = "eng";
    }

    localStorage.setItem("language", this.lang);

    this.cleanDOM();
    this.addKeyboard(this.lang);
  }

  someKeys = () => {
    const pressed = new Set();

    document.addEventListener("keydown", (event) => {
      event.preventDefault();
      pressed.add(event.code);

      if (pressed.has("ShiftLeft") && pressed.has("AltLeft")) {
        pressed.clear();
        this.changeLanguage();
      }
    });

    document.addEventListener("keyup", (event) => {
      pressed.delete(event.code);
    });
  }
}

export default Keyboard;
