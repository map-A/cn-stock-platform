/**
 * 会员中心页面
 * Phase 5: 用户系统 - 会员体系
 */

import React, { useState } from 'react';
import { Card, Row, Col, Button, Tag, List, Modal, message } from 'antd';
import {
  CheckOutlined,
  CrownOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  BarChartOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { useUserStore } from '@/stores/modules/user';
import { getMembershipPlans, createPaymentOrder, getSubscriptionStatus } from '@/services/user';
import type { MembershipPlan } from '@/typings/user';
import PricingCard from './components/PricingCard';
import PaymentModal from './components/PaymentModal';
import styles from './index.less';

const Membership: React.FC = () => {
  const { user } = useUserStore();
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  // 获取会员计划
  const { data: plans, loading: plansLoading } = useRequest(getMembershipPlans);

  // 获取订阅状态
  const { data: subscription, refresh: refreshSubscription } = useRequest(getSubscriptionStatus);

  // 创建订单
  const { run: createOrder, loading: orderLoading } = useRequest(
    createPaymentOrder,
    {
      manual: true,
      onSuccess: () => {
        message.success('订单创建成功');
        setPaymentModalVisible(true);
      },
      onError: () => {
        message.error('订单创建失败');
      },
    },
  );

  // 处理升级
  const handleUpgrade = (plan: MembershipPlan) => {
    if (!user) {
      Modal.confirm({
        title: '请先登录',
        content: '升级会员需要先登录账号',
        okText: '去登录',
        cancelText: '取消',
        onOk: () => {
          window.location.href = '/user/login';
        },
      });
      return;
    }

    setSelectedPlan(plan);
    createOrder(plan.id);
  };

  // 会员功能对比数据
  const features = [
    {
      key: 'realtime',
      title: '实时行情',
      free: '延迟15分钟',
      pro: '实时推送',
      premium: '实时推送',
      icon: <ThunderboltOutlined />,
    },
    {
      key: 'charts',
      title: '专业图表',
      free: '基础K线',
      pro: '完整技术指标',
      premium: '完整技术指标',
      icon: <BarChartOutlined />,
    },
    {
      key: 'alerts',
      title: '价格提醒',
      free: '5个',
      pro: '50个',
      premium: '无限制',
      icon: <BellOutlined />,
    },
    {
      key: 'watchlist',
      title: '自选股',
      free: '20只',
      pro: '200只',
      premium: '无限制',
      icon: <SafetyOutlined />,
    },
    {
      key: 'analysis',
      title: '分析工具',
      free: '基础功能',
      pro: '高级选股器',
      premium: '全部工具',
      icon: <CrownOutlined />,
    },
  ];

  return (
    <div className={styles.membership}>
      {/* 当前会员状态 */}
      {user && subscription && (
        <Card className={styles.statusCard}>
          <div className={styles.statusContent}>
            <div className={styles.levelInfo}>
              <CrownOutlined className={styles.icon} />
              <div>
                <h3>当前会员等级</h3>
                <div className={styles.level}>
                  <Tag color={getLevelColor(subscription.level)} style={{ fontSize: 16 }}>
                    {getLevelName(subscription.level)}
                  </Tag>
                  {subscription.expireTime && (
                    <span className={styles.expireTime}>
                      到期时间: {subscription.expireTime}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.actions}>
              {subscription.level !== 'premium' && (
                <Button type="primary" size="large" onClick={() => {
                  const plan = plans?.find(p => p.level === 'premium');
                  if (plan) handleUpgrade(plan);
                }}>
                  升级会员
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* 会员计划 */}
      <div className={styles.plans}>
        <div className={styles.sectionHeader}>
          <h2>选择适合您的会员计划</h2>
          <p>解锁更多专业功能，提升投资效率</p>
        </div>

        <Row gutter={[24, 24]} justify="center">
          {plans?.map((plan) => (
            <Col key={plan.id} xs={24} sm={24} md={8}>
              <PricingCard
                plan={plan}
                current={subscription?.level === plan.level}
                onSelect={() => handleUpgrade(plan)}
                loading={orderLoading}
              />
            </Col>
          ))}
        </Row>
      </div>

      {/* 功能对比 */}
      <Card className={styles.comparison} title="功能对比">
        <div className={styles.comparisonTable}>
          <div className={styles.header}>
            <div className={styles.featureCol}>功能</div>
            <div className={styles.planCol}>Free</div>
            <div className={styles.planCol}>Pro</div>
            <div className={styles.planCol}>Premium</div>
          </div>
          {features.map((feature) => (
            <div key={feature.key} className={styles.row}>
              <div className={styles.featureCol}>
                {feature.icon}
                <span>{feature.title}</span>
              </div>
              <div className={styles.planCol}>{feature.free}</div>
              <div className={styles.planCol}>{feature.pro}</div>
              <div className={styles.planCol}>{feature.premium}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* 常见问题 */}
      <Card className={styles.faq} title="常见问题">
        <List
          dataSource={[
            {
              question: '如何升级会员？',
              answer: '选择您想要的会员计划，点击购买按钮，完成支付即可立即生效。',
            },
            {
              question: '支持哪些支付方式？',
              answer: '支持支付宝、微信支付、银行卡支付。',
            },
            {
              question: '会员到期后会怎样？',
              answer: '会员到期后将自动降级为免费版本，您的数据不会丢失。',
            },
            {
              question: '可以退款吗？',
              answer: '开通后7天内，如未使用任何高级功能，可申请全额退款。',
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <div className={styles.faqItem}>
                <h4>{item.question}</h4>
                <p>{item.answer}</p>
              </div>
            </List.Item>
          )}
        />
      </Card>

      {/* 支付弹窗 */}
      {selectedPlan && (
        <PaymentModal
          visible={paymentModalVisible}
          plan={selectedPlan}
          onClose={() => {
            setPaymentModalVisible(false);
            setSelectedPlan(null);
          }}
          onSuccess={() => {
            refreshSubscription();
            message.success('升级成功！');
          }}
        />
      )}
    </div>
  );
};

// 获取等级颜色
function getLevelColor(level: string): string {
  const colors = {
    free: 'default',
    pro: 'blue',
    premium: 'gold',
  };
  return colors[level as keyof typeof colors] || 'default';
}

// 获取等级名称
function getLevelName(level: string): string {
  const names = {
    free: '免费版',
    pro: '专业版',
    premium: '旗舰版',
  };
  return names[level as keyof typeof names] || level;
}

export default Membership;
