import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import pages from './en-US/pages';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
import tables from './en-US/tables';
import common from './en-US/common';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  
  // Common
  'common.search': 'Search',
  'common.loading': 'Loading...',
  'common.submit': 'Submit',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.save': 'Save',
  'common.refresh': 'Refresh',
  
  // User
  'user.login': 'Login',
  'user.logout': 'Logout',
  'user.register': 'Register',
  'user.profile': 'Profile',
  'user.settings': 'Settings',
  
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
