import { useState } from 'react';

const useAccordion = (init = 0) => {
  const [activeIndex, setActiveIndex] = useState(init);

  const handleAccordion = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return [activeIndex, handleAccordion];
};

export default useAccordion;
