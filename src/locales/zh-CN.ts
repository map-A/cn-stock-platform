import component from './zh-CN/component';
import globalHeader from './zh-CN/globalHeader';
import menu from './zh-CN/menu';
import pages from './zh-CN/pages';
import pwa from './zh-CN/pwa';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';
import tables from './zh-CN/tables';
import common from './zh-CN/common';

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  
  // 通用
  'common.search': '搜索',
  'common.loading': '加载中...',
  'common.submit': '提交',
  'common.cancel': '取消',
  'common.confirm': '确认',
  'common.delete': '删除',
  'common.edit': '编辑',
  'common.save': '保存',
  'common.refresh': '刷新',
  
  // 用户
  'user.login': '登录',
  'user.logout': '退出登录',
  'user.register': '注册',
  'user.profile': '个人中心',
  'user.settings': '账户设置',
  
  ...common,
  ...component,
  ...globalHeader,
  ...menu,
  ...pages,
  ...pwa,
  ...settingDrawer,
  ...settings,
  ...tables,
};
