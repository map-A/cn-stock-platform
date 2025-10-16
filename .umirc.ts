import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {
    configProvider: {},
    theme: {
      token: {
        colorPrimary: '#1890ff',
        colorSuccess: '#52c41a',
        colorWarning: '#faad14',
        colorError: '#f5222d',
        fontSize: 14,
        borderRadius: 4,
      },
    },
  },

  // 网络请求配置
  request: {
    dataField: 'data',
  },

  // 初始状态
  initialState: {},

  // 数据流
  model: {},

  // 国际化
  locale: {
    default: 'zh-CN',
    antd: true,
    title: false,
    baseNavigator: true,
    baseSeparator: '-',
  },

  // 权限
  access: {},

  // 路由配置
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: '首页',
      icon: 'home',
      component: '@/pages/Home',
    },
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user/login',
          name: '登录',
          component: '@/pages/User/Login',
        },
        {
          path: '/user/register',
          name: '注册',
          component: '@/pages/User/Register',
        },
      ],
    },
    {
      path: '/market',
      name: '市场',
      icon: 'stock',
      routes: [
        {
          path: '/market/mover',
          name: '涨跌榜',
          component: '@/pages/Market/Mover',
        },
        {
          path: '/market/flow',
          name: '资金流向',
          component: '@/pages/Market/Flow',
        },
        {
          path: '/market/calendar',
          name: '财报日历',
          component: '@/pages/Market/Calendar',
        },
      ],
    },
    {
      path: '/stock/:symbol',
      name: '股票详情',
      hideInMenu: true,
      component: '@/pages/Stock/Detail',
    },
    {
      path: '/watchlist',
      name: '自选股',
      icon: 'star',
      component: '@/pages/Watchlist',
    },
    {
      path: '/screener',
      name: '选股器',
      icon: 'filter',
      component: '@/pages/Screener',
    },
    {
      path: '/lists',
      name: '特色列表',
      icon: 'unordered-list',
      routes: [
        {
          path: '/lists',
          name: '列表导航',
          component: '@/pages/Lists',
        },
        {
          path: '/lists/dividend',
          name: '分红专区',
          routes: [
            {
              path: '/lists/dividend/monthly',
              name: '月度分红股',
              component: '@/pages/Lists/Dividend/Monthly',
            },
            {
              path: '/lists/dividend/high-yield',
              name: '高股息率',
              component: '@/pages/Lists/Dividend/HighYield',
            },
            {
              path: '/lists/dividend/growth',
              name: '股息增长',
              component: '@/pages/Lists/Dividend/Growth',
            },
            {
              path: '/lists/dividend/stable',
              name: '分红稳定',
              component: '@/pages/Lists/Dividend/Stable',
            },
          ],
        },
        {
          path: '/lists/options',
          name: '期权异动',
          routes: [
            {
              path: '/lists/options/call-volume',
              name: '看涨期权成交量',
              component: '@/pages/Lists/Options/CallVolume',
            },
            {
              path: '/lists/options/put-volume',
              name: '看跌期权成交量',
              component: '@/pages/Lists/Options/PutVolume',
            },
            {
              path: '/lists/options/high-iv',
              name: '高隐含波动率',
              component: '@/pages/Lists/Options/HighIV',
            },
            {
              path: '/lists/options/open-interest',
              name: '未平仓合约',
              component: '@/pages/Lists/Options/OpenInterest',
            },
            {
              path: '/lists/options/put-call-ratio',
              name: 'Put/Call比率',
              component: '@/pages/Lists/Options/PutCallRatio',
            },
          ],
        },
        {
          path: '/lists/theme',
          name: '主题概念',
          routes: [
            {
              path: '/lists/theme/nev',
              name: '新能源汽车',
              component: '@/pages/Lists/Theme/NEV',
            },
            {
              path: '/lists/theme/semiconductor',
              name: '半导体芯片',
              component: '@/pages/Lists/Theme/Semiconductor',
            },
            {
              path: '/lists/theme/ai',
              name: '人工智能',
              component: '@/pages/Lists/Theme/AI',
            },
            {
              path: '/lists/theme/biopharm',
              name: '生物医药',
              component: '@/pages/Lists/Theme/Biopharm',
            },
            {
              path: '/lists/theme/5g',
              name: '5G通信',
              component: '@/pages/Lists/Theme/FiveG',
            },
            {
              path: '/lists/theme/new-infra',
              name: '新基建',
              component: '@/pages/Lists/Theme/NewInfra',
            },
            {
              path: '/lists/theme/defense',
              name: '军工国防',
              component: '@/pages/Lists/Theme/Defense',
            },
            {
              path: '/lists/theme/consumption',
              name: '消费升级',
              component: '@/pages/Lists/Theme/Consumption',
            },
            {
              path: '/lists/theme/carbon-neutral',
              name: '碳中和',
              component: '@/pages/Lists/Theme/CarbonNeutral',
            },
            {
              path: '/lists/theme/metaverse',
              name: '元宇宙',
              component: '@/pages/Lists/Theme/Metaverse',
            },
          ],
        },
        {
          path: '/lists/technical',
          name: '技术信号',
          routes: [
            {
              path: '/lists/technical/new-high',
              name: '突破新高',
              component: '@/pages/Lists/Technical/NewHigh',
            },
            {
              path: '/lists/technical/up-limit',
              name: '连续涨停',
              component: '@/pages/Lists/Technical/UpLimit',
            },
            {
              path: '/lists/technical/down-limit',
              name: '连续跌停',
              component: '@/pages/Lists/Technical/DownLimit',
            },
            {
              path: '/lists/technical/high-volume-up',
              name: '放量上涨',
              component: '@/pages/Lists/Technical/HighVolumeUp',
            },
            {
              path: '/lists/technical/low-volume-down',
              name: '缩量下跌',
              component: '@/pages/Lists/Technical/LowVolumeDown',
            },
          ],
        },
        {
          path: '/lists/fundamental',
          name: '基本面',
          routes: [
            {
              path: '/lists/fundamental/low-pe',
              name: '低市盈率',
              component: '@/pages/Lists/Fundamental/LowPE',
            },
            {
              path: '/lists/fundamental/low-pb',
              name: '低市净率',
              component: '@/pages/Lists/Fundamental/LowPB',
            },
            {
              path: '/lists/fundamental/high-roe',
              name: '高ROE',
              component: '@/pages/Lists/Fundamental/HighROE',
            },
            {
              path: '/lists/fundamental/profit-growth',
              name: '高利润增长',
              component: '@/pages/Lists/Fundamental/ProfitGrowth',
            },
            {
              path: '/lists/fundamental/revenue-growth',
              name: '高营收增长',
              component: '@/pages/Lists/Fundamental/RevenueGrowth',
            },
            {
              path: '/lists/fundamental/low-debt',
              name: '低负债率',
              component: '@/pages/Lists/Fundamental/LowDebt',
            },
          ],
        },
      ],
    },
    {
      path: '/calendar',
      name: '财经日历',
      icon: 'calendar',
      routes: [
        {
          path: '/calendar/earnings',
          name: '财报日历',
          component: '@/pages/Calendar/EarningsCalendar',
        },
        {
          path: '/calendar/dividends',
          name: '分红日历',
          component: '@/pages/Calendar/DividendsCalendar',
        },
      ],
    },
    {
      path: '/analysis',
      name: '分析工具',
      icon: 'fund',
      routes: [
        {
          path: '/analysis/screener',
          name: '选股器',
          component: '@/pages/Analysis/Screener',
        },
        {
          path: '/analysis/darkpool',
          name: '大宗交易',
          component: '@/pages/Analysis/DarkPool',
        },
        {
          path: '/analysis/sentiment',
          name: '情绪追踪',
          component: '@/pages/Analysis/Sentiment',
        },
      ],
    },
    {
      path: '/china-features',
      name: '中国特色',
      icon: 'appstore',
      routes: [
        {
          path: '/china-features/longhubang',
          name: '龙虎榜',
          component: '@/pages/ChinaFeatures/LongHuBang',
        },
        {
          path: '/china-features/north-money',
          name: '北向资金',
          component: '@/pages/ChinaFeatures/NorthMoney',
        },
        {
          path: '/china-features/margin-trade',
          name: '融资融券',
          component: '@/pages/ChinaFeatures/MarginTrade',
        },
        {
          path: '/china-features/concept',
          name: '概念板块',
          component: '@/pages/ChinaFeatures/ConceptSector',
        },
      ],
    },
    {
      path: '/analyst',
      name: '分析师',
      icon: 'team',
      routes: [
        {
          path: '/analyst',
          name: '分析师排行',
          component: '@/pages/Analyst',
        },
        {
          path: '/analyst/top-stocks',
          name: '推荐股票',
          component: '@/pages/Analyst/TopStocks',
        },
        {
          path: '/analyst/flow',
          name: '分析师动态',
          component: '@/pages/Analyst/Flow',
        },
        {
          path: '/analyst/:id',
          name: '分析师详情',
          hideInMenu: true,
          component: '@/pages/Analyst/Detail',
        },
      ],
    },
    {
      path: '/options',
      name: '期权',
      icon: 'line-chart',
      routes: [
        {
          path: '/options/tracker',
          name: '期权追踪',
          component: '@/pages/Options/OptionsTracker',
        },
        {
          path: '/options/calculator',
          name: '期权计算器',
          component: '@/pages/Options/OptionsCalculator',
        },
      ],
    },
  ],

  // 代理配置
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },

  npmClient: 'pnpm',

  // 构建配置
  esbuild: {},

  // MFSU 配置
  mfsu: {
    strategy: 'normal',
  },

  // Vite 配置
  vite: {
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
  },

  // 标题
  title: '中国股市分析平台',

  // Favicon
  favicons: ['/favicon.ico'],

  // Hash
  hash: true,

  // 目标浏览器
  targets: {
    chrome: 87,
    firefox: 78,
    safari: 13,
    edge: 88,
  },
});
