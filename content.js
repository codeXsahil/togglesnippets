// Function to create a dropdown
function createDropdown(inputElement, snippets) {
  if (
    inputElement.nextSibling &&
    inputElement.nextSibling.className === "snippet-dropdown"
  ) {
    return; // Prevent multiple dropdowns on the same element
  }

  const dropdown = document.createElement("select");
  dropdown.className = "snippet-dropdown";

  const defaultOption = document.createElement("option");
  defaultOption.text = "Select Snippet";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  dropdown.add(defaultOption);

  snippets.forEach((snippet) => {
    const option = document.createElement("option");
    option.text = snippet;
    option.value = snippet;
    dropdown.add(option);
  });

  dropdown.addEventListener("focus", function () {
    inputElement.focus(); // Ensure the input field is focused
  });

  dropdown.addEventListener("change", function () {
    if (this.value) {
      // Insert the selected snippet into the input field
      inputElement.value = this.value;
      inputElement.dispatchEvent(new Event("input")); // Trigger input event to mimic user typing
      this.selectedIndex = 0; // Reset the dropdown to the default option
    }
  });

  // Insert the dropdown after the input element
  inputElement.parentElement.insertBefore(dropdown, inputElement.nextSibling);
}

// Function to remove all dropdowns from the page
function removeDropdowns() {
  document.querySelectorAll(".snippet-dropdown").forEach((dropdown) => {
    dropdown.parentElement.removeChild(dropdown);
  });
}

// Function to apply dropdowns to all relevant input fields
function applyDropdowns(snippets) {
  const inputs = document.querySelectorAll(
    'input[type="text"]:not(.dropdown-applied), textarea:not(.dropdown-applied)'
  );

  inputs.forEach((input) => {
    if (input.offsetParent !== null && !input.disabled) {
      createDropdown(input, snippets);
      input.classList.add("dropdown-applied"); // Mark as processed
    }
  });
}

// Fetch snippets from Chrome storage and apply or remove dropdowns
function loadSnippetsAndApplyDropdowns() {
  chrome.storage.sync.get(["snippets", "enabled"], (data) => {
    if (data.enabled) {
      const snippets = data.snippets || [];
      applyDropdowns(snippets);
    } else {
      removeDropdowns();
    }
  });
}

// Apply dropdowns or remove them when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", loadSnippetsAndApplyDropdowns);

// Observe changes in the DOM and apply or remove dropdowns accordingly
const observer = new MutationObserver(loadSnippetsAndApplyDropdowns);
observer.observe(document.body, { childList: true, subtree: true });

// Initial application or removal of dropdowns
loadSnippetsAndApplyDropdowns();
