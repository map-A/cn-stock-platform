import React from 'react';
import { Select as AntSelect } from 'antd';
import type { SelectProps as AntSelectProps } from 'antd';

export interface SelectProps extends AntSelectProps {}

export const Select: React.FC<SelectProps> = (props) => {
  return <AntSelect {...props} />;
};

export default Select;
