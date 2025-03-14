document.addEventListener("DOMContentLoaded", () => {
    const currentURL = window.location.hostname;
    const unblockButton = document.createElement("button");

    unblockButton.innerText = "Allow this site";
    unblockButton.style.position = "fixed";
    unblockButton.style.top = "10px";
    unblockButton.style.right = "10px";
    unblockButton.style.padding = "10px";
    unblockButton.style.backgroundColor = "#4CAF50";
    unblockButton.style.color = "white";
    unblockButton.style.border = "none";
    unblockButton.style.cursor = "pointer";

    document.body.appendChild(unblockButton);

    unblockButton.addEventListener("click", () => {
        chrome.storage.local.get("whitelist", (data) => {
            let whitelist = data.whitelist || [];
            if (!whitelist.includes(currentURL)) {
                whitelist.push(currentURL);
                chrome.storage.local.set({ whitelist: whitelist }, () => {
                    alert(`${currentURL} has been allowed.`);
                    window.location.reload();
                });
            }
        });
    });
});
