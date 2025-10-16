/**
 * 用户页面布局（登录、注册等）
 */
import React from 'react';
import { Outlet } from '@umijs/max';
import styles from './index.less';

const UserLayout: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <img src="/logo.png" alt="logo" className={styles.logo} />
            <span className={styles.title}>中国股市分析平台</span>
          </div>
          <div className={styles.desc}>
            专业的A股数据分析工具，助您把握投资机会
          </div>
        </div>
        <div className={styles.main}>
          <Outlet />
        </div>
      </div>
      <div className={styles.footer}>
        <div>中国股市分析平台 ©2024</div>
      </div>
    </div>
  );
};

export default UserLayout;
