import React from "react";

const sizes = {
  m3_display_medium: "font-roboto text-[45px] font-normal lg:text-[45px] md:text-[41px] sm:text-[35px]",
  single_line_body_base: "text-[16px] font-normal",
  m3_display_small: "font-roboto text-[36px] font-normal lg:text-[36px] md:text-[34px] sm:text-[32px]",
  m3_title_large: "font-roboto text-[22px] font-normal lg:text-[22px]",
  body_base: "text-[16px] font-normal",
  textxs: "text-[5px] font-normal",
  texts: "text-[8px] font-normal",
  textmd: "text-[10px] font-normal",
  textlg: "text-[12px] font-normal",
  textxl: "text-[13px] font-light",
  text3xl: "text-[15px] font-normal",
  text4xl: "text-[16px] font-normal",
  text6xl: "text-[20px] font-normal",
  text8xl: "text-[24px] font-normal lg:text-[24px] md:text-[22px]",
  text9xl: "text-[32px] font-normal lg:text-[32px] md:text-[30px] sm:text-[28px]",
  text11xl: "text-[40px] font-normal lg:text-[40px] md:text-[38px] sm:text-[36px]",
  text12xl: "text-[48px] font-normal lg:text-[48px] md:text-[44px] sm:text-[38px]",
  text13xl: "text-[64px] font-normal lg:text-[64px] md:text-[48px]",
  text14xl: "text-[70px] font-normal lg:text-[70px] md:text-[48px]",
  text15xl: "text-[96px] font-normal lg:text-[96px] md:text-[48px]",
};

const Text = ({ children, className = "", as, size = "text6xl", ...restProps }) => {
  const Component = as || "p";

  return (
    <Component className={`text-black-900 font-poppins ${className} ${sizes[size]} `} {...restProps}>
      {children}
    </Component>
  );
};

export { Text };
