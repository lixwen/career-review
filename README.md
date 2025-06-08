# 转正述职报告 - 交互式思维导图

这是一个使用 **D3.js + React + Next.js** 构建的交互式述职展示页面，采用现代化的思维导图形式来展示工作成果、收获和思考。

## ✨ 特性

- 🗺️ **交互式思维导图**: 基于 D3.js 的力导向图，支持拖拽和缩放
- 🎨 **现代化UI设计**: 使用 Tailwind CSS 和 Framer Motion 实现的精美界面
- 📱 **响应式布局**: 适配各种设备尺寸
- 🔍 **详情面板**: 点击节点查看详细内容
- 🎯 **多层级结构**: 支持主模块、子模块的层级展示
- ✨ **平滑动画**: 丰富的交互动画效果

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **UI库**: React 18
- **样式**: Tailwind CSS
- **数据可视化**: D3.js
- **动画**: Framer Motion
- **图标**: Lucide React
- **语言**: TypeScript
- **部署**: GitHub Pages

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看效果

### 构建部署

```bash
# 构建静态文件
npm run build

# 导出静态文件（用于GitHub Pages）
npm run export
```

## 📁 项目结构

```
src/
├── app/
│   ├── components/          # React 组件
│   │   ├── MindMap.tsx     # 思维导图主组件
│   │   └── DetailPanel.tsx # 详情面板组件
│   ├── data/               # 数据文件
│   │   └── careerData.ts   # 述职数据结构
│   ├── page.tsx            # 主页面
│   └── layout.tsx          # 布局组件
├── .github/workflows/       # GitHub Actions
└── README.md
```

## 🎯 功能说明

### 思维导图交互

- **点击节点**: 查看详细内容
- **拖拽节点**: 调整节点位置
- **鼠标滚轮**: 缩放视图
- **拖拽空白区域**: 移动整个视图

### 节点类型

- 🎯 **中心节点**: 述职主题
- 📋 **主要模块**: 工作回顾、收获、思考等
- 📌 **子模块**: 具体的工作内容和详细信息

## 📊 数据结构

数据采用树形结构，每个节点包含：

```typescript
interface TreeNode {
  id: string;           // 唯一标识
  name: string;         // 节点名称
  description?: string; // 节点描述
  details?: string[];   // 详细内容列表
  children?: TreeNode[]; // 子节点
  category: string;     // 节点类型
  color: string;        // 节点颜色
  icon?: string;        // 节点图标
}
```

## 🌐 GitHub Pages 部署

项目已配置自动部署到 GitHub Pages：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建和部署
3. 访问 `https://[username].github.io/[repository-name]`

### 手动部署步骤

1. 在 GitHub 仓库设置中启用 Pages
2. 选择 `gh-pages` 分支作为源
3. 推送代码触发自动部署

## 📝 自定义内容

修改 `src/app/data/careerData.ts` 文件来自定义你的述职内容：

```typescript
export const careerData: TreeNode = {
  id: 'root',
  name: '你的述职主题',
  // ... 其他配置
  children: [
    // 添加你的模块
  ]
};
```

## 🎨 样式定制

- 修改 `tailwind.config.js` 自定义主题色彩
- 在组件中调整 CSS 类名
- 修改 `careerData.ts` 中的颜色配置

## 🔧 开发建议

1. **节点数量**: 建议单层不超过 8 个节点，保持界面清晰
2. **内容长度**: 详细内容控制在合理长度，避免面板过长
3. **颜色搭配**: 使用和谐的色彩搭配，提升视觉效果
4. **图标选择**: 使用有意义的 emoji 或图标增强表达力

## 📄 许可证

MIT License

---

**💡 提示**: 这是一个展示现代前端技术和交互设计的项目，适合作为技术述职、项目展示等场景使用。
