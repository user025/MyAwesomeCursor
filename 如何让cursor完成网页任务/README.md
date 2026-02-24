# 如何让cursor点击网页

## 1. 安装mcp

打开cursor的mcp配置，添加以下内容，就可以安装chrome的官方mcp

```
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
```

## 2. 重启cursor

退出所有cursor进程，最好用pgrep -f -l cursor 确认下

## 3. 在chat中，指定使用mcp-tool

输入以下prompt:
```
使用chrome-mcp打开智谱ai官网，添加一个api-key
```

## 4. 等待漫长的操作完成后，输入以下prompt

```
将以上过程总结成skills.md
```