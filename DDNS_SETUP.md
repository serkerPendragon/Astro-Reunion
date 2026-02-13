# DDNS配置指南

## 为什么需要DDNS？

```
🌐 您的公网IP是动态的（会随时间变化）
🔄 DDNS（动态域名系统）可以将动态IP绑定到固定域名
🚀 解决了公网IP变化导致网站无法访问的问题
📱 手机可以通过固定域名访问您的网站
```

## 推荐免费DDNS服务

### 1. DuckDNS（推荐）

```
✅ 完全免费
✅ 无需信用卡
✅ 支持5个免费域名
✅ 配置简单
✅ 支持多种更新方式
```

### 2. No-IP
```
✅ 免费版支持3个域名
✅ 每月需要手动确认域名
✅ 有成熟的客户端
```

### 3. Dynu
```
✅ 免费版支持5个域名
✅ 无需手动确认
✅ 提供API支持
```

## 第一步：注册DuckDNS账户

### 1. 访问DuckDNS官网
```
📌 网址：https://www.duckdns.org
```

### 2. 注册账户
```
1. 点击右上角"Sign In"
2. 选择登录方式（Google、Twitter、Github等）
3. 授权登录后，进入控制面板
```

### 3. 创建域名
```
1. 在"subdomain"输入框中输入您想要的域名前缀
   例如：`myastro` → 完整域名：`myastro.duckdns.org`
2. 点击"Add Domain"
3. 域名创建成功后会显示在列表中
```

## 第二步：安装DDNS客户端

### 方法1：使用PowerShell脚本（推荐）

```powershell
# 创建DDNS更新脚本
cat > duckdns-update.ps1 << 'EOF'
$domain = "myastro"
$token = "YOUR_DUCKDNS_TOKEN"  # 替换为您的DuckDNS令牌

# 获取公网IP
$publicIP = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing).Content.Trim()

# 更新DDNS记录
$url = "https://www.duckdns.org/update?domains=$domain&token=$token&ip=$publicIP"
$result = Invoke-WebRequest -Uri $url -UseBasicParsing

if ($result.Content -eq "OK") {
    Write-Host "$(Get-Date) ✅ DDNS更新成功: $publicIP"
    return $true
} else {
    Write-Host "$(Get-Date) ❌ DDNS更新失败: $($result.Content)"
    return $false
}
EOF
```

### 方法2：使用Windows任务计划程序

```
1. 按 Win + R → 输入 `taskschd.msc` 打开任务计划程序
2. 点击"创建基本任务"
3. 名称："DuckDNS Update"
4. 触发器："每天" → "重复任务间隔：5分钟" → "持续时间：无限期"
5. 操作："启动程序"
6. 程序/脚本：`powershell.exe`
7. 添加参数：`-ExecutionPolicy Bypass -File "H:\github-program\astro-reunion\duckdns-update.ps1"`
8. 完成并启用任务
```

### 方法3：使用Node.js客户端

```bash
# 安装DuckDNS客户端
npm install -g duckdns-client

# 创建配置文件
cat > duckdns-config.json << 'EOF'
{
  "domains": ["myastro"],
  "token": "YOUR_DUCKDNS_TOKEN",
  "interval": 300
}
EOF

# 启动客户端
node -e "const DuckDNS = require('duckdns-client'); const config = require('./duckdns-config.json'); DuckDNS(config);"
```

## 第三步：配置与验证

### 1. 替换令牌
```
# 在DuckDNS控制面板复制您的令牌
# 替换脚本中的 YOUR_DUCKDNS_TOKEN
```

### 2. 测试更新脚本
```powershell
# 运行更新脚本
.uckdns-update.ps1

# 预期输出：
# 2026-02-12 15:30:00 ✅ DDNS更新成功: 1.31.0.253
```

### 3. 验证DDNS解析
```powershell
# 使用nslookup检查域名解析
nslookup myastro.duckdns.org

# 预期输出：
# 服务器:  UnKnown
# Address:  192.168.1.1
# 
# 非权威应答:
# 名称:    myastro.duckdns.org
# Address:  1.31.0.253  # 与您的公网IP一致
```

## 第四步：测试访问

### 1. 本地测试
```
在浏览器中访问：http://myastro.duckdns.org:8080
```

### 2. 手机测试
```
📱 关闭Wi-Fi，使用移动数据
🌐 访问：http://myastro.duckdns.org:8080
✅ 应该能正常打开网站
```

## 常见问题排查

### 1. 域名解析不正确
```
- 等待5-10分钟让DNS缓存更新
- 重启路由器清除DNS缓存
- 检查DDNS更新脚本是否执行成功
```

### 2. 端口无法访问
```
- 确认UPnP映射是否存在
- 检查防火墙是否允许8080端口
- 验证本地服务器是否正常运行
```

### 3. 脚本执行失败
```
- 检查PowerShell执行策略：`Get-ExecutionPolicy`
- 设置执行策略：`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- 检查网络连接是否正常
```

## 完整配置检查清单

```
✅ DuckDNS账户已注册
✅ 域名已创建（如：myastro.duckdns.org）
✅ 令牌已复制
✅ DDNS更新脚本已创建
✅ PowerShell执行策略已设置
✅ 任务计划程序已配置
✅ UPnP映射已存在（8080端口）
✅ 防火墙已允许8080端口
✅ 域名解析正常
✅ 手机可以通过域名访问网站
```

## 高级配置（可选）

### 1. 使用Docker运行DDNS客户端
```
docker run -d \n  --name duckdns \n  -e TZ=Asia/Shanghai \n  -e SUBDOMAINS=myastro \n  -e TOKEN=YOUR_DUCKDNS_TOKEN \n  -e LOG_FILE=true \n  linuxserver/duckdns
```

### 2. 配置SSL（HTTPS访问）
```
使用Let's Encrypt免费证书
结合Nginx反向代理实现HTTPS访问
```

---

**恭喜！** 您已完成DDNS配置，现在可以通过固定域名访问您的Astro网站了！