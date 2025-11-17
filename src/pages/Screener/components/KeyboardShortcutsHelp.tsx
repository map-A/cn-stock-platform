/**
 * 键盘快捷键帮助组件
 */

import React, { useState } from 'react';
import { Modal, Descriptions, Tag, Button, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const KeyboardShortcutsHelp: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const shortcuts = [
    { key: 'Ctrl + S / ⌘ + S', description: '保存当前筛选器' },
    { key: 'Ctrl + Enter / ⌘ + Enter', description: '执行筛选' },
    { key: 'Ctrl + R / ⌘ + R', description: '重置筛选条件' },
    { key: 'Ctrl + F / ⌘ + F', description: '快速搜索' },
    { key: 'Escape', description: '关闭弹窗/抽屉' },
  ];

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <>
      <Tooltip title="键盘快捷键">
        <Button
          type="text"
          icon={<QuestionCircleOutlined />}
          onClick={() => setVisible(true)}
          style={{ marginLeft: 8 }}
        />
      </Tooltip>

      <Modal
        title="⌨️ 键盘快捷键"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setVisible(false)}>
            知道了
          </Button>,
        ]}
        width={600}
      >
        <Descriptions column={1} bordered size="small">
          {shortcuts.map((shortcut, index) => {
            const keyDisplay = isMac
              ? shortcut.key.replace('Ctrl', '⌘')
              : shortcut.key.split('/')[0].trim();

            return (
              <Descriptions.Item
                key={index}
                label={<Tag color="blue">{keyDisplay}</Tag>}
              >
                {shortcut.description}
              </Descriptions.Item>
            );
          })}
        </Descriptions>

        <div style={{ marginTop: 16, color: '#8c8c8c', fontSize: 12 }}>
          💡 提示：您可以随时按下这些快捷键来提高操作效率
        </div>
      </Modal>
    </>
  );
};

export default KeyboardShortcutsHelp;
