import React from "react";
import type { AutoplayOptions } from "swiper/types";
import type { HeroActionButtonProps, SwiperData } from "./RootPageViews.ts";

export type NavbarItem = {
  title: string;
  subtitle: string;
  href: string;
};

export type OwnerInfoFooterLink = {
  label: string;
  url: string;
  portraitHidden?: boolean;
};

export type OperatorData = {
  id: string;
  name: string;
  cnName: string;
  cv: string;
  voice: string; // 角色语音文件路径
  desc: string;
  portrait: string;
  logo: string;
  fullbody: string;
};

export type ArknightsConfig = {
  title: string;
  description: string;
  language: string;
  bgm: {
    autoplay: boolean;
    src: string;
  };
  navbar: {
    logo: {
      element: () => React.JSX.Element;
      alt: string;
    };
    items: NavbarItem[];
    toolbox: {
      Skland?: string;
      Bilibili?: string;
      WeChat?: string;
      Weibo?: string;
      TapTap?: string;
      GitHub?: string;
    };
    ownerInfo: {
      name?: string;
      slogan?: string;
      footerLinks?: OwnerInfoFooterLink[];
    };
  };
  pageTracker: {
    microInfo: string;
    labels: string[];
  };
  rootPage: {
    INDEX: {
      title: string;
      subtitle: string;
      url: string;
      copyright: React.JSX.Element;
      heroActions: HeroActionButtonProps[];
    };

    // 定义界面
    // INFORMATION: {
    //   swiper: {
    //     autoplay?: boolean | AutoplayOptions | undefined;
    //     data: SwiperData[];
    //   };
    // };

    INFORMATION: {
      items: {
        title: string;
        subTitle: string;
        imageUrl: string;
        description: string;
      }[];
    };


    OPERATOR: {
      data: OperatorData[];
    };
    WORLD: {
      items: {
        title: string;
        subTitle: string;
        imageUrl: string;
        description: string;
      }[];
    };
  };
};


export type ReunionConfig = {
  title: string;
  description: string;
  language: string;
  bgm: {
    autoplay: boolean;
    src: string;
  };
  navbar: {
    logo: {
      element: () => React.JSX.Element;
      alt: "reunionlogo";
    };
    items: NavbarItem[];
    toolbox: {
      Skland?: string;
      Bilibili?: string;
      WeChat?: string;
      Weibo?: string;
      TapTap?: string;
      GitHub?: string;
    };
    ownerInfo: {
      name?: string;
      slogan?: string;
      footerLinks?: OwnerInfoFooterLink[];
    };
  };
  pageTracker: {
    microInfo: string;
    labels: string[];
  };
  rootPage: {
    INDEX: {
      title: string;
      subtitle: string;
      url: string;
      copyright: React.JSX.Element;
      heroActions: HeroActionButtonProps[];
    };
    INFORMATION: {
      swiper: {
        autoplay?: boolean | AutoplayOptions | undefined;
        data: SwiperData[];
      };
    };
    OPERATOR: {
      data: OperatorData[];
    };
    WORLD: {
      items: {
        title: string;
        subTitle: string;
        imageUrl: string;
        description: string;
      }[];
    };
  };
};
