import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useStore } from "@nanostores/react";
import { viewIndex } from "../store/rootLayoutStore.ts";
import config from "../../../arknights.config.tsx";
import { motion, AnimatePresence } from "framer-motion";

const items = config.rootPage.WORLD!.items;

// 使用 useMemo 优化 items 的渲染
const MemoizedItem = React.memo(Item);

type ItemProps = {
  title: string;
  subTitle: string;
  delay: number;
  onClick: () => void;
  isExiting: boolean;
  exitingIndex: number | null;
  index: number;
};

function Item({
  title,
  subTitle,
  delay,
  onClick,
  isExiting,
  exitingIndex,
  index,
}: ItemProps) {
  const $viewIndex = useStore(viewIndex);
  const [active, setActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if ($viewIndex === 3) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [$viewIndex, delay]);

  const exitDelay = isExiting ? (index - (exitingIndex ?? 0)) * 50 : 0;

  return (
    <a
      ref={itemRef}
      href="#"
      className={`h-24 pb-3 leading-none flex items-end relative transition-all duration-300 ease-out cursor-pointer
        ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
        ${isExiting ? "-translate-x-full opacity-0" : ""}`}
      style={{
        borderBottom: "1px solid #fff",
        transitionDelay: `${exitDelay}ms`,
      }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      aria-label={`${title} - ${subTitle}`}
    >
      <div
        className="text-[4.5rem] text-[rgba(24,209,255,.25)] font-n15eBold absolute right-[.75rem] bottom-[.75rem] transition-opacity duration-300"
        style={{ opacity: active ? "100" : "0" }}
      >
        {subTitle}
      </div>
      <div
        className="text-[2.5rem] font-bold relative transition-[color,transform] duration-300"
        style={{
          textShadow: "0 0 1em #000,0 0 1em #000",
          transform: active ? "translateX(2rem)" : "translateX(0)",
          color: active ? "#fff" : "#ababab",
        }}
      >
        {title}
      </div>
      <div
        className="text-[1.25rem] font-n15eBold ml-[1.5rem] relative transition-[color,transform] duration-300"
        style={{
          textShadow: "0 0 1em #000,0 0 1em #000",
          transform: active ? "translateX(2rem)" : "translateX(0)",
          color: active ? "#fff" : "#ababab",
        }}
      >
        {subTitle}
      </div>
    </a>
  );
}

type OverviewProps = {
  onItemSelect: (index: number) => void;
};

export default function WorldOverview({ onItemSelect }: OverviewProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isFirstMove = useRef(true); // 用一个变量来修复首次加载会导致图片位置错误的问题
  const isFirstLoad = useRef(true);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (listRef.current) {
      const rect = listRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const imgWidth = 1024;
      const imgHeight = 1024;

      // TODO: 一个奇怪的偏移，需要更好的方法
      const imgOffsetX = 350;
      const imgOffsetY = 0;
      const imgOffsetXPercentage = 75;
      const imgOffsetYPercentage = 0;
      const position = {
        x: x - imgWidth / 2 + (imgOffsetX * imgOffsetXPercentage) / 100,
        y: y - imgHeight / 2 + (imgOffsetY * imgOffsetYPercentage) / 100,
      };

      setMousePosition(position);

      const itemHeight = rect.height / items.length;
      const index = Math.floor(y / itemHeight);
      if (index >= 0 && index < items.length) {
        setActiveImage(items[index].imageUrl);
      } else {
        setActiveImage(null);
      }
    }
  };

  const handleMouseLeave = () => {
    setActiveImage(null);
    isFirstMove.current = true;
  };

  // 移除了itemAnimationDuration、itemAnimationDelay和initialDelay变量，因为它们不再被使用

  const handleItemClick = (index: number) => {
    setIsExiting(true);
    setExitingIndex(index);
  };

  // Import useAnimation at the top of the file with other imports

  useEffect(() => {
    return () => {
      isFirstLoad.current = false;
    };
  }, []);

  // Add useAnimation import at the top
  // import { motion, AnimatePresence, useAnimation } from "framer-motion";

  const containerVariants = {
    enter: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
    exit: {
      x: -window.innerWidth,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeIn" as const,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.div
      ref={listRef}
      className="w-[39.875rem] absolute top-[20.3703703704%] left-[9rem] z-10"
      variants={containerVariants}
      initial={{ opacity: 0, x: -50 }}
      animate={isExiting ? "exit" : "enter"}
      onAnimationComplete={(definition) => {
        if (isExiting && definition === "exit") {
          onItemSelect(exitingIndex!);
          setIsExiting(false);
          setExitingIndex(null);
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {items.map(
        (
          { title, subTitle }: { title: string; subTitle: string },
          index: number
        ) => (
          <MemoizedItem
            key={index}
            title={title}
            subTitle={subTitle}
            delay={isFirstLoad.current ? 800 + index * 50 : index * 50}
            onClick={() => handleItemClick(index)} // 修改这里，使用统一的处理函数
            isExiting={isExiting}
            exitingIndex={exitingIndex}
            index={index}
          />
        )
      )}
      <AnimatePresence>
        {activeImage && (
          <motion.img
            key={activeImage}
            src={activeImage}
            alt="Active item"
            className="absolute pointer-events-none"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{
              width: "1024px",
              height: "1024px",
              objectFit: "cover",
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
              zIndex: -1,
              filter: "blur(0.2px)",
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
