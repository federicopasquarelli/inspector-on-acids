function init_options() {
  return new Promise((resolve, reject) => {
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
        outlineColor: "#E74C3C",
      },
      (items) => {
        $.getJSON("/plugins/css-properties.json", function (data) {
          let selectOptions = "";
          Object.entries(data).forEach((el) => {
            selectOptions += `<option name="${el[0]}" ${items.properties.includes(el[0]) ? "selected" : ""
              }>${el[0]}</option>`;
          });
          $("#select").html(selectOptions);
          $("#outline-color").val(items.outlineColor);
          items.showHighlight && $("#show-hightlight").attr("checked", true);
          items.showDarkTheme && $("#show-dark-theme").attr("checked", true);
          $("#options-page-settings")
            .find("input")
            .on("change", function () {
              $(this).submit();
            });
          resolve(items.properties);
        }).fail(function () {
          console.log("An error has occurred.");
          reject();
        });
      }
    );
  });
}
$(document).ready(function () {
  init_options().then(() => {
    $("#select").select2();
    $("#select").on("select2:select select2:unselect", function (e) {
      console.log("select");
      $("#options-page-form").submit();
    });
    $(".colorPickSelector").colorPick({
      initialColor: $("#outline-color").val(),
      allowRecent: true,
      recentMax: 5,
      allowCustomColor: false,
      palette: [
        "#1abc9c",
        "#16a085",
        "#2ecc71",
        "#27ae60",
        "#3498db",
        "#2980b9",
        "#9b59b6",
        "#8e44ad",
        "#34495e",
        "#2c3e50",
        "#f1c40f",
        "#f39c12",
        "#e67e22",
        "#d35400",
        "#e74c3c",
        "#c0392b",
        "#ecf0f1",
        "#bdc3c7",
        "#95a5a6",
        "#7f8c8d",
      ],
      onColorSelected: function () {
        this.element.css({ backgroundColor: this.color });
        if (this.color !== $("#outline-color").val()) {
          $("#outline-color").val(this.color);
          $("#outline-color").change();
        }
      },
    });
    $("#options-page-settings").on("submit", function (e) {
      e.preventDefault();
      const findOption = (key) =>
        $(this)
          .serializeArray()
          .findIndex((el) => el.name === key) > -1;

      chrome.storage.sync.set(
        {
          showHighlight: findOption("show-highlight"),
          showDarkTheme: findOption("show-dark-theme"),
          outlineColor: $("#outline-color").val(),
        },
        function () {
          console.log("preferences updated");
        }
      );
    });
    $("#options-page-form").on("submit", function (e) {
      e.preventDefault();
      const formdata = $(this).serializeArray();
      chrome.storage.sync.set(
        {
          properties: formdata.map((el) => el.value),
        },
        function () {
          console.log("preferences updated");
        }
      );
    });
  });
});
