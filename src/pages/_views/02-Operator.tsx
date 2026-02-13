import React, { useEffect, useState, useMemo, useRef } from "react";
import { useStore } from "@nanostores/react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import arknightsConfig from "../../../arknights.config.tsx";
import "swiper/css";
import "swiper/css/scrollbar";

import {
  viewIndex,
  readyToTouch,
} from "../../components/store/rootLayoutStore.ts";
import { directions } from "../../components/store/lineDecoratorStore";

// -scss

import "../../_styles/Operator/base.scss";

export default function Operator() {
  const $viewIndex = useStore(viewIndex);
  const $readyToTouch = useStore(readyToTouch);
  const [active, setActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentOp = useMemo(
    () => arknightsConfig.rootPage.OPERATOR.data[currentIndex],
    [currentIndex]
  );

  const handlePlayVoice = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  };

  // 当切换角色时暂停音频
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [currentOp]);

  useEffect(() => {
    const isActive = $viewIndex === 2 && $readyToTouch;
    if (isActive) {
      directions.set({ top: true, right: true, bottom: true, left: false });
    }
    setActive(isActive);
  }, [$viewIndex, $readyToTouch]);

  return (
    <div
      className={`w-[100vw] max-w-[180rem] h-full absolute top-0 right-0 bottom-0 left-auto transition-all duration-700 ease-in-out bg-layout overflow-hidden ${
        active ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* 隐藏的音频元素 */}
      <audio
        ref={audioRef}
        src={currentOp.voice}
        onEnded={() => setIsPlaying(false)}
      />

      {/* 1. 背景层 (装饰大字 & 网格) */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute inset-0 mix-blend-overlay" />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentOp.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 0.45, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center z-10 "
          >
            <span className="bg-decor-text">{currentOp.name}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. 主立绘展示层 (含叠影) */}
      <div className="absolute right-0 bottom-0 w-3/4 h-full flex items-end justify-end z-10  pointer-events-none">
        <AnimatePresence mode="wait">
          {/* 背景大叠影：增加缩放视差和混合模式优化 */}
          <motion.img
            key={currentOp.id + "_bg"}
            src={currentOp.fullbody}
            initial={{
              opacity: 0,
              x: 60,
              scale: 1.5,
              //filter: "blur(20px) grayscale(1)",
              filter: "grayscale(1)",
            }}
            animate={{
              opacity: 0.25,
              x: 0,
              scale: 1.6,
              //filter: "blur(10px) grayscale(1)",
              filter: "grayscale(1)",
            }}
            exit={{ opacity: 0, x: -30, transition: { duration: 0.4 } }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute right-[-20%] top-[70px] h-[150%] w-auto object-contain mix-blend-color-dodge pointer-events-none select-none"
          />

          {/* 主立绘：增加更细腻的物理弹簧效果和落地点偏移 */}
          <motion.img
            key={currentOp.id}
            src={currentOp.fullbody}
            initial={{ opacity: 0, x: 100, scale: 1 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: -40,
              scale: 1.05, // 消失时轻微放大
              transition: { duration: 0.3 },
            }}
            transition={{
              type: "spring",
              stiffness: 40, // 降低刚度，让动作更优雅沉稳
              damping: 15, // 适中的阻尼防止抖动过大
              mass: 1,
            }}
            className="relative bottom-[-25rem] h-[125%] w-auto object-contain drop-shadow-[-20px_20px_50px_rgba(0,0,0,0.7)] select-none"
          />
        </AnimatePresence>

        <div className="absolute bottom-0 right-[20%] w-[40%] h-[10%] bg-radial-gradient from-black/60 to-transparent blur-2xl -z-10" />
      </div>

      <div className="OPS_info_block mb-0 h-full flex items-center">
        {/* 3. 左侧资料信息区 */}
        <div className="absolute bottom-[-7rem] z-20 h-full flex flex-col justify-center pl-[6rem] portrait:pl-[2rem] w-[45rem] portrait:w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentOp.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              {/* 标签 */}
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-white text-black font-black px-2 py-0.5 text-sm tracking-tighter">
                  PROFILE
                </span>
                <span className="text-white/40 font-benderRegular text-xs tracking-[0.2em]">
                  REUNION ://
                </span>
              </div>

              {/* 名字区 */}
              <div className="relative mb-8 flex items-end">
                <div className="leading-none mb-1">
                  <div className="name-display">{currentOp.name}</div>
                  <div className="cn-name-display">{currentOp.cnName}</div>
                </div>
                <div className="ml-6 h-20">
                  <img
                    src={currentOp.logo}
                    className="block w-auto h-full"
                    alt="faction"
                  />
                </div>
              </div>

              {/* CV 语音展示 */}
              <div
                className="voice-section group"
                onClick={handlePlayVoice}
                data-playing={isPlaying}
              >
                <div className="voice-btn-wrapper">
                  <div className={`voice-btn ${isPlaying ? "is-playing" : ""}`}>
                    <svg className="icon" viewBox="0 0 24 24">
                      {isPlaying ? (
                        <path d="M6 5h4v14H6zm8 0h4v14h-4z" /> // 暂停
                      ) : (
                        <path d="M8 5v14l11-7z" /> // 播放
                      )}
                    </svg>
                  </div>
                  {/* 装饰外圈 */}
                  <div className="btn-echo" />
                </div>

                <div className="voice-info">
                  <div className="voice-title">CHARACTER VOICE</div>
                  <div className="voice-name">{currentOp.cv}</div>
                </div>

                <div className="voice-wave-container">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="wave-bar" />
                  ))}
                </div>
              </div>

              {/* 描述文本 */}
              <div className="description-section">
                <div className="desc-border" />
                <p className="desc-text">{currentOp.desc}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 4. 底部干员选择列表 (Swiper) */}
          <div className="mt-7">
            <div className=" relative overflow-hidden [list-style:none] p-0 block box-border mx-2 my-0 w-[33.625rem] [mask:linear-gradient(-90deg,_rgba(255,_255,_255,_0),_rgb(255,_255,_255)_2rem)] operator-list-container">
              <div className="relative w-full h-full flex [transition-property:transform] box-border [transform:translateZ(0px)]">
                <Swiper
                  modules={[Scrollbar]}
                  spaceBetween={10}
                  slidesPerView={"auto"}
                  scrollbar={{ draggable: true, el: ".op-scrollbar" }}
                >
                  {arknightsConfig.rootPage.OPERATOR.data.map((op, index) => (
                    <SwiperSlide
                      key={op.id}
                      className="flex-shrink-0 w-full h-full [transition-property:transform] block [transform:translateZ(0px)] [backface-visibility:hidden] box-border"
                    >
                      <div
                        onClick={() => setCurrentIndex(index)}
                        className={`thumbnail ${
                          currentIndex === index ? "active" : "inactive"
                        }`}
                      >
                        <div className="image-container absolute top-0 left-0 w-full h-full border-[0.625rem] border-[solid] border-[rgb(255,255,255)]"></div>
                        <div className="[filter:drop-shadow(rgb(0,_0,_0)_-0.5rem_0.5rem_1rem)] overflow-hidden">
                          <img
                            src={op.portrait}
                            className="block w-full h-auto mx-[auto] my-0"
                            alt={op.cnName}
                          />
                        </div>
                        <div className="name-label [filter:drop-shadow(rgb(0,_0,_0)_0px_0px_0.5rem)_drop-shadow(rgb(0,_0,_0)_0px_0px_0.5rem)] [transition:color_0.3s] text-[rgb(255,_255,_255)]">
                          <div className="relative block font-[SourceHanSans-Medium]">
                            {op.cnName}
                          </div>
                        </div>
                        {/* {currentIndex === index && (
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-ark-blue text-xs selected-indicator">
                            ▼
                          </div>
                        )} */}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
          <div className="op-scrollbar mt-9 relative w-[33.5rem] h-3 before:absolute before:inset-x-0 before:top-1/2 before:-translate-y-1/2 before:h-[0.3px] before:bg-white"></div>
        </div>
      </div>
    </div>
  );
}
