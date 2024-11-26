import React from 'react';
import { CustomBlockPage } from '../../types';

interface CustomizeProps {
  customBlockPage: CustomBlockPage;
  onChange: (customBlockPage: CustomBlockPage) => void;
}

const Customize: React.FC<CustomizeProps> = ({ customBlockPage, onChange }) => {
  const handleChange = (updates: Partial<CustomBlockPage>) => {
    onChange({ ...customBlockPage, ...updates });
  };

  return (
    <div className="tab-pane active">
      <div className="mb-3">
        <label className="form-label">Block Page Title</label>
        <input
          type="text"
          className="form-control"
          value={customBlockPage.title}
          onChange={(e) => handleChange({ title: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Block Page Message</label>
        <textarea
          className="form-control"
          rows={3}
          value={customBlockPage.message}
          onChange={(e) => handleChange({ message: e.target.value })}
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Background Color</label>
          <div className="input-group">
            <input
              type="color"
              className="form-control form-control-color"
              value={customBlockPage.backgroundColor}
              onChange={(e) => handleChange({ backgroundColor: e.target.value })}
            />
            <input
              type="text"
              className="form-control"
              value={customBlockPage.backgroundColor}
              onChange={(e) => handleChange({ backgroundColor: e.target.value })}
            />
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Text Color</label>
          <div className="input-group">
            <input
              type="color"
              className="form-control form-control-color"
              value={customBlockPage.textColor}
              onChange={(e) => handleChange({ textColor: e.target.value })}
            />
            <input
              type="text"
              className="form-control"
              value={customBlockPage.textColor}
              onChange={(e) => handleChange({ textColor: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-header">Preview</div>
        <div
          className="card-body"
          style={{
            backgroundColor: customBlockPage.backgroundColor,
            color: customBlockPage.textColor
          }}
        >
          <h5 className="card-title">{customBlockPage.title}</h5>
          <p className="card-text">{customBlockPage.message}</p>
        </div>
      </div>
    </div>
  );
};

export default Customize;
