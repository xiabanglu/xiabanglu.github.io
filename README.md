<div align="center">

# ✨ 夏帮路的个人博客

<p>
  <img src="https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3" />
</p>

<p>
  <a href="#-预览">预览</a> •
  <a href="#-功能特性">特性</a> •
  <a href="#-快速开始">快速开始</a> •
  <a href="#-项目结构">项目结构</a> •
  <a href="#-部署">部署</a>
</p>

<p>🌙 一款现代化的个人博客，支持主题切换、粒子动效、打字机动画</p>

[🚀 在线预览](https://xiabanglu.github.io) · [📧 联系我](#-联系方式)

</div>

---

## 📸 预览

<div align="center">

| 暗黑模式 | 亮色模式 |
|:--------:|:--------:|

</div>

### 🎬 动效展示

- ✨ **粒子背景** - Canvas 绘制的动态粒子连线效果
- ⌨️ **打字机动画** - 自动循环的打字机文字效果
- 🌟 **光标光晕** - 跟随鼠标的优雅光晕效果
- 🔄 **滚动渐显** - 元素进入视口时的渐显动画

---

## 🎯 功能特性

### 🎨 视觉体验

| 特性 | 描述 | 状态 |
|:----:|:-----|:----:|
| 🌓 主题切换 | 支持暗黑/亮色模式，自动保存偏好 | ✅ |
| ✨ 粒子背景 | Canvas 粒子动画，自适应主题色 | ✅ |
| ⌨️ 打字机效果 | 首屏标题动态打字效果 | ✅ |
| 🔮 光标光晕 | 桌面端鼠标跟随光晕 | ✅ |
| 📱 响应式 | 完美适配移动端和桌面端 | ✅ |

### 🛠 技术实现

| 特性 | 描述 |
|:----:|:-----|
| 🚀 Vue 3 Composition API | 现代化的组件开发方式 |
| ⚡ Vite 构建工具 | 极速的开发体验 |
| 🛣️ Vue Router | 单页应用路由管理 |
| 🎨 CSS Variables | 主题切换的核心实现 |
| 📦 组件化架构 | 模块化、可复用的组件设计 |

---

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/xiabanglu/blog-portfolio.git
cd blog-portfolio

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器访问
# http://localhost:5173
```

### 构建生产版本

```bash
# 构建
npm run build

# 预览生产版本
npm run preview
```

---

## 📁 项目结构

```
blog-portfolio/
├── 📂 public/                 # 静态资源
│   └── favicon.svg
│
├── 📂 src/
│   ├── 📂 assets/            # 资源文件
│   │
│   ├── 📂 components/        # 组件
│   │   ├── 📂 effects/       # 特效组件
│   │   │   ├── CursorGlow.vue     # 光标光晕
│   │   │   ├── ParticleBg.vue     # 粒子背景
│   │   │   ├── ScrollReveal.vue   # 滚动渐显
│   │   │   └── ScrollTop.vue      # 返回顶部
│   │   │
│   │   ├── 📂 layout/        # 布局组件
│   │   │   ├── Nav.vue            # 导航栏
│   │   │   └── Footer.vue         # 页脚
│   │   │
│   │   └── 📂 sections/      # 页面区块
│   │       ├── Hero.vue           # 首屏
│   │       ├── About.vue          # 关于我
│   │       ├── Projects.vue       # 项目展示
│   │       ├── Posts.vue          # 文章列表
│   │       ├── Skills.vue         # 技能专长
│   │       └── Contact.vue        # 联系我
│   │
│   ├── 📂 composables/       # 可复用逻辑
│   │   ├── useTheme.js            # 主题管理
│   │   └── useTypewriter.js       # 打字机效果
│   │
│   ├── 📂 data/              # 数据文件
│   │   └── posts.js               # 文章数据
│   │
│   ├── 📂 router/            # 路由配置
│   │   └── index.js
│   │
│   ├── 📂 views/             # 页面视图
│   │   ├── Home.vue
│   │   └── PostDetail.vue
│   │
│   ├── App.vue               # 根组件
│   ├── main.js               # 入口文件
│   └── style.css             # 全局样式
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🛠 技术栈

### 核心框架

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vue Router](https://img.shields.io/badge/Vue_Router-5.1-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)

### 前端技术

- **Vue 3** - 渐进式 JavaScript 框架
- **Composition API** - 更灵活的组件逻辑组织
- **Vue Router** - 官方路由管理器
- **CSS3** - 动画、渐变、滤镜效果
- **Canvas API** - 粒子动画实现

### 开发工具

- **Vite** - 下一代前端构建工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化

---

## 📦 部署

### GitHub Pages 部署

```bash
# 1. 安装 gh-pages
npm install gh-pages --save-dev

# 2. 构建项目
npm run build

# 3. 部署
git subtree push --prefix dist origin gh-pages
```

### Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### 其他平台

支持部署到任何静态托管平台：
- Netlify
- Surge
- 阿里云 OSS
- 腾讯云 COS

---

## 👨‍💻 关于作者

<table>
  <tr>
    <td align="center">
      <sub><b>夏帮路</b></sub>
      <br />
      <sub>NUIST · 计算机科学与技术</sub>
    </td>
  </tr>
</table>

### 个人简介

- 🎓 南京信息工程大学计算机科学与技术专业（大二在读）
- 💻 专注于前端开发，热爱技术与创作
- 🚀 独立完成 5+ 个项目，不断磨练编程能力
- 📝 记录学习心得，持续打磨代码质量

### 技术栈

```text
Frontend:  HTML5 | CSS3 | JavaScript | Vue.js | Vite | Webpack
Backend:   Node.js | MySQL
Languages: JavaScript | Java | C++
Tools:     Git | VS Code
```

---

## 📬 联系方式

<p>
  <a href="mailto:1795454076@qq.com">
    <img src="https://img.shields.io/badge/Email-1795454076@qq.com-EA4335?logo=gmail&logoColor=white" alt="Email" />
  </a>
  <a href="https://github.com/xiabanglu" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-xiabanglu-181717?logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/WeChat-x3579512486033416-07C160?logo=wechat&logoColor=white" alt="WeChat" />
  </a>
  <a href="tel:15358757659">
    <img src="https://img.shields.io/badge/Phone-15358757659-4285F4?logo=whatsapp&logoColor=white" alt="Phone" />
  </a>
</p>

---

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证开源。

```
MIT License

Copyright (c) 2024 夏帮路

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<div align="center">

### 🌟 Star History

如果这个项目对你有帮助，请给我一个 ⭐️ Star！

[![Star History Chart](https://api.star-history.com/svg?repos=xiabanglu/blog-portfolio&type=Date)](https://star-history.com/#xiabanglu/blog-portfolio&Date)

---

<p>
  用 ❤️ 和 Vue.js 构建
  <br />
  <sub>Made by 夏帮路 | © 2024</sub>
</p>

</div>
