chrome.runtime.onInstalled.addListener(() => {
    console.log('Snippet Manager Installed');
    chrome.storage.local.set({enabled: true});
});

chrome.action.onClicked.addListener((tab) => {
    chrome.storage.local.get("enabled", (data) => {
        const enabled = data.enabled !== false;
        chrome.storage.local.set({enabled: !enabled});
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: toggleExtension,
            args: [!enabled]
        });
    });
});

function toggleExtension(enabled) {
    if (enabled) {
        document.body.classList.remove('snippet-manager-disabled');
    } else {
        document.body.classList.add('snippet-manager-disabled');
    }
}
