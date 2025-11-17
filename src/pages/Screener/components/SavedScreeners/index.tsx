/**
 * 筛选器管理组件
 */

import React, { useState, useEffect } from 'react';
import { Tabs, Empty, Spin, message } from 'antd';
import { AppstoreOutlined, StarOutlined, HistoryOutlined } from '@ant-design/icons';
import screenerService from '@/services/screener';
import type { SavedScreener } from '../../types';
import ScreenerCard from './ScreenerCard';
import PresetScreeners from './PresetScreeners';
import styles from './index.less';

interface SavedScreenersProps {
  onLoad: (screener: SavedScreener) => void;
}

const SavedScreeners: React.FC<SavedScreenersProps> = ({ onLoad }) => {
  const [loading, setLoading] = useState(false);
  const [savedScreeners, setSavedScreeners] = useState<SavedScreener[]>([]);
  const [recentScreeners, setRecentScreeners] = useState<SavedScreener[]>([]);

  useEffect(() => {
    loadSavedScreeners();
    loadRecentScreeners();
  }, []);

  const loadSavedScreeners = async () => {
    setLoading(true);
    try {
      const response = await screenerService.getSavedScreeners();
      if (response.success && response.data) {
        setSavedScreeners(response.data);
      }
    } catch (error) {
      console.error('Failed to load saved screeners:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentScreeners = () => {
    // 从 localStorage 加载最近使用的筛选器
    try {
      const recent = localStorage.getItem('recent_screeners');
      if (recent) {
        setRecentScreeners(JSON.parse(recent));
      }
    } catch (error) {
      console.error('Failed to load recent screeners:', error);
    }
  };

  const handleLoad = (screener: SavedScreener) => {
    onLoad(screener);
    
    // 保存到最近使用
    saveToRecent(screener);
    
    message.success(`已加载筛选器: ${screener.name}`);
  };

  const saveToRecent = (screener: SavedScreener) => {
    try {
      const recent = [...recentScreeners];
      const existingIndex = recent.findIndex(s => s.id === screener.id);
      
      if (existingIndex > -1) {
        recent.splice(existingIndex, 1);
      }
      
      recent.unshift(screener);
      
      // 最多保存 5 个
      const limited = recent.slice(0, 5);
      setRecentScreeners(limited);
      localStorage.setItem('recent_screeners', JSON.stringify(limited));
    } catch (error) {
      console.error('Failed to save to recent:', error);
    }
  };

  const handleDelete = async (screenerId: string) => {
    try {
      const response = await screenerService.deleteSavedScreener(screenerId);
      if (response.success) {
        message.success('删除成功');
        loadSavedScreeners();
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const items = [
    {
      key: 'preset',
      label: (
        <span>
          <StarOutlined /> 预设筛选器
        </span>
      ),
      children: <PresetScreeners onLoad={handleLoad} />,
    },
    {
      key: 'saved',
      label: (
        <span>
          <AppstoreOutlined /> 我的筛选器
        </span>
      ),
      children: loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin />
        </div>
      ) : savedScreeners.length > 0 ? (
        <div className={styles.screenerGrid}>
          {savedScreeners.map(screener => (
            <ScreenerCard
              key={screener.id}
              screener={screener}
              onLoad={handleLoad}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <Empty description="暂无保存的筛选器" />
      ),
    },
    {
      key: 'recent',
      label: (
        <span>
          <HistoryOutlined /> 最近使用
        </span>
      ),
      children: recentScreeners.length > 0 ? (
        <div className={styles.screenerGrid}>
          {recentScreeners.map(screener => (
            <ScreenerCard
              key={screener.id}
              screener={screener}
              onLoad={handleLoad}
            />
          ))}
        </div>
      ) : (
        <Empty description="暂无最近使用的筛选器" />
      ),
    },
  ];

  return (
    <div className={styles.savedScreeners}>
      <Tabs items={items} defaultActiveKey="preset" />
    </div>
  );
};

export default SavedScreeners;
