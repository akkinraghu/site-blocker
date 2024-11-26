interface BlockedSite {
  url: string;
  enabled: boolean;
}

interface Schedule {
  enabled: boolean;
  days: number[];
  startTime: string;
  endTime: string;
}

interface CustomBlockPage {
  title: string;
  message: string;
  backgroundColor: string;
  textColor: string;
}

interface Settings {
  blockedSites: BlockedSite[];
  schedules: Schedule[];
  customBlockPage: CustomBlockPage;
  isEnabled: boolean;
}

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

function extractDomain(url: string): string {
  try {
    if (url.includes('://')) {
      return new URL(url).hostname.replace(/^www\./, '').toLowerCase().trim();
    }
    return url.replace(/^www\./, '').toLowerCase().trim();
  } catch (error) {
    console.error('Error parsing URL:', error);
    return '';
  }
}

function isWithinSchedule(schedules: Schedule[]): boolean {
  const now = new Date();
  const day = now.getDay();
  const time = now.toLocaleTimeString('en-US', { hour12: false });

  return schedules.some(schedule => {
    if (!schedule.enabled) return false;
    if (!schedule.days.includes(day)) return false;
    const start = schedule.startTime;
    const end = schedule.endTime;
    return time >= start && time <= end;
  });
}

function shouldBlockUrl(url: string, blockedSites: BlockedSite[]): boolean {
  const domain = extractDomain(url);
  if (!domain) return false;

  return blockedSites.some(site => {
    if (!site.enabled) return false;
    const blockedDomain = extractDomain(site.url);
    return domain === blockedDomain || domain.endsWith('.' + blockedDomain);
  });
}

async function updateBlockRules(): Promise<void> {
  const { settings } = await chrome.storage.sync.get(['settings']);
  const currentSettings: Settings = settings || DEFAULT_SETTINGS;

  // Remove existing rules
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const ruleIds = existingRules.map(rule => rule.id);
  if (ruleIds.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIds
    });
  }

  // If blocking is disabled or no sites to block, return
  if (!currentSettings.isEnabled || !currentSettings.blockedSites.length) return;

  // Check schedule if any
  if (currentSettings.schedules.length > 0 && !isWithinSchedule(currentSettings.schedules)) return;

  // Create new rules for each blocked site
  const rules = currentSettings.blockedSites
    .filter(site => site.enabled)
    .map((site, index) => {
      const blockPageUrl = chrome.runtime.getURL('block.html');
      const domain = extractDomain(site.url);
      
      return {
        id: index + 1,
        priority: 1,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
          redirect: { url: blockPageUrl }
        },
        condition: {
          urlFilter: domain,
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
setInterval(updateBlockRules, 30000);

// Listen for navigation events
chrome.webNavigation.onBeforeNavigate.addListener(async details => {
  if (details.frameId !== 0) return;

  const blockPageUrl = chrome.runtime.getURL('block.html');
  if (details.url === blockPageUrl) return;

  const { settings } = await chrome.storage.sync.get(['settings']);
  const currentSettings: Settings = settings || DEFAULT_SETTINGS;

  if (
    currentSettings.isEnabled &&
    shouldBlockUrl(details.url, currentSettings.blockedSites) &&
    (currentSettings.schedules.length === 0 || isWithinSchedule(currentSettings.schedules))
  ) {
    chrome.tabs.update(details.tabId, { url: blockPageUrl });
  }
});

// Initialize settings on install
chrome.runtime.onInstalled.addListener(async () => {
  const { settings } = await chrome.storage.sync.get(['settings']);
  if (!settings) {
    await chrome.storage.sync.set({ settings: DEFAULT_SETTINGS });
  }
  await updateBlockRules();
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message: any, sender, sendResponse) => {
  if (message.type === 'GET_SETTINGS') {
    chrome.storage.sync.get(['settings'], (result) => {
      sendResponse({ settings: result.settings || DEFAULT_SETTINGS });
    });
    return true;
  }

  if (message.type === 'UPDATE_SETTINGS') {
    chrome.storage.sync.set({ settings: message.settings }, async () => {
      await updateBlockRules();
      sendResponse({ success: true });
    });
    return true;
  }
});
