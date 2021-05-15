chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setInterface,
  });
});

// The body of this function will be executed as a content script inside the
// current page
const setInterface = () => {
  let selector = false;
  let initialTarget = false;
  let props = [];
  chrome.storage.sync.get(
    {
      properties: [],
    },
    (items) => {
      props = items.properties;
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
  // let selectorStyle = false;
  const css = (element, property) => {
    return window.getComputedStyle(element, null).getPropertyValue(property);
  };
  const removeAll = () => {
    document.querySelector(".text-detector-wrapper").remove();
    window.removeEventListener("mousemove", window.fontInspectorActive);
    delete window.fontInspectorActive;
    initialTarget.style.outline = "";
  };
  const setPopupPosition = (selector, event) => {
    if (event.clientY + selector.clientHeight < vh) {
      selector.style.top = `${event.clientY + 10}px`;
    } else {
      selector.style.top = `${vh - selector.clientHeight + 10}px`;
    }
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
  // let link;
  let wrapper;
  if (!window.fontInspectorActive) {
    window.fontInspectorActive = (e) => {
      if (e.target !== initialTarget) {
        if (initialTarget) {
          initialTarget.style.outline = "";
        }
        e.target.style.outline = "1px solid red";
        initialTarget = e.target;
      }
      if (selector) {
        let output = "";
        selector.innerHTML = "";
        output += `<p><small>tag-name</small> ${e.target.tagName}</p>`;
        output += `<p><small>classes</small> ${
          e.target.getAttribute("class") ||
          '<span class="inspect-disabled-item">-- undefined --</span>'
        }</p>`;
        props.forEach((item) => {
          output += `<p><small>${item}</small> ${css(e.target, item)}</p>`;
        });
        selector.innerHTML = output;
        setPopupPosition(selector, e);
      }
    };
    wrapper = document.createElement("div");
    wrapper.classList.add("text-detector-wrapper");
    wrapper.id = "text-detector";
    wrapper.style.backgroundColor = "black";
    document.body.appendChild(wrapper);
    selector = wrapper;
    window.addEventListener("mousemove", window.fontInspectorActive);
    window.addEventListener("keydown", function handler(e) {
      if (e.key === "Escape") {
        removeAll();
        e.currentTarget.removeEventListener(e.type, handler);
      }
    });
  } else {
    removeAll();
  }
};
