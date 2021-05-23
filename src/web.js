if (!window.inspectorOnAcidsInit) {
  window.inspectorOnAcidsInit = () => {
    "use strict";
    let styleselector = false;
    let selector = false;
    let initialTarget = false;
    let props = [];
    let highlight = false;
    let showDarkTheme = false;

    chrome.storage.sync.get(
      {
        properties: [
          "font-family",
          "font-size",
          "font-weight",
          "line-height",
          "letter-spacing",
          "color",
        ],
        showHighlight: true,
        showDarkTheme: false,
      },
      (items) => {
        props = items.properties;
        highlight = items.showHighlight;
        showDarkTheme = items.showDarkTheme;
        init();
      }
    );
    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
    const vh = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );
    const convertRgb = (rgb) => {
      const output = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)\)$/);
      const parser = (index) =>
        ("0" + parseInt(output[index], 10).toString(16)).slice(-2);
      return (
        "#" +
        parser(1) +
        parser(2) +
        parser(3) +
        ` <span class="inspector-color-pick" style="background-color: ${rgb}"></span>`
      );
    };

    const css = (element, property) => {
      const value = window
        .getComputedStyle(element, null)
        .getPropertyValue(property);
      return value.replace(/rgb\([^\)]+\)/g, convertRgb);
    };
    const removeAll = () => {
      document.querySelector(".text-detector-wrapper").remove();
      document.getElementById("style-selector").remove();
      window.removeEventListener("mousemove", window.fontInspectorActive);
      delete window.fontInspectorActive;
      if (highlight) {
        initialTarget.style.outline = "";
        highlight = false;
      }
      styleselector = false;
      selector = false;
      initialTarget = false;
      delete window.inspectorOnAcidsInit;
      chrome.runtime.sendMessage("disable");
    };
    const setPopupPosition = (selector, event) => {
      event.clientY + selector.clientHeight < vh
        ? (selector.style.top = `${event.clientY + 10}px`)
        : (selector.style.top = `${vh - selector.clientHeight + 10}px`);
      if (event.clientX + selector.clientWidth < vw) {
        if (selector.style.right) {
          selector.style.right = "";
        }
        selector.style.left = `${event.clientX + 10}px`;
      } else {
        if (selector.style.left) {
          selector.style.left = "";
        }
        selector.style.right = `${-(event.clientX - vw) + 10}px`;
      }
    };
    const init = () => {
      if (window.fontInspectorActive) return removeAll();
      let wrapper;
      window.fontInspectorActive = (e) => {
        if (e.target !== initialTarget && highlight) {
          if (initialTarget) {
            initialTarget.style.outline = "";
          }
          e.target.style.outline = "1px solid red";
          initialTarget = e.target;
        }
        if (selector) {
          let output = "";
          selector.innerHTML = "";
          output += `<p class="inspector-mark-tag">&lt;${e.target.tagName}&gt;`;
          if (e.target.id) {
            output += `<span class="inspector-mark-ids">#${e.target.id}</span>`;
          }
          if (e.target.classList.length) {
            e.target.classList.forEach((el) => {
              output += `<span class="inspector-mark-classes">.${el}</span>`;
            });
            output += "</p>";
          } else {
            output += "</p>";
          }
          props.forEach((item) => {
            output += `<p class="inspector-mark-line"><small>${item}</small> <span>${css(
              e.target,
              item
            )}</span></p>`;
          });
          selector.innerHTML = output;
          setPopupPosition(selector, e);
        }
      };
      wrapper = document.createElement("div");
      styleselector = document.createElement("link");
      styleselector.id = "style-selector";
      styleselector.href = chrome.runtime.getURL(
        showDarkTheme ? "css/dark.css" : "css/light.css"
      );
      styleselector.rel = "stylesheet";
      wrapper.id = "text-detector";
      wrapper.classList.add("text-detector-wrapper");
      document.head.appendChild(styleselector);
      document.body.appendChild(wrapper);
      if (!selector) {
        selector = wrapper;
      }
      window.addEventListener("mousemove", window.fontInspectorActive);
      window.addEventListener("keydown", function handler(e) {
        if (e.key === "Escape") {
          e.currentTarget.removeEventListener(e.type, handler);
          removeAll();
        }
      });
    };
  };
}
window.inspectorOnAcidsInit();
