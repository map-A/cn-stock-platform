/**
 * 期权页面
 */
import React from 'react';
import { Card, Tabs } from 'antd';
import { useIntl } from '@umijs/max';

const OptionsPage: React.FC = () => {
  const intl = useIntl();

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <h1>Options</h1>
        <p>Options trading page coming soon...</p>
      </Card>
    </div>
  );
};

export default OptionsPage;
