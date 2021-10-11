if (!window.inspectorOnAcidsInit) {
  let initialTarget = false;
  let styletag = false;
  let props = [];
  let highlight = false;
  let theme = false;
  let outlineColor = false;
  let wrapper;
  window.inspectorOnAcidsInit = () => {
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
        theme: "default",
        outlineColor: "#E74C3C",
      },
      (items) => {
        props = items.properties;
        highlight = items.showHighlight;
        theme = items.theme;
        outlineColor = items.outlineColor;
        init();
      }
    );
    const documentSize = (dir) => {
      if (dir === "height") {
        return Math.max(
          document.documentElement.clientHeight || 0,
          window.innerHeight || 0
        );
      } else {
        return Math.max(
          document.documentElement.clientWidth || 0,
          window.innerWidth || 0
        );
      }
    };
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
      wrapper.remove();
      styletag.remove();
      wrapper.remove();
      window.removeEventListener("mousemove", window.fontInspectorActive);
      window.removeEventListener("keydown", window.destroyInspector);
      if (highlight && initialTarget) {
        initialTarget.style.outline = "";
        highlight = false;
      }
      styletag = false;
      wrapper = false;
      initialTarget = false;
      delete window.destroyInspector;
      delete window.fontInspectorActive;
      delete window.inspectorOnAcidsInit;
    };
    const setPopupPosition = (sel, event) => {
      const height = documentSize("height");
      const width = documentSize("width");
      if (event.clientY + sel.clientHeight < height) {
        if (sel.style.bottom) sel.style.bottom = "";
        sel.style.top = `${event.clientY + 10}px`;
      } else {
        if (sel.style.top) sel.style.top = "";
        sel.style.bottom = `${-(event.clientY - height) + 10}px`;
      }
      if (event.clientX + sel.clientWidth < width) {
        if (sel.style.right) sel.style.right = "";
        sel.style.left = `${event.clientX + 10}px`;
      } else {
        if (sel.style.left) sel.style.left = "";
        sel.style.right = `${-(event.clientX - width) + 10}px`;
      }
    };
    const highlightElement = (target) => {
      if (target === initialTarget || !highlight) return;
      if (initialTarget) initialTarget.style.outline = "";
      initialTarget = target;
      initialTarget.style.outline = `1px solid ${outlineColor}`;
    };
    const init = () => {
      if (window.fontInspectorActive) return removeAll();
      window.destroyInspector = (e) => {
        if (e.key === "Escape") {
          removeAll();
        }
      };
      window.fontInspectorActive = (e) => {
        highlightElement(e.target);
        const printHeading = () => {
          let output = "";
          output += `<p class="inspector-mark-tag">&lt;${e.target.tagName}&gt;`;
          if (e.target.id) {
            output += `<span class="inspector-mark-ids">#${e.target.id}</span>`;
          }
          e.target.classList.forEach((el) => {
            output += `<span class="inspector-mark-classes">.${el}</span>`;
          });
          output += `<span class="inspector-element-size">${e.target.offsetWidth}x${e.target.offsetHeight}</span>`;
          output += "</p>";
          return output;
        };
        const printProperties = () => {
          let output = "";
          props.forEach((item) => {
            output += `<p class="inspector-mark-line"><small>${item}</small> <span>${css(
              e.target,
              item
            )}</span></p>`;
          });
          return output;
        };
        if (!wrapper) return;
        wrapper.innerHTML = printHeading() + printProperties();
        setPopupPosition(wrapper, e);
      };
      wrapper = document.createElement("div");
      styletag = document.createElement("link");
      styletag.id = "style-selector";
      const cssSource = () => {
        if (
          (theme === "default" &&
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark").matches) ||
          theme === "dark"
        ) {
          return "css/dark.css";
        } else {
          return "css/light.css";
        }
      };
      styletag.href = chrome.runtime.getURL(cssSource());
      styletag.rel = "stylesheet";
      wrapper.id = "text-detector";
      wrapper.classList.add("text-detector-wrapper");
      document.head.appendChild(styletag);
      document.body.appendChild(wrapper);
      window.addEventListener("mousemove", window.fontInspectorActive);
      window.addEventListener("keydown", window.destroyInspector);
    };
  };
}
window.inspectorOnAcidsInit();
