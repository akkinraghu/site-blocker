import React, { useState } from 'react';

interface BlockedSitesProps {
  sites: string[];
  onChange: (sites: string[]) => void;
}

const BlockedSites: React.FC<BlockedSitesProps> = ({ sites, onChange }) => {
  const [newSite, setNewSite] = useState('');

  const handleAddSite = () => {
    const site = newSite.trim().toLowerCase();
    if (site && !sites.includes(site)) {
      onChange([...sites, site]);
      setNewSite('');
    }
  };

  const handleRemoveSite = (index: number) => {
    const newSites = [...sites];
    newSites.splice(index, 1);
    onChange(newSites);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSite();
    }
  };

  return (
    <div className="tab-pane active">
      <div className="mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter website (e.g., facebook.com)"
            value={newSite}
            onChange={(e) => setNewSite(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="btn btn-primary"
            onClick={handleAddSite}
            disabled={!newSite.trim()}
          >
            Add
          </button>
        </div>
      </div>
      <div>
        {sites.map((site, index) => (
          <div key={index} className="blocked-site">
            <span>{site}</span>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleRemoveSite(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockedSites;
