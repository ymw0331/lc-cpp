import React from 'react';

const WalletIcon = ({className = '', width = '56.09', height = '48.32'}) => {
  return (
    <svg 
      className={className}
      width={width} 
      height={height} 
      viewBox="0 0 56.09 48.32" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        fill="#f25bb3"
        d="m43.34,11.47v-7.29c0-2.83-2.75-4.84-5.45-3.99L2.29,11.47s41.28.24,41.04,0Z"
      />
      <g>
        <rect 
          fill="#ffcbeb" 
          y="10.19" 
          width="52.46" 
          height="38.12" 
          rx="5.2" 
          ry="5.2"
        />
        <rect 
          fill="#f25bb3" 
          x="30.59" 
          y="21.23" 
          width="25.5" 
          height="16.35" 
          rx="5.52" 
          ry="5.52"
        />
      </g>
      <path 
        fill="#ffe4fd"
        d="m41.62,29.4c0,.97-.83,1.8-1.8,1.8-.95,0-1.81-.84-1.81-1.79,0-.94.86-1.81,1.8-1.81.95,0,1.8.85,1.8,1.8Z"
      />
    </svg>
  );
};

export default WalletIcon;