<#
.SYNOPSIS
DuckDNS更新脚本 - 自动将动态IP绑定到DuckDNS域名

.DESCRIPTION
此脚本会定期检查公网IP地址，如果发生变化则自动更新DuckDNS记录

.PARAMETER Domain
DuckDNS域名前缀（如：myastro -> myastro.duckdns.org）

.PARAMETER Token
DuckDNS令牌（在DuckDNS控制面板获取）

.EXAMPLE
# 运行脚本
.\duckdns-update.ps1 -Domain "myastro" -Token "YOUR_DUCKDNS_TOKEN"

# 预期输出：
# 2026-02-12 15:30:00 ✅ DDNS更新成功: 1.31.0.253
# 域名: myastro.duckdns.org
# IP: 1.31.0.253

.NOTES
- 确保已安装PowerShell 5.0或更高版本
- 需要网络连接
- DuckDNS官网: https://www.duckdns.org
#>

param(
    [Parameter(Mandatory=$true, HelpMessage="DuckDNS域名前缀")]
    [string]$Domain,
    
    [Parameter(Mandatory=$true, HelpMessage="DuckDNS令牌")]
    [string]$Token
)

function Get-PublicIP {
    <#
    .SYNOPSIS
    获取当前公网IP地址
    #>
    $ipServices = @(
        "https://api.ipify.org",
        "https://icanhazip.com",
        "https://ifconfig.me"
    )
    
    foreach ($service in $ipServices) {
        try {
            $ip = (Invoke-WebRequest -Uri $service -UseBasicParsing -TimeoutSec 10).Content.Trim()
            if ($ip -match '^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$') {
                return $ip
            }
        } catch {
            Write-Host "⚠️  $service 获取失败: $($_.Exception.Message)"
        }
    }
    
    Write-Error "无法获取公网IP地址，请检查网络连接"
    return $null
}

function Update-DuckDNS {
    <#
    .SYNOPSIS
    更新DuckDNS记录
    #>
    param(
        [string]$Domain,
        [string]$Token,
        [string]$IP
    )
    
    try {
        $url = "https://www.duckdns.org/update?domains=$Domain&token=$Token&ip=$IP"
        $result = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 15
        
        return @{
            Success = $result.Content -eq "OK"
            Content = $result.Content
            Message = $result.Content -eq "OK" ? "更新成功" : "更新失败"
        }
    } catch {
        return @{
            Success = $false
            Content = $null
            Message = "请求失败: $($_.Exception.Message)"
        }
    }
}

# 主程序开始
Write-Host "====================================="
Write-Host "🔄 DuckDNS更新脚本开始执行"
Write-Host "📅 $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")"
Write-Host "====================================="

# 获取公网IP
$publicIP = Get-PublicIP
if (-not $publicIP) {
    Write-Host "❌ 脚本执行失败: 无法获取公网IP" -ForegroundColor Red
    exit 1
}

Write-Host "🌐 当前公网IP: $publicIP" -ForegroundColor Cyan

# 更新DuckDNS记录
$updateResult = Update-DuckDNS -Domain $Domain -Token $Token -IP $publicIP

# 输出结果
if ($updateResult.Success) {
    Write-Host "✅ DDNS更新成功" -ForegroundColor Green
    Write-Host "   域名: $Domain.duckdns.org" -ForegroundColor Green
    Write-Host "   IP: $publicIP" -ForegroundColor Green
    Write-Host "   结果: $($updateResult.Content)" -ForegroundColor Green
    return $true
} else {
    Write-Host "❌ DDNS更新失败" -ForegroundColor Red
    Write-Host "   原因: $($updateResult.Message)" -ForegroundColor Red
    Write-Host "   域名: $Domain.duckdns.org" -ForegroundColor Red
    Write-Host "   IP: $publicIP" -ForegroundColor Red
    return $false
}
