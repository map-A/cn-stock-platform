export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: 'login', path: '/user/login', component: './User/Login' },
      { name: 'register', path: '/user/register', component: './User/Register' },
    ],
  },
  { path: '/', name: 'home', icon: 'HomeOutlined', component: './Home' },
  { path: '/chat', name: 'chat', icon: 'RobotOutlined', component: './Chat' },
  {
    path: '/market',
    name: 'market',
    icon: 'LineChartOutlined',
    routes: [
      { path: '/market/mover', component: './Market/Mover', name: 'mover' },
      { path: '/market/heatmap', component: './Market/Heatmap', name: 'heatmap' },
      { path: '/market/calendar', component: './Market/Calendar', name: 'calendar' },
      { path: '/market/flow', component: './Market/Flow', name: 'flow' },
    ],
  },
  {
    path: '/screening',
    name: 'screening',
    icon: 'SearchOutlined',
    routes: [
      { path: '/screening/screener', component: './Screener', name: 'screener' },
      { path: '/screening/watchlist', component: './Watchlist', name: 'watchlist' },
    ],
  },
  {
    path: '/analysis',
    name: 'analysis',
    icon: 'BarChartOutlined',
    routes: [
      { path: '/analysis/analyst', component: './Analyst', name: 'analyst' },
      { path: '/analysis/sentiment', component: './Analysis/Sentiment', name: 'sentiment' },
      { path: '/analysis/darkpool', component: './Analysis/DarkPool', name: 'darkpool' },
    ],
  },
  { path: '/options', name: 'options', icon: 'DollarOutlined', component: './Options' },
  { path: '/etf', name: 'etf', icon: 'AppstoreOutlined', component: './ETF' },
  { path: '/industry', name: 'industry', icon: 'ToolOutlined', component: './Industry' },
  { path: '/strategy', name: 'strategy', icon: 'ExperimentOutlined', component: './Strategy' },
  { path: '/risk', name: 'risk', icon: 'SafetyOutlined', component: './RiskManagement' },
  { path: '/tasks', name: 'tasks', icon: 'ScheduleOutlined', component: './TaskManagement' },
  {
    path: '/china',
    name: 'china',
    icon: 'FlagOutlined',
    routes: [
      { path: '/china/north-money', component: './ChinaFeatures/NorthMoney', name: 'northMoney' },
      { path: '/china/margin-trade', component: './ChinaFeatures/MarginTrade', name: 'marginTrade' },
      { path: '/china/longhubang', component: './ChinaFeatures/LongHuBang', name: 'longhubang' },
      { path: '/china/concept', component: './ChinaFeatures/ConceptSector', name: 'concept' },
    ],
  },
  { path: '/lists', name: 'lists', icon: 'UnorderedListOutlined', component: './Lists' },
  {
    path: '/community',
    name: 'community',
    icon: 'MessageOutlined',
    routes: [
      { path: '/community/news', component: './Community/NewsFlow', name: 'news' },
      { path: '/community/sentiment', component: './Community/SentimentTracker', name: 'sentiment' },
      { path: '/community/compare', component: './Community/Compare', name: 'compare' },
      { path: '/community/backtest', component: './Community/Backtesting', name: 'backtest' },
      { path: '/community/learning', component: './Community/LearningCenter', name: 'learning' },
    ],
  },
  { path: '*', layout: false, component: './404' },
];
