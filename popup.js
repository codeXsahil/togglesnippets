// Fetch snippets from Chrome storage and display them in the popup
function loadSnippets() {
  chrome.storage.sync.get("snippets", (data) => {
    const snippets = data.snippets || [];
    const snippetList = document.getElementById("snippet-list");
    snippetList.innerHTML = "";

    snippets.forEach((snippet, index) => {
      const snippetItem = document.createElement("div");
      snippetItem.className = "snippet-item";
      snippetItem.textContent = snippet;
      snippetItem.dataset.index = index;
      snippetItem.addEventListener("click", () => showEditor(index));
      snippetList.appendChild(snippetItem);
    });
  });
}

// Show the editor for a specific snippet
function showEditor(index) {
  chrome.storage.sync.get("snippets", (data) => {
    const snippets = data.snippets || [];
    const snippetContent = snippets[index];

    document.getElementById("snippet-edit-input").value = snippetContent;
    document.getElementById("editor").style.display = "block";
    document.getElementById("save-button").onclick = () => saveSnippet(index);
    document.getElementById("remove-button").onclick = () =>
      removeSnippet(index);
    document.getElementById("cancel-button").onclick = cancelEdit;
  });
}

// Save a new snippet
function addSnippet() {
  const newSnippet = document.getElementById("new-snippet-input").value.trim();
  if (newSnippet) {
    chrome.storage.sync.get("snippets", (data) => {
      const snippets = data.snippets || [];
      snippets.push(newSnippet);

      chrome.storage.sync.set({ snippets }, () => {
        loadSnippets(); // Reload snippets to reflect changes
        document.getElementById("new-snippet-input").value = ""; // Clear input field
      });
    });
  }
}

// Save the edited snippet
function saveSnippet(index) {
  const updatedContent = document
    .getElementById("snippet-edit-input")
    .value.trim();
  chrome.storage.sync.get("snippets", (data) => {
    const snippets = data.snippets || [];
    snippets[index] = updatedContent;

    chrome.storage.sync.set({ snippets }, () => {
      loadSnippets(); // Reload snippets to reflect changes
      cancelEdit(); // Hide editor after saving
    });
  });
}

// Remove a snippet
function removeSnippet(index) {
  chrome.storage.sync.get("snippets", (data) => {
    const snippets = data.snippets || [];
    snippets.splice(index, 1);

    chrome.storage.sync.set({ snippets }, () => {
      loadSnippets(); // Reload snippets to reflect changes
      cancelEdit(); // Hide editor after removing
    });
  });
}

// Hide the editor and clear its content
function cancelEdit() {
  document.getElementById("editor").style.display = "none";
  document.getElementById("snippet-edit-input").value = "";
}

// Event listeners for adding new snippets
document
  .getElementById("add-snippet-button")
  .addEventListener("click", addSnippet);

// Handle toggle switch
document
  .getElementById("toggle-extension")
  .addEventListener("change", (event) => {
    const isEnabled = event.target.checked;
    chrome.storage.sync.set({ enabled: isEnabled });
  });

// Load snippets and extension state on popup open
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["snippets", "enabled"], (data) => {
    if (data.enabled) {
      document.getElementById("toggle-extension").checked = true;
      loadSnippets();
    } else {
      document.getElementById("toggle-extension").checked = false;
    }
  });
});
