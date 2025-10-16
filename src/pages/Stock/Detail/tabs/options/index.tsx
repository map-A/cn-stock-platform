/**
 * 股票详情 - 期权Tab入口
 */

import React, { useState } from 'react';
import { Tabs } from 'antd';
import Overview from './Overview';
import Greeks from './Greeks';
import MaxPain from './MaxPain';
import UnusualActivity from './UnusualActivity';
import Volatility from './Volatility';

interface OptionsTabProps {
  ticker: string;
}

const OptionsTab: React.FC<OptionsTabProps> = ({ ticker }) => {
  const [activeKey, setActiveKey] = useState('overview');

  return (
    <div style={{ padding: '16px 0' }}>
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
        <Tabs.TabPane tab="期权总览" key="overview">
          <Overview ticker={ticker} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="希腊字母" key="greeks">
          <Greeks ticker={ticker} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="最大痛点" key="maxpain">
          <MaxPain ticker={ticker} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="异常活动" key="unusual">
          <UnusualActivity ticker={ticker} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="波动率" key="volatility">
          <Volatility ticker={ticker} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default OptionsTab;
