import React from 'react';
import { Tabs as AntTabs } from 'antd';
import type { TabsProps as AntTabsProps } from 'antd';

export interface TabsProps extends AntTabsProps {}

export const Tabs: React.FC<TabsProps> = (props) => {
  return <AntTabs {...props} />;
};

// 兼容性别名
export const TabsList = Tabs;
export const TabsTrigger = Tabs.TabPane;
export const TabsContent = Tabs.TabPane;

export default Tabs;
