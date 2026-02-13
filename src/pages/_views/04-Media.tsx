import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import {
  viewIndex,
  readyToTouch,
  isScrollLocked, // 引入锁定状态
} from "../../components/store/rootLayoutStore.ts";
import { directions } from "../../components/store/lineDecoratorStore";
import GalleryDetails from "./components/GalleryDetails.tsx"; // 引入刚才创建的组件

// 定义子分类类型
type Category = "monster_siren" | "gallery" | "operator" | "video";

interface CategoryData {
  id: Category;
  en: string;
  cn: string;
  logo: string;
  activeImg: string;
  desc: string;
}

const CATEGORIES: CategoryData[] = [
  {
    id: "monster_siren",
    en: "MONSTER SIREN",
    cn: "塞壬唱片",
    logo: "/images/04-media/logo_monster_siren.27beba82.png",
    activeImg: "/images/04-media/monster_siren_active.8f01230d.png",
    desc: "一个已知或未知的世界\nHTTPS://AK.HYPERGRYPH.COM/",
  },
  {
    id: "gallery",
    en: "GALLERY",
    cn: "插画珍藏",
    logo: "/images/04-media/logo_gallery.08a04a01.png",
    activeImg: "/images/04-media/gallery_active.d45cfc72.png",
    desc: "记录大地上的点滴瞬间\nHTTPS://AK.HYPERGRYPH.COM/",
  },
  {
    id: "operator",
    en: "OPERATOR",
    cn: "干员档案",
    logo: "/images/04-media/logo_operator.c6543e50.png",
    activeImg: "/images/04-media/operator_active.d697ef2d.png",
    desc: "罗德岛核心干员机密资料\nHTTPS://AK.HYPERGRYPH.COM/",
  },
  {
    id: "video",
    en: "VIDEO",
    cn: "影像资料",
    logo: "/images/04-media/logo_video.c1de0303.png",
    activeImg: "/images/04-media/video_active.693c91f3.png",
    desc: "泰拉世界的活动影像记录\nHTTPS://AK.HYPERGRYPH.COM/",
  },
];

// 定义点击热区的位置 (基于视觉元素的坐标微调)
const HIT_AREAS = [
  {
    id: "monster_siren" as Category,
    position: "top-[37%] left-[18%] w-[160px] h-[160px]",
  },
  {
    id: "gallery" as Category,
    position: "top-[0%] left-[25%] w-[180px] h-[180px]",
  },
  {
    id: "operator" as Category,
    position: "top-[17%] left-[65%] w-[180px] h-[180px]",
  },
  {
    id: "video" as Category,
    position: "top-[60%] left-[57%] w-[200px] h-[200px]",
  },
];

export default function Media() {
  const $viewIndex = useStore(viewIndex);
  const $readyToTouch = useStore(readyToTouch);
  const [active, setActive] = useState(false);
  const [currentCat, setCurrentCat] = useState<Category>("monster_siren");

  // 控制是否显示图集详情的状态
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const isActive = $viewIndex === 4 && $readyToTouch;
    if (isActive) {
      // 如果进入了图集详情页，不需要显示上下左右的箭头提示
      if (showGallery) {
        directions.set({
          top: false,
          right: false,
          bottom: false,
          left: false,
        });
      } else {
        directions.set({ top: false, right: true, bottom: true, left: false });
      }
    }
    setActive(isActive);
  }, [$viewIndex, $readyToTouch, showGallery]); // 添加 showGallery 依赖

  // 处理详情按钮点击
  const handleDetailClick = () => {
    if (currentCat === "gallery") {
      setShowGallery(true);
      isScrollLocked.set(true); // 锁定主页面滚动
    } else if (currentCat === "monster_siren") {
      window.open("https://monster-siren.hypergryph.com/", "_blank");
    } else if (currentCat === "video") {
      window.open("https://ak.hypergryph.com/archive/video", "_blank");
    } else if (currentCat === "operator") {
      window.open("https://ak.hypergryph.com/archive/dynamicCompile", "_blank");
    } else {
      console.log(`${currentCat} clicked`);
      // 其他分类的逻辑...
    }
  };

  // 处理从详情页返回
  const handleBackFromGallery = () => {
    setShowGallery(false);
    isScrollLocked.set(false); // 解锁主页面滚动
  };

  const activeData = CATEGORIES.find((c) => c.id === currentCat)!;

  return (
    // 外层容器：相对定位，隐藏溢出
    <div
      className={`relative w-full h-full overflow-hidden transition-opacity duration-1000 ${active ? "opacity-100" : "opacity-0"}`}
    >
      {/* 
         滚动容器：
         高度为 200% (两屏高度)
         根据 showGallery 状态决定 transform 的位置
         - translateY(0): 显示上半部分 (Media 主页)
         - translateY(-50%): 显示下半部分 (Gallery 详情)
      */}
      <div
        className="w-full h-[200%] transition-transform duration-700 cubic-bezier(0.65, 0, 0.35, 1)"
        style={{
          transform: showGallery ? "translateY(-50%)" : "translateY(0)",
        }}
      >
        {/* --- 第一屏：Media 主页面 (高度 50% = 100vh) --- */}
        <div
          className="w-full h-[50%] relative bg-black overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        >
          {/* 背景水印 */}
          <div className="absolute bottom-10 left-10 text-[180px] font-black text-white/5 leading-none select-none pointer-events-none">
            ABOUT TERRA
          </div>

          {/* 左侧侧边导航 */}
          <div className="absolute top-1/4 left-16 z-20">
            <h2 className="text-white text-xl font-bold mb-6 tracking-tighter">
              ABOUT TERRA
            </h2>
            <div className="flex flex-col gap-4">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center group cursor-pointer pointer-events-auto"
                  onClick={() => setCurrentCat(cat.id)}
                >
                  <div
                    className={`w-3 h-3 border border-white/50 mr-3 flex items-center justify-center transition-all ${currentCat === cat.id ? "bg-white" : ""}`}
                  >
                    {currentCat === cat.id && (
                      <div className="w-1 h-1 bg-black" />
                    )}
                  </div>
                  <span
                    className={`text-xs tracking-widest transition-colors ${currentCat === cat.id ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`}
                  >
                    {cat.en}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 视觉区 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative min-w-[1000px] h-[600px]">
              {/* 用于接收点击事件 */}
              <div className="absolute inset-0 z-50 w-full h-full">
                {HIT_AREAS.map((area) => (
                  <div
                    key={area.id}
                    className={`absolute ${area.position} cursor-pointer pointer-events-auto outline-none tap-highlight-transparent group`}
                    onClick={() => setCurrentCat(area.id)}
                  >
                    {/* 悬停效果*/}
                    <div
                      className={`w-full h-full rounded-2xl transition-colors duration-300 ${
                        currentCat === area.id ? "" : ""
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* 基础桌子贴图 */}
              <img
                src="/images/04-media/about_terra.44839d14.png"
                className="absolute inset-0 w-full h-full object-contain opacity-80"
                alt="base"
              />

              {/* 动态高光层 */}
              <div className="absolute inset-0 transition-all duration-700">
                {CATEGORIES.map((cat) => (
                  <img
                    key={cat.id}
                    src={cat.activeImg}
                    className={`absolute z-30 inset-0 w-full h-full object-contain transition-opacity duration-500 ${currentCat === cat.id ? "opacity-100" : "opacity-0"}`}
                    alt={cat.id}
                  />
                ))}
              </div>
              {/* 浮动的Logo标识 */}
              <div className="absolute inset-0 transition-all duration-700">
                {CATEGORIES.map((cat) => (
                  <img
                    key={cat.id}
                    src={cat.logo}
                    className={`absolute z-40 inset-0 w-full h-full object-contain transition-opacity duration-500 ${currentCat === cat.id ? "opacity-100" : "opacity-0"}`}
                    alt={cat.id}
                  />
                ))}
              </div>

              {/* 框(Monster Siren) */}
              <div
                className={`${currentCat === "monster_siren" ? "opacity-100 scale-100" : "opacity-0 scale-110"} transition-all duration-500 ease-in-out origin-center absolute inset-0 `}
              >
                <div>
                  <div
                    className="absolute top-[37%] left-[18%] w-[100px] h-[100px] bg-ark-blue z-10"
                    style={{ boxShadow: "inset 0 2px 6px rgba(0,0,0,0.6)" }}
                  />
                  <div
                    className="absolute top-[43%] left-[20%] w-[140px] h-[140px] border-8 border-white z-20"
                    style={{
                      boxShadow: `12px 16px 32px rgba(0, 0, 0, 0.65), 6px 8px 20px rgba(0, 0, 0, 0.45), 3px 4px 12px rgba(0, 0, 0, 0.30), -2px -2px 16px rgba(60, 180, 220, 0.18)`,
                      transition:
                        "all 700ms ease-in-out, box-shadow 800ms ease-out",
                    }}
                  />
                </div>
              </div>

              {/* 框(Gallery) */}
              <div
                className={`${currentCat === "gallery" ? "opacity-100 scale-100" : "opacity-0 scale-110"} transition-all duration-500 ease-in-out origin-center absolute inset-0 `}
              >
                <div>
                  <div
                    className="absolute top-[0%] left-[25%] w-[130px] h-[130px] bg-ark-blue"
                    style={{ boxShadow: "inset 0 2px 6px rgba(0,0,0,0.6)" }}
                  />
                  <div
                    className="absolute top-[10%] left-[32%] w-[140px] h-[140px] border-8 border-white"
                    style={{
                      boxShadow: `12px 16px 32px rgba(0, 0, 0, 0.65), 6px 8px 20px rgba(0, 0, 0, 0.45), 3px 4px 12px rgba(0, 0, 0, 0.30), -2px -2px 16px rgba(60, 180, 220, 0.18)`,
                      transition:
                        "all 700ms ease-in-out, box-shadow 800ms ease-out",
                    }}
                  />
                </div>
              </div>

              {/* 框(Operator) */}
              <div
                className={`${currentCat === "operator" ? "opacity-100 scale-100" : "opacity-0 scale-110"} transition-all duration-500 ease-in-out origin-center absolute inset-0 `}
              >
                <div>
                  <div
                    className="absolute top-[17%] left-[67%] w-[100px] h-[100px] bg-ark-blue"
                    style={{ boxShadow: "inset 0 2px 6px rgba(0,0,0,0.6)" }}
                  />
                  <div
                    className="absolute top-[22%] left-[70%] w-[160px] h-[140px] border-8 border-white"
                    style={{
                      boxShadow: `12px 16px 32px rgba(0, 0, 0, 0.65), 6px 8px 20px rgba(0, 0, 0, 0.45), 3px 4px 12px rgba(0, 0, 0, 0.30), -2px -2px 16px rgba(60, 180, 220, 0.18)`,
                      transition:
                        "all 700ms ease-in-out, box-shadow 800ms ease-out",
                    }}
                  />
                </div>
              </div>

              {/* 框(Video) */}
              <div
                className={`${currentCat === "video" ? "opacity-100 scale-100" : "opacity-0 scale-110"} transition-all duration-500 ease-in-out origin-center absolute inset-0 `}
              >
                <div>
                  <div
                    className="absolute top-[62%] left-[57%] w-[100px] h-[100px] bg-ark-blue"
                    style={{ boxShadow: "inset 0 2px 6px rgba(0,0,0,0.6)" }}
                  />
                  <div
                    className="absolute top-[67%] left-[60%] w-[180px] h-[180px] border-8 border-white"
                    style={{
                      boxShadow: `12px 16px 32px rgba(0, 0, 0, 0.65), 6px 8px 20px rgba(0, 0, 0, 0.45), 3px 4px 12px rgba(0, 0, 0, 0.30), -2px -2px 16px rgba(60, 180, 220, 0.18)`,
                      transition:
                        "all 700ms ease-in-out, box-shadow 800ms ease-out",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 左下角详情介绍 */}
          <div className="absolute bottom-24 left-16 z-40 max-w-md pointer-events-auto">
            {/* 
                关键点：key={activeData.id}
                当 id 改变时，React 会重新挂载这个 div，从而触发内部子元素的 CSS animation 
              */}
            <div key={activeData.id} className="flex flex-col items-start">
              {/* 1. 英文标题 - 延迟 0ms */}
              <h1
                className="text-white text-5xl font-bold tracking-tighter uppercase animate-enter"
                style={{ animationDelay: "0ms" }}
              >
                {activeData.en}
              </h1>

              {/* 2. 中文标题 + 装饰条 - 延迟 100ms */}
              <div
                className="flex items-end gap-4 mt-2 mb-8 animate-enter"
                style={{ animationDelay: "100ms" }}
              >
                <h2 className="text-white min-w-[200px] text-7xl font-bold">
                  {activeData.cn}
                </h2>
                <div className="h-1 w-24 bg-cyan-400 mb-4" />
              </div>

              {/* 3. 描述文字 - 延迟 200ms */}
              <p
                className="text-gray-400 text-xs tracking-widest whitespace-pre-line leading-loose animate-enter"
                style={{ animationDelay: "200ms" }}
              >
                {activeData.desc}
              </p>

              {/* 4. 按钮 - 延迟 300ms */}
              <div
                className="relative mt-10 animate-enter"
                style={{ animationDelay: "300ms" }}
              >
                <button
                  className="group flex items-center bg-[rgb(24,209,255)] hover:bg-white transition-colors duration-300 text-[rgb(0,0,0)] cursor-pointer w-[14.375rem] h-[3.75rem] pl-4 pr-7 py-0 whitespace-nowrap"
                  onClick={handleDetailClick}
                >
                  <div className="flex flex-col justify-center">
                    <div className="font-bold text-[1.25rem] leading-tight">
                      查看详情
                    </div>
                    <div className="font-semibold text-[0.875rem] leading-tight">
                      READ MORE
                    </div>
                  </div>
                  <div className="ml-auto flex items-center justify-center w-4 h-4 group-hover:translate-x-1 transition-transform">
                    <svg
                      width="7"
                      height="15"
                      viewBox="0 0 7 15"
                      className="block w-full h-auto pointer-events-none"
                    >
                      <path
                        d="M1 1 L6 7.5 L1 14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- 第二屏：Gallery 详情 (高度 50% = 100vh) --- */}
        <div className="w-full h-[50%] relative">
          <GalleryDetails onBack={handleBackFromGallery} />
        </div>
      </div>
    </div>
  );
}
