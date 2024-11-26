import React, { useEffect, useState } from 'react';
import { CustomBlockPage } from '../../types';

const DEFAULT_BLOCK_PAGE: CustomBlockPage = {
  title: 'Site Blocked',
  message: 'This site is currently blocked to help you stay focused.',
  backgroundColor: '#f8f9fa',
  textColor: '#212529'
};

const Block: React.FC = () => {
  const [blockPage, setBlockPage] = useState<CustomBlockPage>(DEFAULT_BLOCK_PAGE);

  useEffect(() => {
    chrome.storage.sync.get(['customBlockPage'], (result) => {
      if (result.customBlockPage) {
        setBlockPage(result.customBlockPage);
      }
    });
  }, []);

  return (
    <div
      className="block-container"
      style={{
        backgroundColor: blockPage.backgroundColor,
        color: blockPage.textColor
      }}
    >
      <h1 className="mb-4">{blockPage.title}</h1>
      <p className="lead">{blockPage.message}</p>
    </div>
  );
};

export default Block;
