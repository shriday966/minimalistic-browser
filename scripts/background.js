chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get("allowedSites", (data) => {
        let allowedSites = data.allowedSites || [];
        updateBlockingRules(allowedSites);
    });
});

function updateBlockingRules(allowedSites) {
    let rules = [
        {
            id: 1, // Block all sites by default
            priority: 1,
            action: { type: "block" },
            condition: { urlFilter: "*://*/*", resourceTypes: ["main_frame"] }
        },
        ...allowedSites.map((site, index) => ({
            id: index + 2,
            priority: 1,
            action: { type: "allow" },
            condition: { urlFilter: site, resourceTypes: ["main_frame"] }
        }))
    ];

    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: rules.map((r) => r.id),
        addRules: rules
    });
}
