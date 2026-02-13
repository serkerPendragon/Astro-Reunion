# DuckDNS配置与使用指南

## 📋 快速开始

### 第一步：注册DuckDNS账户

```
🌐 访问DuckDNS官网：https://www.duckdns.org
🔑 选择登录方式（Google、Twitter、Github等）
📝 登录后进入控制面板
```

### 第二步：创建域名

```
1. 在控制面板的"subdomain"输入框中输入域名前缀
   例如：`myastro` → 完整域名：`myastro.duckdns.org`
2. 点击"Add Domain"
3. 域名创建成功后会显示在列表中
```

### 第三步：获取DuckDNS令牌

```
🔑 在DuckDNS控制面板顶部找到您的令牌
📋 复制令牌（格式：xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx）
```

### 第四步：运行更新脚本

```powershell
# 使用示例（替换为您的实际信息）
.uckdns-update.ps1 -Domain "myastro" -Token "YOUR_DUCKDNS_TOKEN"

# 预期输出：
# =====================================
# 🔄 DuckDNS更新脚本开始执行
# 📅 2026-02-12 15:30:00
# =====================================
# 🌐 当前公网IP: 1.31.0.253
# ✅ DDNS更新成功
#    域名: myastro.duckdns.org
#    IP: 1.31.0.253
#    结果: OK
```

## ⚙️ 配置自动更新

### 方法1：使用Windows任务计划程序

```
1. 按 Win + R → 输入 `taskschd.msc` 打开任务计划程序
2. 点击"创建基本任务"
3. 名称：`DuckDNS Auto Update`
4. 触发器：`每天` → `重复任务间隔：5分钟` → `持续时间：无限期`
5. 操作：`启动程序`
6. 程序/脚本：`powershell.exe`
7. 添加参数：`-ExecutionPolicy Bypass -File "H:\github-program\astro-reunion\duckdns-update.ps1" -Domain "myastro" -Token "YOUR_DUCKDNS_TOKEN"`
8. 完成并启用任务
```

### 方法2：使用PowerShell后台运行

```powershell
# 创建后台运行脚本
cat > duckdns-background.ps1 << 'EOF'
while ($true) {
    .\duckdns-update.ps1 -Domain "myastro" -Token "YOUR_DUCKDNS_TOKEN"
    Start-Sleep -Minutes 5
}
EOF

# 后台运行
Start-Process -FilePath "powershell.exe" -ArgumentList "-ExecutionPolicy Bypass -File duckdns-background.ps1" -WindowStyle Hidden
```

## 🔍 验证配置

### 1. 检查域名解析

```powershell
# 使用nslookup检查
nslookup myastro.duckdns.org

# 预期输出：
# 服务器:  UnKnown
# Address:  192.168.1.1
# 
# 非权威应答:
# 名称:    myastro.duckdns.org
# Address:  1.31.0.253  # 与您的公网IP一致
```

### 2. 测试访问

```
📱 关闭手机Wi-Fi，使用移动数据
🌐 在浏览器中访问：http://myastro.duckdns.org:8080
✅ 应该能正常打开您的Astro网站
```

## 🚨 常见问题排查

### 问题1：脚本执行失败

```
❌ 错误：无法加载文件 duckdns-update.ps1，因为在此系统上禁止运行脚本

💡 解决方案：设置PowerShell执行策略
```

```powershell
# 设置当前用户的执行策略
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 查看执行策略
Get-ExecutionPolicy -Scope CurrentUser
```

### 问题2：无法获取公网IP

```
❌ 错误：无法获取公网IP地址，请检查网络连接

💡 解决方案：
1. 检查网络连接
2. 确保可以访问外部网站
3. 尝试重启路由器
```

### 问题3：DDNS更新失败

```
❌ 错误：DDNS更新失败

💡 解决方案：
1. 检查DuckDNS令牌是否正确
2. 检查域名是否存在于DuckDNS控制面板
3. 检查网络连接是否正常
4. 查看DuckDNS控制面板的日志
```

### 问题4：域名无法访问

```
❌ 错误：手机无法访问 http://myastro.duckdns.org:8080

💡 解决方案：
1. 检查UPnP映射是否存在（外部端口8080 → 本地端口8080）
2. 检查防火墙是否允许8080端口
3. 验证本地服务器是否正常运行
4. 使用nslookup检查域名解析是否正确
```

## 📁 文件说明

### `duckdns-update.ps1`
```
✅ DuckDNS更新脚本
✅ 自动获取公网IP
✅ 智能更新DDNS记录
✅ 完善的错误处理
✅ 多种IP检测服务备份
```

### `DUCKDNS_USAGE.md`
```
✅ 详细的配置与使用说明
✅ 常见问题排查
✅ 自动更新配置指南
```

## 🎯 最佳实践

### 安全建议

```
🔒 不要在脚本中硬编码令牌（虽然本例中需要这样做）
🔒 定期更换DuckDNS令牌
🔒 仅在信任的网络环境中使用
```

### 性能优化

```
⚡ 更新间隔建议：5-10分钟
⚡ 避免过于频繁的更新
⚡ 使用任务计划程序代替后台脚本
```

### 监控与维护

```
📊 定期检查脚本执行日志
🔧 确保服务器和UPnP映射正常运行
📱 定期使用手机测试访问
```

## 📞 支持

如果遇到问题：

1. 检查DuckDNS官方文档：https://www.duckdns.org/spec.jsp
2. 查看脚本执行日志
3. 检查网络连接和防火墙设置
4. 重启路由器和服务器

---

**🎉 恭喜！** 您现在已经完成了DuckDNS的配置，可以通过固定域名访问您的Astro网站了！
