// src/hooks/usePolygonGasPrice.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

const usePolygonGasPrice = (): number | null => {
  const [gasPrice, setGasPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchGasPrice = async () => {
      try {
        const response = await axios.get('https://api.polygonscan.com/api', {
          params: {
            module: 'proxy',
            action: 'eth_gasPrice',
            apiKey: 'DERWA76VK5W89XPFIJ4R93SH8DVXT3E625', // Your Etherscan API Key here
          },
        });

        // Convert from Wei to Gwei
        const gasPriceInGwei = parseInt(response.data.result, 16) / 10 ** 9;
        setGasPrice(gasPriceInGwei);
      } catch (error) {
        console.error('Error fetching gas price:', error);
      }
    };

    fetchGasPrice();
    const interval = setInterval(fetchGasPrice, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  return gasPrice;
};

export default usePolygonGasPrice;
