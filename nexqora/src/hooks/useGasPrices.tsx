// src/components/GasPriceDisplay.tsx
import React from 'react';
import usePolygonGasPrice from '../hooks/usePolygonGasPrice';  // import the custom hook for Polygon
import useArbitrumGasPrice from '../hooks/useArbitrumGasPrice'; // import the custom hook for Arbitrum

const GasPriceDisplay: React.FC = () => {
  // Call the hooks to fetch the gas prices for Polygon and Arbitrum
  const polygonGasPrice = usePolygonGasPrice();
  const arbitrumGasPrice = useArbitrumGasPrice();

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-teal-300 text-xl font-semibold">Current Gas Prices</h2>
      <div className="mt-2 text-gray-200">
        <p>Polygon Gas Price: {polygonGasPrice ? `${polygonGasPrice} Gwei` : 'Loading...'}</p>
        <p>Arbitrum Gas Price: {arbitrumGasPrice ? `${arbitrumGasPrice} Gwei` : 'Loading...'}</p>
      </div>
    </div>
  );
};

export default GasPriceDisplay;
