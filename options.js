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
          let selectOptions = "";
          Object.entries(data).forEach((el) => {
            selectOptions += `<option name="${el[0]}" ${
              items.properties.includes(el[0]) ? "selected" : ""
            }>${el[0]}</option>`;
          });
          $("#select").html(selectOptions);
          $("#select").select2({
            tags: true,
          });
          $("#select").on("select2:select select2:unselect", function (e) {
            $("#options-page-form").submit();
          });
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
  });
});
