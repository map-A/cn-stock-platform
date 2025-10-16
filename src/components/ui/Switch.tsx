import React from 'react';
import { Switch as AntSwitch } from 'antd';
import type { SwitchProps as AntSwitchProps } from 'antd';

export interface SwitchProps extends AntSwitchProps {}

export const Switch: React.FC<SwitchProps> = (props) => {
  return <AntSwitch {...props} />;
};

export default Switch;
