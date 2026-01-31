// Content script for AI Content Idea Validator
// This script runs on all pages and listens for messages from the background script

// Platform detection (used for auto-fill)
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

// Get current platform
function getCurrentPlatform() {
  const hostname = window.location.hostname;
  return platformMap[hostname] || null;
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelectedText') {
    const selectedText = window.getSelection().toString().trim();
    const platform = getCurrentPlatform();
    sendResponse({ 
      text: selectedText,
      platform: platform
    });
  }
  return true;
});

// Optional: Add keyboard shortcut (Ctrl/Cmd + Shift + V)
document.addEventListener('keydown', async (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'V') {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      const platform = getCurrentPlatform();
      
      // Store and open popup
      await chrome.storage.local.set({
        selectedText: selectedText,
        detectedPlatform: platform
      });
      
      // Note: Can't open popup from content script directly
      // User needs to click the extension icon
    }
  }
});
