import { useEffect, useState } from 'react';

export const useStockWebSocket = (symbol: string) => {
  const [data] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    // TODO: 实现 WebSocket 连接
    setConnected(true);
  }, [symbol]);

  return { data, connected };
};
