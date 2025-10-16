import React from 'react';
import { Modal as AntModal } from 'antd';
import type { ModalProps as AntModalProps } from 'antd';

export interface ModalProps extends AntModalProps {}

export const Modal: React.FC<ModalProps> = (props) => {
  return <AntModal {...props} />;
};

export default Modal;
