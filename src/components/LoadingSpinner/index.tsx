/**
 * 加载动画组件
 */
import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './index.less';

interface LoadingSpinnerProps {
  /** 提示文字 */
  tip?: string;
  /** 尺寸 */
  size?: 'small' | 'default' | 'large';
  /** 是否全屏 */
  fullscreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  tip = '加载中...',
  size = 'default',
  fullscreen = false,
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const spinner = (
    <Spin
      indicator={antIcon}
      tip={tip}
      size={size}
    />
  );

  if (fullscreen) {
    return (
      <div className={styles.fullscreen}>
        {spinner}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
