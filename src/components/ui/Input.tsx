import React from 'react';
import { Input as AntInput } from 'antd';
import type { InputProps as AntInputProps } from 'antd';

export interface InputProps extends AntInputProps {}

export const Input: React.FC<InputProps> = (props) => {
  return <AntInput {...props} />;
};

export default Input;
