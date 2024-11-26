import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface BlockedSite {
  url: string;
  enabled: boolean;
}

const BlockedSites: React.FC = () => {
  const [sites, setSites] = useState<BlockedSite[]>([]);
  const [newSite, setNewSite] = useState('');

  useEffect(() => {
    chrome.storage.sync.get(['settings'], (result) => {
      if (result.settings?.blockedSites) {
        setSites(result.settings.blockedSites);
      }
    });
  }, []);

  const updateSites = (newSites: BlockedSite[]) => {
    chrome.storage.sync.get(['settings'], (result) => {
      const settings = result.settings || {};
      chrome.storage.sync.set({
        settings: { ...settings, blockedSites: newSites }
      });
    });
  };

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSite.trim()) return;

    const cleanedUrl = newSite.trim().toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '');

    const site: BlockedSite = {
      url: cleanedUrl,
      enabled: true
    };

    const newSites = [...sites, site];
    setSites(newSites);
    updateSites(newSites);
    setNewSite('');
  };

  const handleRemoveSite = (index: number) => {
    const newSites = sites.filter((_, i) => i !== index);
    setSites(newSites);
    updateSites(newSites);
  };

  const handleToggleSite = (index: number) => {
    const newSites = sites.map((site, i) =>
      i === index ? { ...site, enabled: !site.enabled } : site
    );
    setSites(newSites);
    updateSites(newSites);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter website URL (e.g., facebook.com)"
          value={newSite}
          onChange={(e) => setNewSite(e.target.value)}
          className="flex-grow h-8 px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={handleAddSite}
          className="h-8 px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
        >
          Add Site
        </button>
      </div>

      <div className="space-y-2">
        {sites.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No sites blocked. Add a site to start blocking.
          </p>
        ) : (
          sites.map((site, index) => (
            <div key={index} className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded">
              <span className="text-sm truncate flex-grow">{site.url}</span>
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={site.enabled}
                    onChange={() => handleToggleSite(index)}
                    className="sr-only peer"
                  />
                  <div className={`bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${site.enabled ? 'bg-primary-600' : ''}`}></div>
                </label>
                <button
                  onClick={() => handleRemoveSite(index)}
                  className="inline-flex items-center px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  <TrashIcon className="w-3 h-3 mr-1" />
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlockedSites;
