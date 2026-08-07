# DropPage

`DropPage` 是为 **Qi Wensong / 文山木公（OVWS）** 制作的个人主页。

它以 Dropbox Brand 首页的滚动磁贴交互为结构参考：页面不是普通的区块式 landing page，而是一个随滚动收拢的个人目录。中心方块从个人宣言缩为 OVWS 标记，周围八张磁贴则收拢为博客、工具、服务和作品入口。

## 页面内容

- 文山木公 / Qi Wensong 的个人简介与理念
- `鏡花水月`、搜索、图床、临时邮箱、短链接、简历与 AI 对话等公开入口
- 滚动驱动的中心方块缩放和磁贴收拢动效
- 可打开的个人档案侧栏
- 桌面与移动端响应式布局

## 运行

```bash
npm install
npm run dev
```

## 验证

```bash
npm run lint
npm test
```

## 参考与边界

页面研究文档位于 `docs/research/`。它复现了目标站的滚动布局、色彩密度和互动模型；Dropbox 的名称、标志、文案与图形资产均未使用，页面内容和标识均替换为 OVWS 自身资料。
