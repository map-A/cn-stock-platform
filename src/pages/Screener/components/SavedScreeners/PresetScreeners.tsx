/**
 * 预设筛选器组件
 */

import React from 'react';
import { Row, Col } from 'antd';
import { PRESET_SCREENERS } from '../../constants/presets';
import ScreenerCard from './ScreenerCard';
import type { SavedScreener } from '../../types';

interface PresetScreenersProps {
  onLoad: (screener: SavedScreener) => void;
}

const PresetScreeners: React.FC<PresetScreenersProps> = ({ onLoad }) => {
  return (
    <Row gutter={[16, 16]}>
      {PRESET_SCREENERS.map(preset => (
        <Col key={preset.id} xs={24} sm={12} md={8} lg={6} xl={4}>
          <ScreenerCard screener={preset} onLoad={onLoad} />
        </Col>
      ))}
    </Row>
  );
};

export default PresetScreeners;
