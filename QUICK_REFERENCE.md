# 快速参考指南 - Quick Reference Guide

## 🚀 快速开始 | Quick Start

### 中文

#### 开发环境启动
```bash
npm run dev
```
访问 http://localhost:8000

#### 生产构建
```bash
npm run build
```

#### 所有可用命令
```bash
npm run dev          # 开发环境
npm run build        # 生产构建
npm run preview      # 预览构建结果
npm run start        # 启动生产服务
npm run lint         # 代码检查（如有配置）
npm run test         # 运行测试（如有配置）
```

---

## 📑 新增功能导航 | New Features Navigation

### 交易记录 | Trade Records
- **路由**: `/trade`
- **菜单**: 交易记录 | Trade Records
- **功能**: 查看交易历史、分析交易、查看盈亏报表
- **关键页面**:
  - 交易历史 - 查看所有交易记录
  - 交易分析 - 交易数据分析
  - 盈亏报表 - 盈亏统计
  - 绩效评估 - 交易绩效指标

### 回测系统 | Backtesting System  
- **路由**: `/strategy/backtest`
- **菜单**: AI策略 > 回测系统 | AI Strategy > Backtesting System
- **功能**: 配置回测、查看结果、生成报告
- **关键操作**:
  - 新建回测配置
  - 运行回测
  - 查看回测结果
  - 导出回测报告

### 新闻分析 | News Analysis
- **路由**: `/news-analysis`
- **菜单**: 新闻分析 | News Analysis
- **功能**: 查看新闻、情感分析、关键词云
- **关键功能**:
  - 新闻流展示
  - 情感分析和趋势
  - 关键词云可视化
  - 市场情绪指标

### 风险分析 | Risk Analysis
- **路由**: `/risk/analysis`
- **菜单**: 风险管理 > 风险分析 | Risk Management > Risk Analysis
- **功能**: 风险评估、头寸管理、风险监控

### 账户管理 | Account Management
- **路由**: `/account`
- **菜单**: 账户管理 | Account Management
- **功能**: 查看账户信息、资产配置、资金管理

### 系统设置 | System Settings
- **路由**: `/settings/system`
- **菜单**: 设置 > 系统设置 | Settings > System Settings
- **功能**: 任务调度、数据源配置、系统监控

### 用户设置 | User Settings
- **路由**: `/settings/user`
- **菜单**: 设置 > 个人设置 | Settings > Personal Settings
- **功能**: 主题设置、个性化偏好、活动日志

---

## 🌐 语言切换 | Language Switch

项目支持中文和英文界面切换。

### 中文菜单 | Chinese Menu
所有功能都有中文标签和说明。

**新增中文标签**:
- `menu.trade` = 交易记录
- `menu.newsAnalysis` = 新闻分析
- `menu.account` = 账户管理
- `menu.settings` = 设置
- `menu.strategy.backtest` = 回测系统
- `menu.risk.analysis` = 风险分析

### 英文菜单 | English Menu
所有功能都有英文标签和说明。

**新增英文标签**:
- `menu.trade` = Trade Records
- `menu.newsAnalysis` = News Analysis
- `menu.account` = Account Management
- `menu.settings` = Settings
- `menu.strategy.backtest` = Backtesting System
- `menu.risk.analysis` = Risk Analysis

---

## 🗂️ 文件位置 | File Locations

### 页面 | Pages
```
src/pages/
├── Trade/              # 交易记录
├── Backtest/           # 回测系统
├── NewsAnalysis/       # 新闻分析
├── Risk/               # 风险管理
├── Account/            # 账户管理
├── SystemSettings/     # 系统设置
└── UserSettings/       # 用户设置
```

### 组件 | Components
```
src/components/
├── Trade/              # 交易组件
├── Backtest/           # 回测组件
├── NewsAnalysis/       # 新闻分析组件
├── Risk/               # 风险管理组件
├── Account/            # 账户管理组件
├── Portfolio/          # 投资组合
├── RealTimeQuote/      # 实时行情
├── Analysis/           # 分析工具
├── Strategy/           # 策略工具
├── SystemSettings/     # 系统设置组件
└── UserSettings/       # 用户设置组件
```

### 类型定义 | Type Definitions
```
types/
├── backtest.ts         # 回测类型
├── news.ts             # 新闻类型
├── risk.ts             # 风险类型
├── strategy.ts         # 策略类型
└── task.ts             # 任务类型
```

### API 服务 | Services
```
src/services/
├── backtest.ts         # 回测API
├── news.ts             # 新闻API
├── risk.ts             # 风险API
├── account.ts          # 账户API
├── strategy.ts         # 策略API
├── task.ts             # 任务API
├── system.ts           # 系统API
└── user.ts             # 用户API
```

### 国际化 | Localization
```
src/locales/
├── zh-CN/
│   ├── menu.ts         # 菜单翻译
│   └── pages.ts        # 页面翻译
└── en-US/
    ├── menu.ts         # 菜单翻译
    └── pages.ts        # 页面翻译
```

---

## 🔄 路由结构 | Route Structure

### 一级菜单 | Main Menu
- 首页 | Home (`/`)
- AI助手 | Chat (`/chat`)
- 行情 | Market (`/market`)
- 选股 | Screening (`/screening`)
- 分析 | Analysis (`/analysis`)
- 新闻分析 | News Analysis (`/news-analysis`)
- 期权 | Options (`/options`)
- ETF
- 行业 | Industry
- **交易 | Trade** (`/trade`) ✨ 新增
- **策略 | Strategy** (`/strategy`) 🔄 扩展
- **风险 | Risk** (`/risk`) 🔄 扩展
- **账户 | Account** (`/account`) ✨ 新增
- 任务 | Tasks (`/tasks`)
- 中国特色 | China Features (`/china`)
- 榜单 | Lists (`/lists`)
- 社区 | Community (`/community`)
- **设置 | Settings** (`/settings`) ✨ 新增

### 二级路由 | Sub-routes

**策略 | Strategy**
- `/strategy/list` - 策略列表 | Strategy List
- `/strategy/backtest` - 回测系统 | Backtesting System ✨ 新增

**风险 | Risk**
- `/risk/management` - 风险工具 | Risk Tools
- `/risk/analysis` - 风险分析 | Risk Analysis ✨ 新增

**设置 | Settings** ✨ 新增
- `/settings/system` - 系统设置 | System Settings
- `/settings/user` - 用户设置 | Personal Settings

---

## 📝 常见操作 | Common Tasks

### 添加新页面 | Add New Page

1. 在 `src/pages/` 创建页面文件夹
2. 在 `config/routes.ts` 添加路由
3. 在 `src/locales/zh-CN/menu.ts` 和 `pages.ts` 添加中文标签
4. 在 `src/locales/en-US/menu.ts` 和 `pages.ts` 添加英文标签
5. 重启开发服务器

### 添加新组件 | Add New Component

1. 在 `src/components/` 创建组件文件夹
2. 实现组件逻辑
3. 导出组件
4. 在页面中引入使用
5. 如需国际化，在 locales 文件中添加文本

### 连接后端API | Connect Backend API

1. 在 `src/services/` 对应服务文件中编写API调用
2. 在页面或组件中导入服务函数
3. 使用 `useEffect` 或其他hooks调用API
4. 处理加载、错误、成功状态
5. 更新UI展示数据

### 切换语言 | Switch Language

在右上角语言选择器中选择语言（如果界面有该组件）。

---

## ⚙️ 项目配置 | Project Configuration

### 依赖版本 | Dependencies
```json
{
  "echarts": "6.0.0",      // 图表库
  "recharts": "3.3.0"      // React图表库
}
```

### TypeScript 支持 | TypeScript Support
项目完全支持 TypeScript，所有新增文件都包含完整的类型定义。

### 样式支持 | Styling
支持 LESS 和 CSS-in-JS，大部分组件都包含对应的样式文件。

---

## 🐛 调试 | Debugging

### 开发工具 | Dev Tools
```bash
# 启用 React DevTools
npm run dev
# 浏览器 F12 → Components tab
```

### 常见问题 | Common Issues

**问题**: 路由页面加载不出来
**解决**: 
- 检查 `config/routes.ts` 中的路由配置
- 确保页面文件存在且正确导出
- 检查页面导入路径是否正确

**问题**: 语言显示不正确
**解决**:
- 检查 locales 文件中的键值对是否完整
- 清除浏览器缓存
- 重启开发服务器

**问题**: 组件样式错乱
**解决**:
- 检查 LESS 或 CSS 文件是否正确导入
- 查看浏览器控制台是否有样式加载错误
- 检查样式优先级是否冲突

---

## 📚 文档 | Documentation

项目包含以下文档：

1. **README.md** - 项目概览
2. **INTEGRATION_SUMMARY.md** - 集成功能详细说明
3. **ROUTE_STRUCTURE.md** - 路由结构和分类
4. **CONFIG_SUMMARY.md** - 配置完成总结
5. **本文件** - 快速参考指南

---

## 🔗 相关链接 | Links

- **参考项目**: https://github.com/map-A/stock-front.git
- **Ant Design Pro**: https://pro.ant.design/
- **UmiJS**: https://umijs.org/
- **React**: https://react.dev/

---

## ✅ 检查清单 | Checklist

开发前请确认以下项目已完成：

- ✅ Node.js 已安装 (v16+)
- ✅ 依赖已安装 (`npm install` 或 `pnpm install`)
- ✅ 项目成功构建 (`npm run build`)
- ✅ 开发服务器可启动 (`npm run dev`)
- ✅ 所有新页面都可访问
- ✅ 语言切换功能正常

---

## 💡 开发建议 | Development Tips

1. **分模块开发**: 按功能分类开发，保持代码清晰
2. **及时提交**: 每个功能完成后及时提交代码
3. **编写测试**: 为关键功能编写单元测试
4. **代码审查**: 提交前进行代码审查
5. **文档更新**: 添加新功能时更新相关文档
6. **性能监控**: 使用浏览器DevTools监控性能
7. **错误处理**: 完善异常处理和用户提示

---

## 📞 支持 | Support

遇到问题？请参考：
1. 相关文档 (INTEGRATION_SUMMARY.md, ROUTE_STRUCTURE.md)
2. 浏览器控制台错误信息
3. 项目代码中的注释说明
4. 相关框架官方文档

---

**最后更新时间**: 2024-10-22  
**项目版本**: 1.0.0  
**状态**: ✅ 所有功能已集成并通过构建验证
