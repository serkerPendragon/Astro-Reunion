# 本地实际应用环境部署报告

## 📋 部署状态

```
✅ 项目构建完成
✅ 生产服务器已启动
✅ 本地访问正常
✅ 基础配置已完成
```

## 🚀 服务器信息

| 项目 | 详情 |
|------|------|
| **服务器类型** | Astro 生产预览服务器 |
| **运行端口** | 80（默认HTTP端口） |
| **本地访问地址** | http://localhost |
| **局域网访问地址** | http://192.168.5.2 |
| **构建时间** | 2026-02-12 17:08:23 |
| **页面数量** | 19个页面 |
| **静态资源** | 252个资源文件（图片、CSS、JS等） |

## 🔍 验证结果

### 本地访问
```
✅ 访问地址: http://localhost
✅ 状态码: 200 OK
✅ 响应大小: 112,634 字节
✅ 页面加载正常
```

### 局域网访问
```
📱 手机或其他设备连接到同一WiFi网络
🌐 访问地址: http://192.168.5.2
```

## 🎯 使用方法

### 访问网站

```
# 本地访问
http://localhost

# 局域网内其他设备访问
http://192.168.5.2
```

### 管理服务器

```powershell
# 停止服务器
Get-Process -Name node | Where-Object {$_.CommandLine -like "*astro*" -or $_.CommandLine -like "*preview*"} | Stop-Process -Force

# 重新启动服务器
npx astro preview --host 0.0.0.0 --port 80

# 重新构建项目
npm run build
```

## ⚙️ 配置文件

### 1. 项目配置 (astro.config.mjs)
```javascript
export default defineConfig({
    markdown: {
        shikiConfig: {
            theme: "one-dark-pro",
        },
    },
    integrations: [react(), tailwind({applyBaseStyles: false})],
    vite: {
        server: {
            allowedHosts: ['astro.local', 'localhost', '127.0.0.1', '0.0.0.0']
        }
    }
});
```

### 2. 依赖配置 (package.json)
```json
{
  "name": "astro-arknights",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

## 🔒 安全配置

### 防火墙设置

```powershell
# 查看防火墙规则
Get-NetFirewallRule -DisplayName "*80*" -Direction Inbound

# 添加防火墙规则（如果需要）
New-NetFirewallRule -DisplayName "Allow Astro Web Server" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow
```

### UPnP端口映射（可选）

```powershell
# 使用UPnP将外部端口80映射到本地端口80
node upnp-map-8080.cjs
```

## 📅 维护计划

### 定期维护

```
1. 每周检查服务器状态
2. 每月更新依赖包
3. 定期备份项目文件
4. 监控网站访问情况
```

### 更新项目

```powershell
# 更新依赖
pnpm update

# 重新构建
npm run build

# 重启服务器
npx astro preview --host 0.0.0.0 --port 80
```

## 📚 附加功能

### DuckDNS配置（可选）

如果需要通过域名访问网站，可以配置DuckDNS：

```powershell
# 运行DuckDNS更新脚本
.\duckdns-update.ps1 -Domain "yourdomain" -Token "your-token"

# 配置自动更新
.\setup-task-scheduler.ps1
```

详细指南请查看：`DUCKDNS_USAGE.md`

### 公网访问（可选）

```
1. 确保UPnP已开启
2. 配置DuckDNS域名
3. 确保防火墙允许端口80访问
4. 使用手机4G网络测试访问
```

## 🚨 常见问题

### 1. 服务器无法启动

```
❌ 错误：端口已被占用
💡 解决方案：检查端口80是否被其他程序占用
netstat -ano | findstr :80
```

### 2. 本地访问失败

```
❌ 错误：无法连接到服务器
💡 解决方案：
1. 检查服务器是否运行
2. 检查防火墙设置
3. 尝试使用不同的浏览器
```

### 3. 局域网访问失败

```
❌ 错误：其他设备无法访问
💡 解决方案：
1. 检查设备是否在同一WiFi网络
2. 检查防火墙设置
3. 确保服务器绑定到0.0.0.0
```

## 📞 支持

如果遇到问题，可以：

1. 查看项目文档：`README.md`
2. 检查部署日志
3. 重启服务器和路由器
4. 重新构建项目

---

**部署完成！** 您的Astro网站已成功部署到本地实际应用环境。
