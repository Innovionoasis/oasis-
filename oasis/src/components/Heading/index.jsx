import React from "react";

const sizes = {
  components_button_medium: "tracking-[0.40px] font-roboto uppercase text-[14px] font-medium",
  heading: "tracking-[-0.48px] text-[24px] font-semibold lg:text-[24px] md:text-[22px]",
  text2xl: "text-[14px] font-medium",
  text5xl: "text-[18px] font-medium",
  text7xl: "text-[22px] font-medium lg:text-[22px]",
  text10xl: "text-[36px] font-medium lg:text-[36px] md:text-[34px] sm:text-[32px]",
  headingxs: "text-[8px] font-extrabold",
  headings: "text-[10px] font-bold",
  headingmd: "text-[11px] font-extrabold",
  headinglg: "text-[12px] font-semibold",
  headingxl: "text-[13px] font-bold",
  heading2xl: "text-[14px] font-semibold",
  heading3xl: "text-[15px] font-bold",
  heading4xl: "text-[16px] font-bold",
  heading5xl: "text-[20px] font-bold",
  heading6xl: "text-[24px] font-bold lg:text-[24px] md:text-[22px]",
  heading7xl: "text-[30px] font-bold lg:text-[30px] md:text-[28px] sm:text-[26px]",
  heading8xl: "text-[32px] font-semibold lg:text-[32px] md:text-[30px] sm:text-[28px]",
  heading9xl: "text-[36px] font-semibold lg:text-[36px] md:text-[34px] sm:text-[32px]",
  heading10xl: "text-[38px] font-bold lg:text-[38px] md:text-[36px] sm:text-[34px]",
  heading11xl: "text-[48px] font-semibold lg:text-[48px] md:text-[44px] sm:text-[38px]",
};

const Heading = ({ children, className = "", size = "text2xl", as, ...restProps }) => {
  const Component = as || "h6";

  return (
    <Component className={`text-black-900 font-poppins ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Heading };
