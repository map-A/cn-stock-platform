import React from 'react';
import { createStyles } from 'antd-style';
import { Button, Space } from 'antd';
import { CodeOutlined, LineChartOutlined, ExpandOutlined, FullscreenOutlined } from '@ant-design/icons';

const useStyles = createStyles(({ token }) => ({
  bottomBar: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    height: '32px',
    background: token.colorBgElevated,
    borderTop: `1px solid ${token.colorBorder}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px',
    zIndex: 100,
    left: '48px',
  },
  button: {
    height: '24px',
    fontSize: '11px',
    padding: '0 8px',
  },
}));

const BottomBar: React.FC = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.bottomBar}>
      <Space size={8}>
        <Button
          type="text"
          size="small"
          className={styles.button}
          icon={<CodeOutlined />}
        >
          Pine编辑器
        </Button>
        <Button
          type="text"
          size="small"
          className={styles.button}
          icon={<LineChartOutlined />}
        >
          交易面板
        </Button>
      </Space>
      
      <Space size={4}>
        <Button
          type="text"
          size="small"
          className={styles.button}
          icon={<ExpandOutlined />}
        />
        <Button
          type="text"
          size="small"
          className={styles.button}
          icon={<FullscreenOutlined />}
        />
      </Space>
    </div>
  );
};

export default BottomBar;
