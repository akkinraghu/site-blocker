import React from 'react';

export interface CustomizeProps {
  customBlockPage: boolean;
  onChange: (customBlockPage: boolean) => void;
}

const Customize: React.FC<CustomizeProps> = ({ customBlockPage, onChange }) => {
  const enabled = customBlockPage;
  const handleToggle = () => onChange(!enabled);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Custom Block Page</h3>
          <p className="text-sm text-gray-500">Enable a custom page when sites are blocked</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={enabled}
            onChange={handleToggle}
          />
          <div className="toggle-base bg-toggle-off peer-checked:bg-toggle-on">
            <div className="toggle-handle peer-checked:translate-x-full"></div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default Customize;
