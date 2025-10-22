# 侧边栏菜单显示问题排查指南

## 问题现象

设置菜单的子项显示为 `settings.system` 和 `settings.user`，而不是对应的中文翻译 `系统设置` 和 `个人设置`。

## 原因分析

UmiJS 通过以下流程来显示菜单标签：

1. **读取路由配置**: 获取 `name` 字段的值
2. **查找翻译**: 在国际化文件中查找 `menu.{name}` 键
3. **显示标签**: 显示对应的翻译内容

如果菜单显示的是 `settings.system`（英文原文），说明：
- ❌ 翻译文件中找不到对应的键
- ❌ 或者翻译文件没有被正确加载

## 完整排查清单

### 1️⃣ 检查菜单翻译是否存在

✅ **中文菜单** (src/locales/zh-CN/menu.ts)
```typescript
'menu.settings': '设置',
'menu.settings.system': '系统设置',  // ← 必须有这一行
'menu.settings.user': '个人设置',    // ← 必须有这一行
```

✅ **英文菜单** (src/locales/en-US/menu.ts)
```typescript
'menu.settings': 'Settings',
'menu.settings.system': 'System Settings',  // ← 必须有这一行
'menu.settings.user': 'Personal Settings',  // ← 必须有这一行
```

### 2️⃣ 检查路由配置

✅ **路由** (config/routes.ts)
```typescript
{
  path: '/settings',
  name: 'settings',
  icon: 'SettingOutlined',
  routes: [
    { path: '/settings/system', component: './SystemSettings', name: 'settings.system' },
    { path: '/settings/user', component: './UserSettings', name: 'settings.user' },
  ],
}
```

### 3️⃣ 检查翻译文件是否被引入

✅ **中文主入口** (src/locales/zh-CN.ts)
```typescript
import menu from './zh-CN/menu';

export default {
  ...menu,  // ← 必须有这一行来合并菜单翻译
};
```

✅ **英文主入口** (src/locales/en-US.ts)
```typescript
import menu from './en-US/menu';

export default {
  ...menu,  // ← 必须有这一行来合并菜单翻译
};
```

## 常见问题及解决方案

### 问题 1: 菜单显示英文而不是中文

**症状**: 侧边栏显示 `settings.system` 而不是 `系统设置`

**原因**: 找不到对应的翻译键

**解决方案**:

1. 确认菜单翻译文件中有完整的键值对
2. 清空浏览器缓存
3. 重新启动开发服务器

```bash
# 清空缓存并重启
rm -rf node_modules/.cache
npm run dev
```

4. 如果仍未解决，尝试完整重建：

```bash
npm run build
```

### 问题 2: 切换语言后菜单仍显示英文

**症状**: 中英文切换后，菜单仍显示相同的内容

**原因**: 国际化系统未正确刷新

**解决方案**:

1. 检查浏览器开发者工具的 Console 是否有错误
2. 刷新页面
3. 检查 localStorage 中的语言设置

```javascript
// 在浏览器 Console 中检查
localStorage.getItem('umi_locale')  // 应该返回 'zh-CN' 或 'en-US'
```

### 问题 3: 新增菜单后显示不正常

**症状**: 新增的子菜单项无法正确显示

**解决方案**:

确保按照以下步骤添加新菜单：

1. **在 config/routes.ts 中添加路由**
```typescript
{ path: '/settings/xxx', component: './XXX', name: 'settings.xxx' }
```

2. **在 src/locales/zh-CN/menu.ts 中添加中文翻译**
```typescript
'menu.settings.xxx': '中文标签',
```

3. **在 src/locales/en-US/menu.ts 中添加英文翻译**
```typescript
'menu.settings.xxx': 'English Label',
```

4. **重启开发服务器**
```bash
npm run dev
```

## 验证步骤

### 步骤 1: 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:8000

### 步骤 2: 检查侧边栏

✅ 设置菜单应显示为：
- **中文**: ⚙️ 设置
  - 🔧 系统设置
  - 👤 个人设置

- **英文**: ⚙️ Settings
  - 🔧 System Settings
  - 👤 Personal Settings

### 步骤 3: 测试语言切换

1. 点击右上角的语言选择器
2. 切换到英文
3. 侧边栏菜单应该立即更新为英文
4. 再次切换回中文
5. 侧边栏菜单应该显示中文

## 调试技巧

### 在浏览器 Console 中检查翻译

```javascript
// 检查是否能获取翻译
const intl = window.g_intl;
console.log(intl.formatMessage({ id: 'menu.settings.system' }));
// 应该输出: "系统设置"
```

### 检查路由配置

```javascript
// 在页面中检查路由是否正确
console.log(window.g_routes);
```

## 如果问题仍未解决

请按以下步骤操作：

1. **清空所有缓存**
```bash
rm -rf dist node_modules/.cache .umi
npm install
npm run build
npm run dev
```

2. **检查是否有拼写错误**
   - 确保 `menu.settings.system` 在所有文件中拼写一致
   - 不要漏掉任何字符

3. **重启浏览器**
   - 关闭所有浏览器标签页
   - 清空浏览器缓存
   - 重新打开应用

4. **查看浏览器控制台**
   - 打开 F12 开发者工具
   - 查看 Console 标签中是否有错误信息
   - 查看 Network 标签确保所有资源都加载成功

## 成功验证

✅ 如果以下条件都满足，说明菜单配置正确：

- [ ] 中文模式下显示中文菜单标签
- [ ] 英文模式下显示英文菜单标签
- [ ] 切换语言后菜单立即更新
- [ ] 没有在 Console 中看到错误信息
- [ ] 所有子菜单项都能正确显示
- [ ] 点击菜单项能正确导航到对应页面

## 相关文件位置

```
src/locales/
├── zh-CN/
│   ├── menu.ts          ← 中文菜单翻译
│   └── zh-CN.ts         ← 中文入口
└── en-US/
    ├── menu.ts          ← 英文菜单翻译
    └── en-US.ts         ← 英文入口

config/
└── routes.ts            ← 路由配置
```

## 常用命令

```bash
# 启动开发服务器
npm run dev

# 完整重建
npm run build

# 清空缓存
rm -rf dist node_modules/.cache .umi

# 重新安装依赖
npm install
```
