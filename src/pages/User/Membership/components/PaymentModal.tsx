/**
 * 支付弹窗组件
 */

import React, { useState } from 'react';
import { Modal, Radio, Button, QRCode, Space, message } from 'antd';
import { AlipayCircleOutlined, WechatOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useRequest, useInterval } from 'ahooks';
import { getOrderStatus } from '@/services/user';
import type { MembershipPlan } from '@/typings/user';
import styles from './PaymentModal.less';

interface PaymentModalProps {
  visible: boolean;
  plan: MembershipPlan;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ visible, plan, onClose, onSuccess }) => {
  const [payMethod, setPayMethod] = useState<'alipay' | 'wechat' | 'card'>('alipay');
  const [orderId] = useState(() => `ORDER_${Date.now()}`);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // 轮询订单状态
  const { data: orderStatus } = useRequest(
    () => getOrderStatus(orderId),
    {
      pollingInterval: 2000,
      pollingWhenHidden: false,
      ready: visible && !!qrCodeUrl,
      onSuccess: (data) => {
        if (data.status === 'success') {
          message.success('支付成功！');
          onSuccess();
          onClose();
        }
      },
    },
  );

  // 生成支付二维码（模拟）
  const generateQRCode = () => {
    // 实际应该调用后端接口获取支付二维码
    const mockUrl = `https://pay.example.com/${payMethod}/${orderId}`;
    setQrCodeUrl(mockUrl);
  };

  React.useEffect(() => {
    if (visible) {
      generateQRCode();
    }
  }, [visible, payMethod]);

  return (
    <Modal
      open={visible}
      title="完成支付"
      onCancel={onClose}
      footer={null}
      width={500}
      className={styles.paymentModal}
    >
      <div className={styles.content}>
        {/* 订单信息 */}
        <div className={styles.orderInfo}>
          <div className={styles.plan}>
            <span className={styles.label}>购买套餐：</span>
            <span className={styles.value}>{plan.name}</span>
          </div>
          <div className={styles.amount}>
            <span className={styles.label}>支付金额：</span>
            <span className={styles.value}>¥{plan.price}</span>
          </div>
        </div>

        {/* 支付方式选择 */}
        <div className={styles.payMethods}>
          <div className={styles.title}>选择支付方式</div>
          <Radio.Group
            value={payMethod}
            onChange={(e) => setPayMethod(e.target.value)}
            className={styles.methodGroup}
          >
            <Radio.Button value="alipay" className={styles.methodBtn}>
              <AlipayCircleOutlined style={{ color: '#1677ff', fontSize: 24 }} />
              <span>支付宝</span>
            </Radio.Button>
            <Radio.Button value="wechat" className={styles.methodBtn}>
              <WechatOutlined style={{ color: '#07c160', fontSize: 24 }} />
              <span>微信支付</span>
            </Radio.Button>
            <Radio.Button value="card" className={styles.methodBtn}>
              <CreditCardOutlined style={{ fontSize: 24 }} />
              <span>银行卡</span>
            </Radio.Button>
          </Radio.Group>
        </div>

        {/* 二维码 */}
        {qrCodeUrl && (
          <div className={styles.qrcode}>
            <QRCode value={qrCodeUrl} size={200} />
            <p className={styles.tip}>
              {payMethod === 'alipay' && '请使用支付宝扫码支付'}
              {payMethod === 'wechat' && '请使用微信扫码支付'}
              {payMethod === 'card' && '请使用银行APP扫码支付'}
            </p>
          </div>
        )}

        {/* 等待支付提示 */}
        <div className={styles.waiting}>
          <p>等待支付中...</p>
          <p className={styles.orderNo}>订单号: {orderId}</p>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal;
