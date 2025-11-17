/**
 * 加载骨架屏组件
 */

import React from 'react';
import { Skeleton, Card } from 'antd';

interface LoadingSkeletonProps {
  type?: 'table' | 'card' | 'form';
  rows?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'table', rows = 5 }) => {
  if (type === 'table') {
    return (
      <div style={{ padding: '16px' }}>
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton
            key={index}
            active
            paragraph={{ rows: 1 }}
            style={{ marginBottom: 16 }}
          />
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, padding: 16 }}>
        {Array.from({ length: rows }).map((_, index) => (
          <Card key={index}>
            <Skeleton active paragraph={{ rows: 3 }} />
          </Card>
        ))}
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div style={{ padding: '16px' }}>
        <Skeleton active paragraph={{ rows: 4 }} />
        <Skeleton active paragraph={{ rows: 4 }} style={{ marginTop: 24 }} />
      </div>
    );
  }

  return <Skeleton active />;
};

export default LoadingSkeleton;
