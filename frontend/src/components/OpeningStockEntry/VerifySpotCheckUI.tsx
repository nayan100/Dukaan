import React from 'react';

interface VerifySpotCheckUIProps {
  onVerify?: () => void;
}

const VerifySpotCheckUI: React.FC<VerifySpotCheckUIProps> = ({ onVerify }) => {
  return (
    <button onClick={onVerify}>
      Verify Spot Check
    </button>
  );
};

export default VerifySpotCheckUI;
