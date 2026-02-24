---
name: create-zhipuai-token
description: 在智谱AI开放平台（BigModel）创建 API Token/Key。当用户提到智谱AI、BigModel、GLM、创建token、API key、智谱开放平台时使用此技能。
---

# 智谱AI 创建 API Token

## 关键信息

- **平台地址**：`https://bigmodel.cn`（注意：`open.bigmodel.cn` 会重定向到同一平台）
- **API Key 管理页面**（正确地址）：`https://bigmodel.cn/usercenter/proj-mgmt/apikeys`
  - ⚠️ 注意末尾是 `apikeys`（复数，带 s），写成 `apikey` 会跳转到 404

## 操作步骤

### 1. 导航到 API Key 页面

```
https://bigmodel.cn/usercenter/proj-mgmt/apikeys
```

- 若未登录会跳转到登录页，需先登录
- 若页面空白，等待 2-3 秒后获取快照，页面为单页应用（SPA），需要等待 JS 渲染

### 2. 点击创建按钮

页面右上角有 **"+ Create a new API key"** 按钮（ref 通常为 `e36`）。

### 3. 填写名称并确认

- 在弹出的对话框中填写 API Key 名称（如 `my-api-key`）
- 点击 **"Yes"** 按钮确认创建（点击后按钮文字变为 `Creating...` 表示正在创建）

### 4. 验证创建成功

刷新页面后，列表中出现新的一行即表示创建成功。API Key 格式为：
```
{API Key ID}.{secret}
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 跳转到 404 | URL 拼写错误（`apikey` 缺少 s） | 使用正确地址 `apikeys` |
| 页面空白 | SPA 渲染需要时间 | 等待 2-3 秒后重新获取快照 |
| 跳转到登录页 | 浏览器无登录 Cookie | 需要用户先在该浏览器中登录账号 |
| 直接访问 404 后刷新仍 404 | SPA 路由问题 | 先导航到首页 `bigmodel.cn` 再跳转 |

## 注意事项

- API Key 创建后完整内容**只显示一次**，需提醒用户及时复制保存
- 平台 UI 为英文界面
- 登录方式：手机号验证码 / 账号密码 / 微信扫码 / CCF 账号
