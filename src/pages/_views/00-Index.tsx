/**
 * 首页组件
 * 功能：显示游戏主标题、副标题、URL、版权信息，以及英雄按钮
 * 包含背景视频播放、遮罩层动画效果
 */

import React, {useEffect, useState, useRef} from "react";
import {useStore} from "@nanostores/react" // 用于从 Nanostores 读取状态
import type {HeroActionButtonProps} from "../../_types/RootPageViews.ts" // 英雄按钮属性类型
import {viewIndex} from "../../components/store/rootLayoutStore.ts" // 当前视图索引状态
import {directions} from "../../components/store/lineDecoratorStore" // 线条装饰器方向状态
import arknightsConfig from "../../../arknights.config.tsx"; // 项目配置文件
import PortraitBottomGradientMask from "../../components/PortraitBottomGradientMask"; // 移动端底部渐变遮罩组件
import {readyToTouch} from "../../components/store/rootLayoutStore.ts" // 页面是否准备就绪状态
import Hls from 'hls.js'; // HLS 视频流播放库

/**
 * 英雄按钮组件
 * @param icon 按钮图标
 * @param label 按钮主文字
 * @param subLabel 按钮副标题
 * @param target 链接目标（默认 "_blank"）
 * @param href 链接地址
 * @param className 额外的 CSS 类名
 * @returns 渲染后的英雄按钮元素
 */
function HeroActionButton({icon, label, subLabel, target, href, className}: HeroActionButtonProps) {
    return <a target={target ?? "_blank"} href={href}
              className={`w-[10.5rem] portrait:w-[15.125rem] h-[3rem] portrait:h-[4.5rem] no-underline border-[1px] border-solid rounded pl-4 flex items-center transition-[border-color] duration-300 ${className ?? ""}`.trim()}>
        <div className="w-[1.5rem] portrait:w-[3rem] flex-none mr-3">{icon}</div>
        <div className="whitespace-nowrap leading-[1.4]">
            <div className="text-[.875rem] portrait:text-[1.25rem]">{label}</div>
            <div className="text-[.75rem] portrait:text-[1rem]">{subLabel}</div>
        </div>
    </a>
}

/**
 * 首页主组件
 * @returns 渲染后的首页组件
 */
export default function Index() {
    // 从配置文件中获取首页相关数据
    const {title, subtitle, url, copyright} = arknightsConfig.rootPage.INDEX
    // 从状态管理库获取视图索引
    const $viewIndex = useStore(viewIndex)
    // 从状态管理库获取页面是否准备就绪状态
    const $readyToTouch = useStore(readyToTouch)
    // 组件激活状态（当前是否显示首页）
    const [active, setActive] = useState($viewIndex === 0)
    // 视频是否加载完成
    const [videoLoaded, setVideoLoaded] = useState(false);
    // 视频元素引用
    const videoRef = useRef<HTMLVideoElement>(null);
    // HLS 实例引用
    const [hls, setHls] = useState<Hls | null>(null);

    /**
     * 视频加载和初始化效果
     * 功能：加载 HLS 视频流并设置播放状态
     */
    useEffect(() => {
        if (videoRef.current) {
            // 检查浏览器是否支持 HLS
            if (Hls.isSupported()) {
                // 创建新的 HLS 实例
                const newHls = new Hls();
                // 加载视频源
                newHls.loadSource('/videos/PV04_landscape/PV04_landscape.m3u8');
                // 附加到视频元素
                newHls.attachMedia(videoRef.current);
                // 当视频清单解析完成时
                newHls.on(Hls.Events.MANIFEST_PARSED, () => {
                    // 设置视频加载完成状态
                    setVideoLoaded(true);
                    // 如果当前是首页且页面准备就绪，则播放视频
                    if ($viewIndex === 0 && $readyToTouch) {
                        videoRef.current?.play();
                    }
                });
                // 保存 HLS 实例引用
                setHls(newHls);
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                // 对于不支持 HLS 但支持 M3U8 的浏览器（如 Safari）
                videoRef.current.src = '/videos/PV04_landscape/PV04_landscape.m3u8';
                // 当视频元数据加载完成时
                videoRef.current.addEventListener('loadedmetadata', () => {
                    // 设置视频加载完成状态
                    setVideoLoaded(true);
                    // 如果当前是首页且页面准备就绪，则播放视频
                    if ($viewIndex === 0 && $readyToTouch) {
                        videoRef.current?.play();
                    }
                });
            }
        }

        // 组件卸载时清理 HLS 实例
        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, []); // 只在组件挂载时执行一次

    /**
     * 视图切换效果
     * 功能：当视图索引或页面准备状态改变时，更新组件激活状态和视频播放状态
     */
    useEffect(() => {
        // 计算组件是否激活（当前是首页且页面准备就绪）
        const isActive = $viewIndex === 0 && $readyToTouch
        if (isActive) {
            // 设置线条装饰器方向
            directions.set({top: false, right: true, bottom: true, left: false})
            // 播放视频
            videoRef.current?.play();
        } else {
            // 暂停视频
            videoRef.current?.pause();
        }
        // 更新激活状态
        setActive(isActive)
    }, [$viewIndex, $readyToTouch]) // 当视图索引或页面准备状态改变时执行

    // TODO: 使用m3u8
    return <div className={"w-[100vw] max-w-[180rem] h-full absolute top-0 right-0 bottom-0 left-0 z-[2]"
        + " transition-opacity duration-100"}>
        {/* 背景图片 */}
        <div className={"w-full h-full absolute top-0 left-0 bg-index bg-center bg-cover bg-no-repeat"
            + " transition-opacity duration-1000"}/>
        
        {/* 背景视频 */}
        <video
            ref={videoRef}
            className={`absolute top-0 left-0 w-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
                height: 'calc(100vh + (100vh * 2.35 / 16 * 9 - 100vh) * 1.2)', // 官网使用的缩放比会更大一些 所以在计算基础上继续增加了1.2倍的缩放
                objectPosition: '50% 0%',
                transform: 'translateY(calc((100vh * 2.35 / 16 * 9 - 100vh) * 1.2 / -2))'
            }}
            loop 
            muted 
            playsInline
        />
        
        {/* TODO: <canvas> */}
        
        {/* 左侧遮罩层 - 用于创建视觉层次感和背景效果 */}
        <div className={"w-[52.5rem] portrait:w-[18.75rem] h-[60.75rem] portrait:h-[12rem] absolute left-0 bottom-0 bg-mask-block portrait:bg-mask-block-m bg-[auto_110%] portrait:bg-[auto_100%] bg-[100%_0] transition-opacity duration-[.6s] ease-linear "
            + (active ? "delay-[2s] opacity-[.78]" : "opacity-0")}/>
        
        {/* 右侧遮罩层 - 与左侧遮罩层配合，增强视觉效果 */}
        <div className={"w-[52.5rem] portrait:w-[5.75rem] h-[60.75rem] portrait:h-[12rem] absolute left-full bottom-0 bg-mask-block portrait:bg-mask-block-m bg-[auto_110%] portrait:bg-[auto_100%] bg-no-repeat translate-x-[-14.75rem] portrait:translate-x-[-3.75rem] transition-opacity duration-[.6s] ease-linear "
            + (active ? "delay-[2.3s] opacity-25" : "opacity-0")}/>
        
        {/* 移动端底部渐变遮罩 - 适配移动设备的视觉效果 */}
        <PortraitBottomGradientMask/>
        
        {/* 空div元素 - 可能是预留的占位符或用于未来功能扩展 */}
        <div className={"absolute left-[4.5rem] portrait:left-[2rem] bottom-[2.75rem] portrait:bottom-[3rem]"
            + " transition-transform duration-1000"}/>
        
        {/* 标题区域容器 - 包含主标题、副标题、URL和版权信息 */}
        <div className={"absolute left-[4.5rem] portrait:left-[2rem] bottom-[2.75rem] portrait:bottom-[3rem] transition-transform duration-1000 "
            + (active ? "translate-y-0" : "translate-y-[11.5rem]")}>
            {/* 主标题和副标题容器 - 使用弹性布局横向排列 */}
            <div className={"flex"}>
                {/* 主标题 - 显示"ARKNIGHTS"等大标题 */}
                <div className={"leading-[.75] text-[5.5rem] portrait:text-[2.375rem] font-n15eUltraBold"
                    + " mr-[2rem] portrait:mr-[1rem]"}>{title ?? ""}</div>
                
                {/* 副标题和URL容器 - 使用垂直弹性布局 */}
                <div className={"flex flex-col font-n15eMedium"}>
                    {/* 副标题 - 显示"RHODES ISLAND"等副标题 */}
                    <div className={"text-[1.125rem] portrait:text-[.5rem]"}>{subtitle ?? ""}</div>
                    {/* URL - 显示官方网站链接 */}
                    <div className={"text-[.875rem] portrait:text-[.375rem]"}>{url ?? ""}</div>
                    {/* 分隔线 - 白色横线，增强视觉层次 */}
                    <div className={"w-[6rem] h-px bg-white mt-auto"}/>
                </div>
            </div>
            
            {/* 版权信息 - 显示版权声明 */}
            <div className="w-[15rem] portrait:w-[20rem] mt-[2.5rem] portrait:mt-[9.375rem]">{copyright}</div>
        </div>
        
        {/* 英雄按钮区域 - 显示"文档"、"社区"等主要操作按钮 */}
        <div
            className="absolute right-[3rem] portrait:left-[2rem] bottom-[12.75rem] portrait:bottom-[19.5rem] space-y-3 portrait:space-y-5">{
            arknightsConfig?.rootPage?.INDEX?.heroActions.map((props, index) =>
                <HeroActionButton key={index} {...props} />)
        }</div>
        
        {/* 右侧底部区域 - 预留用于扫码下载、适龄提示等功能 */}
        <div className={"w-[10.5rem] portrait:w-[5.75rem] absolute"
            + " portrait:top-[9.25rem] right-[3rem] portrait:right-0 bottom-[5.625rem] portrait:bottom-auto"
            + " flex items-center justify-between portrait:justify-center"}>
            {/* TODO: 扫码下载、适龄提示 */}
        </div>
    </div>
}
