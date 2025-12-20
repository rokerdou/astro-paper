---
author: Sat Naing
pubDatetime: 2022-09-23T15:22:00Z
modDatetime: 2025-06-13T16:52:45.934Z
title: Dokploy替代Vercel,一键式部署教程
slug: Dokploy
featured: true
draft: false
tags:
  - dokploy
coverImage: https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop
description:
  Vercel 大家都用很熟练了，但是有一些项目利润低又占用大量资源，部署在 Vercel 性价比很低，这时候就可以考虑它的开源平替 Dokploy 了。
  本文详细介绍如何使用 Dokploy 部署 Next.js 项目，包含服务器购买、Dokploy 安装配置、直接部署和 GitHub Actions 自动化部署两种方案，帮助你快速完成项目上线
---

Here are some rules/recommendations, tips & ticks for creating new posts in AstroPaper blog theme.

<figure>
  <img
    src="https://images.pexels.com/photos/159618/still-life-school-retro-ink-159618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    alt="Free Classic wooden desk with writing materials, vintage clock, and a leather bag. Stock Photo"
  />
    <figcaption class="text-center">
    Photo by <a href="https://www.pexels.com/photo/brown-wooden-desk-159618/">Pixabay</a>
  </figcaption>
</figure>

## Table of contents
## 什么是 Dokploy
Dokploy 是一个开源的自托管 PaaS（Platform as a Service）平台，可作为 Vercel、Netlify、Railway、Zeabur 等服务的开源替代方案。
![123](/wp-content/uploads/2025/11/123-300×190.webp){.alignnone}
## 服务器准备与 Dokploy 安装
使用 Dokploy 需要自行购买服务器。如果你不确定选择哪家服务商，可以考虑 hostinger。对于项目初期，2核8G 的 VPS 就足够使用，月费仅需 $6.49。

## 配置服务器
完成付款后，按照页面提示完成 VPS 设置。配置完成后，控制台会显示 VPS 已启动。
接下来需要配置防火墙规则。Hostinger 默认没有防火墙规则，这意味着所有端口都处于开放状态，存在安全风险。我们需要创建防火墙规则，开放 22、80、443、3000 端口的访问权限。
1. 80,443是作为网站的访问端口，当然我们可以部署多个网站以docker的形式在dokploy中部署，然后dokploy会用内置的反向代理，把你的域名分别反向代理到不同的docker容器。
1. 3000端口是安装dokploy是需要对外访问的端口，当然当我们部署结束后也可以关闭这个端口。
2. 22端口远程登录使用。

![123](https://s.web.cafe/image/d6de15bd202143fd945b8f5d65fee5c2.webp){.alignnone}{.alignnone}
**提醒VPS最好安装ubuntu的操作系统，对于dokploy部署会更加容易**

使用 SSH 登录 VPS，执行 Dokploy 安装命令：
curl -sSL https://dokploy.com/install.sh | sh
提示下图就是已经安装成功了
![123](https://s.web.cafe/image/7cca013ced5643d9845506f327b1cc8c.webp){.alignnone}
访问VPS:3000则可以进入Dokploy的管理页面
## 配置 Dokploy
注册并登录后，首先为管理后台设置自定义域名：
**注意这里增加的域名是Dokploy的后台管理域名，你可以取dokploy.xxx.com等等都可以，配置结束后需将对应的DNS 的A记录指向VPS的IP即可实现访问**
这里有很多小伙伴遇到访问域名404的情况，如果遇到说明DNS配置正常了，多因为如下几种情况。
1. Dokploy配置的域名要确定是http还是https，和浏览器访问要保持一致。
2. Dokploy 反向代理生效延迟，你可以去web server查看反向代理的日志，或者重启Dokploy。
![123](https://s.web.cafe/image/74e34d37ad66438a9104d08baa65a3cd.webp)

然后在域名解析平台（以 CloudFlare 为例）添加该自定义域名的解析记录，选择 A 类型解析，IP 地址填写服务器地址。

![123](https://s.web.cafe/image/54ef0491d8894a20adacf798defee1ad.webp)
解析生效后，就可以通过自定义域名访问 Dokploy 管理后台了。
最后，绑定你的 Git 账号，如下图所示：

![123](https://s.web.cafe/image/db68cd445e7340edac70e1b16361deab.webp)

部署方案一：直接部署
Dokploy 提供了类似 Vercel 的可视化部署界面，但在性能较弱的服务器上容易因资源不足导致服务器崩溃或重启。因此，直接部署方式仅适合小型项目。
创建 Project，然后创建 Service：
![123](https://s.web.cafe/image/dab787a7494b4b2bac1aeb991e002b15.webp)
进入 Service 页面，设置 Provider，依次选择 Github Account、Repository、Branch，然后点击 Save：
![123](https://s.web.cafe/image/388d58e4dfa54399998e9d84520d5bb3.webp)

接着点击上方的 Deploy 按钮：
![123](https://s.web.cafe/image/1110296c14e54c6dba53da60ef7a4fbd.webp)
设置环境变量，每次修改后需要重新部署项目：
![123](https://s.web.cafe/image/5e8c7279171a4333b58040df410db22c.webp)
配置自定义域名
**这里注意两个点一个是HTTP还是HTTPS，浏览器访问的时候要保持一致。
**
**这里的端口信息是填写docker内部应用的端口，不是对外映射的端口**
![123](https://s.web.cafe/image/ec0612499b4b42de8943776c6576009d.webp)
创建完成后，需要在 Cloudflare 设置 DNS：
![123](https://s.web.cafe/image/6eca01f152044a59acaf4b303681d774.webp
)

A 记录：
your-domain.com -> 你的服务器 IP
开启 Proxy

CNAME 记录：
www.your-domain.com -> 你的服务器 IP
开启 Proxy

然后打开 SSL/TLS 设置，选择 Full 或 Flexible：
![123](https://s.web.cafe/image/c44f3ca8546b437594fb47fabf7b879e.webp)
设置重定向，进入 Advanced – Redirects
![123](https://s.web.cafe/image/8d57fc1069fb46659b939457968f367c.webp)

![123](https://s.web.cafe/image/14d8bfa1c3ed480b9417e4959071f24b.webp)
我习惯将 www 域名重定向到不带 www 的域名，所以选择了 Redirect to non-www
![123](https://s.web.cafe/image/72aaa81f4a1f4193baa102c7fbf4d0af.webp)
完成以上配置后，项目就可以在 Dokploy 上成功运行了。之后每次提交代码都会自动触发部署。

> Since AstroPaper v1.4.0, OG images will be generated automatically if not specified. Check out [the announcement](https://astro-paper.pages.dev/posts/dynamic-og-image-generation-in-astropaper-blog-posts/).
