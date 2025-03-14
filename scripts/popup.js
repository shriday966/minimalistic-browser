document.addEventListener("DOMContentLoaded", () => {
    const siteInput = document.getElementById("siteInput");
    const addSiteButton = document.getElementById("addSite");
    const allowedSitesList = document.getElementById("allowedSites");

    // Load allowed sites from storage
    chrome.storage.local.get("allowedSites", (data) => {
        const sites = data.allowedSites || [];
        sites.forEach((site) => addSiteToList(site));
    });

    // Add site to allowlist
    addSiteButton.addEventListener("click", () => {
        let site = siteInput.value.trim();
        if (!site) return;

        site = `*://${site}/*`; // Convert to wildcard pattern
        chrome.storage.local.get("allowedSites", (data) => {
            let sites = data.allowedSites || [];
            if (!sites.includes(site)) {
                sites.push(site);
                chrome.storage.local.set({ allowedSites: sites }, () => {
                    addSiteToList(site);
                    updateBlockingRules(sites);
                });
            }
        });
        siteInput.value = "";
    });

    function addSiteToList(site) {
        const li = document.createElement("li");
        li.textContent = site.replace("*://", "").replace("/*", "");
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "❌";
        removeBtn.addEventListener("click", () => removeSite(site, li));
        li.appendChild(removeBtn);
        allowedSitesList.appendChild(li);
    }

    function removeSite(site, listItem) {
        chrome.storage.local.get("allowedSites", (data) => {
            let sites = data.allowedSites || [];
            sites = sites.filter((s) => s !== site);
            chrome.storage.local.set({ allowedSites: sites }, () => {
                listItem.remove();
                updateBlockingRules(sites);
            });
        });
    }

    function updateBlockingRules(allowedSites) {
        let rules = allowedSites.map((site, index) => ({
            id: index + 2, // Avoid conflict with blocking rule (ID=1)
            priority: 1,
            action: { type: "allow" },
            condition: { urlFilter: site, resourceTypes: ["main_frame"] }
        }));

        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: rules.map((r) => r.id),
            addRules: rules
        });
    }
});
