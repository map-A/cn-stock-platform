import React from 'react';
import { Checkbox as AntCheckbox } from 'antd';
import type { CheckboxProps as AntCheckboxProps } from 'antd';

export interface CheckboxProps extends AntCheckboxProps {}

export const Checkbox: React.FC<CheckboxProps> = (props) => {
  return <AntCheckbox {...props} />;
};

export default Checkbox;
