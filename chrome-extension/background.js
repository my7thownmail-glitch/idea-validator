// Platform detection map
const platformMap = {
  'youtube.com': 'youtube-shorts',
  'www.youtube.com': 'youtube-shorts',
  'tiktok.com': 'tiktok',
  'www.tiktok.com': 'tiktok',
  'instagram.com': 'instagram-reels',
  'www.instagram.com': 'instagram-reels',
  'twitter.com': 'x',
  'www.twitter.com': 'x',
  'x.com': 'x',
  'www.x.com': 'x',
  'linkedin.com': 'linkedin',
  'www.linkedin.com': 'linkedin'
};

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'validate-idea',
    title: 'Validate with Idea Validator',
    contexts: ['selection']
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'validate-idea' && info.selectionText) {
    // Detect platform from URL
    let detectedPlatform = null;
    if (tab && tab.url) {
      try {
        const url = new URL(tab.url);
        detectedPlatform = platformMap[url.hostname] || null;
      } catch (e) {
        console.log('Could not parse URL');
      }
    }

    // Store selected text and platform
    await chrome.storage.local.set({
      selectedText: info.selectionText.trim(),
      detectedPlatform: detectedPlatform
    });

    // Open popup
    chrome.action.openPopup();
  }
});
