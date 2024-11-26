import { Settings, Schedule } from '../types';

const DEFAULT_SETTINGS: Settings = {
  blockedSites: [],
  schedules: [],
  customBlockPage: {
    title: 'Site Blocked',
    message: 'This site is currently blocked',
    backgroundColor: '#f8f9fa',
    textColor: '#212529'
  },
  isEnabled: true
};

// Extract domain from URL or domain string
function extractDomain(url: string): string {
  try {
    // If it's already a domain without protocol, just clean it
    if (!url.includes('://')) {
      return url.replace(/^www\./, '').toLowerCase().trim();
    }
    // Otherwise parse it as a URL
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '').toLowerCase().trim();
  } catch (e) {
    console.error('Error parsing URL:', e);
    return '';
  }
}

// Check if current time is within any active schedule
function isWithinSchedule(schedules: Schedule[]): boolean {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.toLocaleTimeString('en-US', { hour12: false });

  return schedules.some(schedule => {
    if (!schedule.enabled) return false;
    if (!schedule.days.includes(currentDay)) return false;

    const start = schedule.startTime;
    const end = schedule.endTime;

    return currentTime >= start && currentTime <= end;
  });
}

// Check if URL matches any blocked site pattern
function isBlockedSite(url: string, blockedSites: string[]): boolean {
  const targetDomain = extractDomain(url);
  if (!targetDomain) return false;

  return blockedSites.some(site => {
    const siteDomain = extractDomain(site);
    return targetDomain === siteDomain || targetDomain.endsWith('.' + siteDomain);
  });
}

// Update blocking rules
async function updateBlockingRules() {
  const { settings } = await chrome.storage.sync.get(['settings']) as { settings: Settings };
  const currentSettings = settings || DEFAULT_SETTINGS;

  // Remove all rules first
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const existingRuleIds = existingRules.map(rule => rule.id);
  if (existingRuleIds.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingRuleIds
    });
  }

  // Don't add rules if blocking is disabled or no sites to block
  if (!currentSettings.isEnabled || !currentSettings.blockedSites.length) {
    return;
  }

  // Only block if within schedule or no schedules are set
  if (currentSettings.schedules.length > 0 && !isWithinSchedule(currentSettings.schedules)) {
    return;
  }

  // Create rules for each blocked site
  const rules = currentSettings.blockedSites.map((site, index) => {
    const blockPage = chrome.runtime.getURL('block.html');
    const domain = extractDomain(site);
    return {
      id: index + 1,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
        redirect: { url: blockPage }
      },
      condition: {
        urlFilter: `||${domain}^`,
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME]
      }
    };
  });

  if (rules.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules
    });
  }
}

// Update rules periodically
setInterval(updateBlockingRules, 30000); // Check every 30 seconds

// Handle navigation events for backup
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  // Only handle main frame navigation
  if (details.frameId !== 0) return;

  const blockPage = chrome.runtime.getURL('block.html');
  if (details.url === blockPage) return;

  const { settings } = await chrome.storage.sync.get(['settings']) as { settings: Settings };
  const currentSettings = settings || DEFAULT_SETTINGS;

  if (!currentSettings.isEnabled) return;

  if (isBlockedSite(details.url, currentSettings.blockedSites) &&
      (currentSettings.schedules.length === 0 || isWithinSchedule(currentSettings.schedules))) {
    chrome.tabs.update(details.tabId, {
      url: blockPage
    });
  }
});

// Handle extension installation or update
chrome.runtime.onInstalled.addListener(async () => {
  const { settings } = await chrome.storage.sync.get(['settings']) as { settings: Settings };
  if (!settings) {
    await chrome.storage.sync.set({ settings: DEFAULT_SETTINGS });
  }
  await updateBlockingRules();
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_SETTINGS') {
    chrome.storage.sync.get(['settings'], (result) => {
      sendResponse({ settings: result.settings || DEFAULT_SETTINGS });
    });
    return true;
  }

  if (request.type === 'UPDATE_SETTINGS') {
    chrome.storage.sync.set({ settings: request.settings }, async () => {
      await updateBlockingRules();
      sendResponse({ success: true });
    });
    return true;
  }
});
