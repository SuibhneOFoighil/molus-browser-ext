export {}

chrome.commands.onCommand.addListener((command) => {
    console.log(`Command: ${command}`);
});

chrome.action.onClicked.addListener((tab) => {
    console.log(`Tab: ${tab}`);
});