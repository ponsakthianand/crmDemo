import { useState } from 'react';

const useTabs = (init = 0) => {
  const [activeTab, setActiveTab] = useState(init);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return [activeTab, handleTabClick];
};

export default useTabs;
