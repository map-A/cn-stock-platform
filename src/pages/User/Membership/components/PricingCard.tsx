/**
 * 价格卡片组件
 */

import React from 'react';
import { Card, Button, Tag } from 'antd';
import { CheckOutlined, CrownOutlined, StarOutlined, RocketOutlined } from '@ant-design/icons';
import type { MembershipPlan } from '@/typings/user';
import styles from './PricingCard.less';

interface PricingCardProps {
  plan: MembershipPlan;
  current?: boolean;
  onSelect: () => void;
  loading?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, current, onSelect, loading }) => {
  const getIcon = () => {
    switch (plan.level) {
      case 'free':
        return <StarOutlined />;
      case 'pro':
        return <RocketOutlined />;
      case 'premium':
        return <CrownOutlined />;
      default:
        return <StarOutlined />;
    }
  };

  const getTheme = () => {
    switch (plan.level) {
      case 'premium':
        return 'premium';
      case 'pro':
        return 'pro';
      default:
        return 'free';
    }
  };

  return (
    <Card className={`${styles.pricingCard} ${styles[getTheme()]} ${current ? styles.current : ''}`}>
      {plan.popular && (
        <div className={styles.badge}>
          <Tag color="red">最受欢迎</Tag>
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.icon}>{getIcon()}</div>
        <h3>{plan.name}</h3>
        {plan.badge && <span className={styles.badgeText}>{plan.badge}</span>}
      </div>

      <div className={styles.pricing}>
        <div className={styles.price}>
          <span className={styles.currency}>¥</span>
          <span className={styles.amount}>{plan.price}</span>
          <span className={styles.period}>/{plan.duration}月</span>
        </div>
        {plan.originalPrice && (
          <div className={styles.originalPrice}>
            原价: ¥{plan.originalPrice}
          </div>
        )}
      </div>

      <div className={styles.features}>
        {plan.features.map((feature, index) => (
          <div key={index} className={styles.feature}>
            <CheckOutlined className={styles.checkIcon} />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div className={styles.action}>
        {current ? (
          <Button size="large" disabled block>
            当前方案
          </Button>
        ) : (
          <Button
            type={plan.level === 'premium' ? 'primary' : 'default'}
            size="large"
            block
            loading={loading}
            onClick={onSelect}
          >
            {plan.level === 'free' ? '免费使用' : '立即购买'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default PricingCard;
