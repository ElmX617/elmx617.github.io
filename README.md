# 日子慢慢

ElmX617 的生活日记。使用 [Hugo Theme Diary](https://github.com/AmazingRise/hugo-theme-diary)，加入按日期查找文章的日历。网站公开访问。

网站地址：https://elmx617.github.io/

## 本地预览

需要 Hugo Extended 0.165.0（与自动发布使用的版本一致）。初次下载仓库时带上主题：

```powershell
git clone --recurse-submodules https://github.com/ElmX617/elmx617.github.io.git
cd elmx617.github.io
hugo server
```

打开 http://localhost:1313/ 。预览草稿时用 `hugo server -D`。

## 写一篇日记

最简单：在 GitHub 的 `content/posts/` 目录创建 `2026-10-10.md`，填写：

```markdown
---
title: "今天的小事"
date: 2026-10-10T20:00:00+08:00
draft: false
tags: ["日常"]
description: "今天值得记住的一句话。"
---

这里写正文。
```

提交到 `main` 后，GitHub Actions 自动更新网站和日历。一天可以写多篇，给文件起不同名字即可；日历会一起列出。文章的 `date` 决定归属哪一天，日期填未来时会暂不发布。

本地也可以用 `hugo new content posts/2026-10-10/index.md` 新建草稿。写完后改成 `draft: false`，再提交。

配图：将图片放在文章同一个文件夹里，例如 `content/posts/2026-10-10/photo.jpg`，正文写 `![照片说明](photo.jpg)`。如果需要首页封面，在文章头部加 `featured_image: "photo.jpg"`。

第一篇《从今天开始，把日子写下来》是示例，内容可以直接修改或删除。网站名称、简介在 `hugo.toml` 修改，关于页在 `content/about.md` 修改。

## 日历

- 首页和 `/calendar/` 显示日历，有圆点表示当天有日记。
- 支持上月、下月、指定月份、回到本月，点击日期显示当天所有日记。
- 今天按中国时区计算，草稿和未发布的未来文章不进入正式网站。
- 不需要数据库。日历数据由 Hugo 生成，完整覆盖文章列表，不受分页限制。
- `/calendar/?date=2026-10-09` 可直接打开指定日期。

## 首次发布

创建公开仓库 `elmx617.github.io`，推送整个项目（包括 `.gitmodules` 和主题引用）。在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。然后在 Actions 运行 `Publish diary`。

采用官方 Pages 发布流程，自动安装 Hugo Extended。原始日记和图片也在公开仓库中，请只提交愿意公开的内容。

## 主题

主题固定在 Git 子模块的一个提交，日历修改都在根目录 `layouts/` 和 `static/`，没有改动上游主题。这样后续更新主题时，自己的模块不容易被覆盖。
