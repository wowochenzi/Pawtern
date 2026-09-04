# PAWTERN Mobile

儿童旧衣回收与 DIY 宠物服饰移动应用，基于 React、TypeScript 和 Vite。

## 在线访问

- 源码仓库：https://github.com/wowochenzi/Pawtern
- GitHub Pages（作业演示）：https://wowochenzi.github.io/Pawtern/
- 原演示站点（保留）：https://pawtern-wowochenzi.tiffanywowo.chatgpt.site

本项目是可交互的前端展示原型。预约、个人资料和面料订单保存在当前浏览器的
`localStorage` 中，不会跨浏览器或设备同步；支付与取件码为演示流程，不会发起真实扣款。
请勿填写真实敏感资料。静态托管配置位于 `.openai/hosting.json`。

当前界面以 iPhone 17 的 `402 × 874` 逻辑画布为基准。23 张 Figma 页面导出图位于
`public/reference`，交互热区和表单输入层叠加在对应页面上。首页、商店、消息和个人中心的
底部导航使用独立固定层，不参与内容区域滚动。

首页的当季活动支持自动轮播，并新增活动列表与三个活动详情页。底部导航中央的“＋”进入
社区笔记发布菜单，支持从相册选择、调用相机和纯文字发布。搜索、购物车、订单、宠物、
地址、收藏、设置、社区笔记和消息详情等可点击入口也已补齐。

## 本地运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

## GitHub Pages 部署

推送到 `main` 后，`.github/workflows/pages.yml` 会自动构建并发布到 GitHub Pages。
仓库的 **Settings → Pages → Source** 使用 **GitHub Actions**。

```bash
npm run build:github
npm run preview -- --mode github-pages
```

GitHub Pages 构建使用 `/Pawtern/` 作为网站路径；普通构建与本地开发仍使用 `/`。
页面继续使用 Hash 路由，图片、字体和原有视觉设计保持不变。

## 页面

应用实现了 23 个 Figma 页面，并用 Hash 路由组织：

- 引导页：`#/onboarding/1`、`#/onboarding/2`、`#/onboarding/3`
- 登录注册：`#/login`、`#/register`
- 首页：`#/home`、`#/home/diy`
- 活动：`#/activities`、`#/activity/1`、`#/activity/2`、`#/activity/3`
- 发布笔记：`#/publish`、`#/publish/editor`
- 旧衣回收：`#/recycle/pickup`、`#/recycle/dropoff`
- 工坊预约：`#/workshops`、`#/workshop/profile`、`#/workshop/diy`、`#/workshop/time`、`#/workshop/success`
- 面料：`#/fabrics`、`#/fabrics/detail`
- 商店：`#/shop`、`#/shop/kits`、`#/product`
- 消息与个人中心：`#/messages`、`#/profile`
- 成就：`#/achievements`、`#/achievements/action`
- 功能页：`#/search`、`#/cart`、`#/orders`、`#/pets`、`#/addresses`、`#/collections`、`#/settings`

Figma 导出的图像位于 `public/assets`，字体位于 `public/fonts`。
