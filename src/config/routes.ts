export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: 'login', path: '/user/login', component: './User/Login' },
      { name: 'register', path: '/user/register', component: './User/Register' },
    ],
  },
  
  // ============ 首页 ============
  { path: '/', name: 'home', icon: 'HomeOutlined', component: './Home' },
  { path: '/chat', name: 'chat', icon: 'RobotOutlined', component: './Chat' },

  // ============ 市场行情 ============
  {
    path: '/market',
    name: 'market',
    icon: 'LineChartOutlined',
    component: './Market',
  },

  // ============ 选股与关注 ============
  {
    path: '/screening',
    name: 'screening',
    icon: 'SearchOutlined',
    routes: [
      { path: '/screening/screener', name: 'screener', component: './Screener' },
      { path: '/screening/watchlist', name: 'watchlist', component: './Watchlist' },
    ],
  },

  // ============ 数据分析 ============
  {
    path: '/analysis',
    name: 'analysis',
    icon: 'BarChartOutlined',
    routes: [
      { path: '/analysis/analyst', name: 'analyst', component: './Analyst' },
      { path: '/analysis/sentiment', name: 'sentiment', component: './Analysis/Sentiment' },
      { path: '/analysis/darkpool', name: 'darkpool', component: './Analysis/DarkPool' },
    ],
  },

  // ============ 新闻与舆情 ============
  {
    path: '/news-analysis',
    name: 'newsAnalysis',
    icon: 'NotificationOutlined',
    component: './NewsAnalysis',
  },

  // ============ 资产类 ============
  { path: '/options', name: 'options', icon: 'DollarOutlined', component: './Options' },
  { path: '/etf', name: 'etf', icon: 'AppstoreOutlined', component: './ETF' },
  { path: '/industry', name: 'industry', icon: 'ToolOutlined', component: './Industry' },

  // ============ 交易与策略 ============
  // TODO: 新的策略与回测路由将在重构后添加
  // {
  //   path: '/strategies',
  //   name: 'strategies',
  //   icon: 'ExperimentOutlined',
  //   component: './Strategy',
  // },
  // {
  //   path: '/backtests',
  //   name: 'backtests',
  //   icon: 'BarChartOutlined',
  //   component: './Backtest',
  // },
  {
    path: '/trade',
    name: 'trade',
    icon: 'SwapOutlined',
    component: './Trade',
  },

  // ============ 风险与账户 ============
  {
    path: '/risk',
    name: 'risk',
    icon: 'SafetyOutlined',
    routes: [
      { path: '/risk/management', name: 'management', component: './RiskManagement' },
      { path: '/risk/analysis', name: 'analysis', component: './Risk' },
    ],
  },
  {
    path: '/account',
    name: 'account',
    icon: 'UserOutlined',
    component: './Account',
  },

  // ============ 任务与中国特色 ============
  { path: '/tasks', name: 'tasks', icon: 'ScheduleOutlined', component: './TaskManagement' },
  {
    path: '/china',
    name: 'china',
    icon: 'FlagOutlined',
    routes: [
      { path: '/china/north-money', name: 'northMoney', component: './ChinaFeatures/NorthMoney' },
      { path: '/china/margin-trade', name: 'marginTrade', component: './ChinaFeatures/MarginTrade' },
      { path: '/china/longhubang', name: 'longhubang', component: './ChinaFeatures/LongHuBang' },
      { path: '/china/concept', name: 'concept', component: './ChinaFeatures/ConceptSector' },
    ],
  },

  // ============ 榜单与社区 ============
  { path: '/lists', name: 'lists', icon: 'UnorderedListOutlined', component: './Lists' },
  {
    path: '/community',
    name: 'community',
    icon: 'MessageOutlined',
    routes: [
      { path: '/community/news', name: 'news', component: './Community/NewsFlow' },
      { path: '/community/sentiment', name: 'sentiment', component: './Community/SentimentTracker' },
      { path: '/community/compare', name: 'compare', component: './Community/Compare' },
      { path: '/community/backtest', name: 'backtest', component: './Community/Backtesting' },
    ],
  },

  // ============ 系统与个人设置 ============
  {
    path: '/settings',
    name: 'settings',
    icon: 'SettingOutlined',
    routes: [
      { path: '/settings/system', name: 'system', component: './SystemSettings' },
      { path: '/settings/user', name: 'user', component: './UserSettings' },
    ],
  },

  // ============ 404 ============
  { path: '*', layout: false, component: './404' },
];
