<#
.SYNOPSIS
配置Windows任务计划程序自动更新DuckDNS
.DESCRIPTION
创建定期运行DDNS更新脚本的任务计划
.EXAMPLE
.etup-task-scheduler.ps1
#>

# 配置参数
$taskConfig = @{
    TaskName = "DuckDNS IP Update"
    TaskDescription = "定期更新DuckDNS动态域名记录"
    ScriptPath = "H:\github-program\astro-reunion\duckdns-update.ps1"
    User = "SYSTEM"  # 使用系统账户运行
    Trigger = @{
        Frequency = "Minute"  # 更新频率：Minute/Hour/Day
        Interval = 5  # 间隔时间（分钟）
        StartTime = Get-Date  # 开始时间
    }
}

# 日志函数
function Write-Log {
    param (
        [string]$Message,
        [string]$Level = "INFO"
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] [$Level] $Message"
}

# 检查脚本是否存在
if (-not (Test-Path -Path $taskConfig.ScriptPath)) {
    Write-Log "脚本文件不存在: $($taskConfig.ScriptPath)" "ERROR"
    exit 1
}

# 创建任务计划程序
Write-Log "开始创建任务计划程序..."

try {
    # 创建任务触发器
    $trigger = New-ScheduledTaskTrigger -Once -At $taskConfig.Trigger.StartTime `
        -RepetitionInterval (New-TimeSpan -Minutes $taskConfig.Trigger.Interval) `
        -RepetitionDuration ([Timespan]::MaxValue)
    
    # 创建任务操作
    $action = New-ScheduledTaskAction -Execute "powershell.exe" `
        -Argument "-ExecutionPolicy Bypass -File '$($taskConfig.ScriptPath)'"
    
    # 设置任务设置
    $settings = New-ScheduledTaskSettingsSet `
        -AllowStartIfOnBatteries `
        -DontStopIfGoingOnBatteries `
        -RestartCount 3 `
        -RestartInterval (New-TimeSpan -Minutes 5) `
        -RunOnlyIfNetworkAvailable `
        -StartWhenAvailable
    
    # 注册任务
    Register-ScheduledTask `
        -TaskName $taskConfig.TaskName `
        -Description $taskConfig.TaskDescription `
        -Trigger $trigger `
        -Action $action `
        -Settings $settings `
        -User $taskConfig.User `
        -RunLevel Highest `
        -Force
    
    Write-Log "✅ 任务计划程序创建成功: $($taskConfig.TaskName)"
    Write-Log "📅 更新频率: 每 $($taskConfig.Trigger.Interval) 分钟"
    Write-Log "📁 脚本路径: $($taskConfig.ScriptPath)"
    
} catch {
    Write-Log "❌ 任务计划程序创建失败: $($_.Exception.Message)" "ERROR"
    exit 1
}

# 验证任务是否存在
Write-Log "\n验证任务计划程序..."
try {
    $task = Get-ScheduledTask -TaskName $taskConfig.TaskName -ErrorAction Stop
    Write-Log "✅ 任务已存在: $($task.TaskName)"
    Write-Log "   状态: $($task.State)"
    Write-Log "   下次运行时间: $($task.Triggers[0].NextRunTime)"
} catch {
    Write-Log "❌ 任务验证失败: $($_.Exception.Message)" "ERROR"
    exit 1
}

# 立即运行一次任务进行测试
Write-Log "\n立即运行一次任务进行测试..."
try {
    Start-ScheduledTask -TaskName $taskConfig.TaskName
    Write-Log "✅ 任务已启动"
    
    # 等待任务执行
    Start-Sleep -Seconds 10
    
    # 检查任务状态
    $task = Get-ScheduledTask -TaskName $taskConfig.TaskName
    Write-Log "   当前状态: $($task.State)"
    
} catch {
    Write-Log "❌ 任务运行失败: $($_.Exception.Message)" "ERROR"
}

Write-Log "\n🎉 任务计划程序配置完成！"
Write-Log "要查看任务运行历史，请打开: 任务计划程序 → 任务计划程序库 → $($taskConfig.TaskName)"
Write-Log "要修改任务配置，请使用: Get-ScheduledTask | Set-ScheduledTask 命令"
