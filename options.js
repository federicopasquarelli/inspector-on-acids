function createInputField(name, value) {
  return `<div class="flex mt-6">
      <label class="flex items-center" for="form-input-${name}">
        <input type="checkbox" class="form-checkbox" id="form-input-${name}" ${
    value ? "checked" : ""
  } name="${name}" />
        <span class="ml-2">${name}</span>
      </label>
    </div>`;
}
function createSubmitButton() {
  return `<div class="flex mt-6">
    <input type="submit" class="btn-primary transition duration-300 ease-in-out focus:outline-none focus:shadow-outline bg-purple-700 hover:bg-purple-900 text-white font-normal py-2 px-4 mr-1 rounded block" value="Save" />
    </div>`;
}
function init_options() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(
      {
        properties: [],
      },
      (items) => {
        $.getJSON("css-properties.json", function (data) {
          let selectOptions = [];
          $("#select").multiselect({
            columns: 1, // how many columns should be use to show options
            search: false, // include option search box

            // search filter options
            searchOptions: {
              delay: 250, // time (in ms) between keystrokes until search happens
              showOptGroups: false, // show option group titles if no options remaining
              searchText: true, // search within the text
              searchValue: false, // search within the value
              onSearch: function (element) {}, // fires on keyup before search on options happens
            },

            // plugin texts
            texts: {
              placeholder: "Select options", // text to use in dummy input
              search: "Search", // search input placeholder text
              selectedOptions: " selected", // selected suffix text
              selectAll: "Select all", // select all text
              unselectAll: "Unselect all", // unselect all text
              noneSelected: "None Selected", // None selected text
            },

            // general options
            selectAll: false, // add select all option
            selectGroup: false, // select entire optgroup
            minHeight: 200, // minimum height of option overlay
            maxHeight: null, // maximum height of option overlay
            maxWidth: null, // maximum width of option overlay (or selector)
            maxPlaceholderWidth: null, // maximum width of placeholder button
            maxPlaceholderOpts: 10, // maximum number of placeholder options to show until "# selected" shown instead
            showCheckbox: true, // display the checkbox to the user
            optionAttributes: [], // attributes to copy to the checkbox from the option element

            // Callbacks
            onLoad: function (element) {}, // fires at end of list initialization
            onOptionClick: function (element, option) {
             $("#options-page-form").submit();
            }, // fires when an option is clicked
            onControlClose: function (element) {}, // fires when the options list is closed
            onSelectAll: function (element, selected) {}, // fires when (un)select all is clicked
            onPlaceholder: function (element, placeholder, selectedOpts) {}, // fires when the placeholder txt is up<a href="https://www.jqueryscript.net/time-clock/">date</a>d

            // @NOTE: these are for future development
            minSelect: false, // minimum number of items that can be selected
            maxSelect: false, // maximum number of items that can be selected
          });

          Object.entries(data).forEach((el) => {
            selectOptions.push({
              name: el[0],
              value: el[0],
              checked: items.properties.includes(el[0]),
            });
          });
          $("#select").multiselect("settings", { columns: 2 });
          $("#select").multiselect("loadOptions", selectOptions);
        }).fail(function () {
          console.log("An error has occurred.");
        });
        resolve(items.properties);
      }
    );
  });
}
$(document).ready(function () {
  init_options().then((items) => {
    // Methods

    // add

    // remove
    $("#options-page-form").on("submit", function (e) {
      e.preventDefault();
      const formdata = $(this).serializeArray();
      chrome.storage.sync.set(
        {
          properties: formdata.map((el) => el.value),
        },
        function () {
          iziToast.show({
            title: "Saved!",
            message: "Your preferences have been updated",
            color: "green",
          });
        }
      );
    });
    // $("#add-new-option").on("submit", function (e) {
    //   e.preventDefault();
    //   const input = $("#new-property").val();
    //   if (
    //     !input ||
    //     items.findIndex((el) => el.name === $("#new-property").val()) > -1
    //   ) {
    //     iziToast.show({
    //       title: "Enter a css property",
    //       message: "enter a valid css property name",
    //       color: "red",
    //     });
    //     return;
    //   }
    //   $(createInputField($("#new-property").val(), true)).insertBefore(
    //     $("#options-page-form input[type='submit']").parent()
    //   );
    //   const output = [
    //     ...items,
    //     {
    //       name: $("#new-property").val(),
    //       value: "on",
    //     },
    //   ];
    //   chrome.storage.sync.set(
    //     {
    //       properties: output,
    //     },
    //     function () {
    //       iziToast.show({
    //         title: "Saved!",
    //         message: "Your preferences have been updated",
    //         color: "green",
    //       });
    //     }
    //   );
    // });
    $("#clear").on("click", function (e) {
      e.preventDefault();
      chrome.storage.sync.remove("properties", function (Items) {
        iziToast.show({
          title: "preferences cleared!",
          message: "Your preferences have been cleared",
          color: "green",
        });
      });
    });
  });
});
