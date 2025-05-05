import React from "react";
import PropTypes from "prop-types";

const shapes = {
  circle: "rounded-[50%]",
  square: "rounded-[0px]",
  round: "rounded-lg",
};
const variants = {
  fill: {
    blue_gray_100_03: "bg-blue_gray-100_03 text-black-900",
    black_900_0f: "bg-black-900_0f text-black-900",
    blue_gray_500_02: "bg-blue_gray-500_02 text-w_background",
    gray_50_01: "bg-gray-50_01 text-blue_gray-900_c1",
    gray_600_8c: "bg-gray-600_8c text-w_background",
    w_background: "bg-w_background",
    blue_gray_100_02: "bg-blue_gray-100_02 text-black-900",
    deep_purple_A400: "bg-deep_purple-a400 text-w_background",
    blue_gray_500: "bg-blue_gray-500 text-w_background",
    blue_A200_19: "bg-blue-a200_19 text-blue-a200",
    blue_100: "bg-blue-100 text-black-900",
    blue_A200: "bg-blue-a200 text-w_background",
    blue_gray_100_bc: "bg-blue_gray-100_bc shadow-xs text-black-900",
    gray_100_02: "bg-gray-100_02 text-blue_gray-800_02",
    gray_300_02: "bg-gray-300_02 shadow-xs text-gray-900",
  },
};
const sizes = {
  "11xl": "h-[58px] px-3",
  "12xl": "h-[72px] px-[34px] text-[20px]",
  sm: "h-[30px] px-[34px] text-[15px]",
  "5xl": "h-[44px]",
  "9xl": "h-[54px] pl-[34px] pr-2 text-[16px]",
  "13xl": "h-[114px] px-[34px] text-[30px]",
  "3xl": "h-[40px] pl-5 pr-[26px] text-[20px]",
  "6xl": "h-[46px] px-[26px] text-[12px]",
  md: "h-[34px] px-5 text-[20px]",
  "2xl": "h-[40px] px-[34px] text-[12px]",
  "7xl": "h-[48px] px-3",
  "4xl": "h-[44px] pl-8 pr-6 text-[15px]",
  "10xl": "h-[56px] px-[34px] text-[20px]",
  xs: "h-[28px] px-3 text-[12px]",
  lg: "h-[34px] px-1.5 text-[16px]",
  "8xl": "h-[52px] px-3.5",
  xl: "h-[38px] px-2.5 text-[16px]",
};

const Button = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape,
  variant = "fill",
  size = "xl",
  color = "gray_300_02",
  ...restProps
}) => {
  return (
    <button
      className={`${className} flex flex-row items-center justify-center text-center cursor-pointer whitespace-nowrap ${shape && shapes[shape]} ${size && sizes[size]} ${variant && variants[variant]?.[color]}`}
      {...restProps}
    >
      {!!leftIcon && leftIcon}
      {children}
      {!!rightIcon && rightIcon}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  shape: PropTypes.oneOf(["circle", "square", "round"]),
  size: PropTypes.oneOf([
    "11xl",
    "12xl",
    "sm",
    "5xl",
    "9xl",
    "13xl",
    "3xl",
    "6xl",
    "md",
    "2xl",
    "7xl",
    "4xl",
    "10xl",
    "xs",
    "lg",
    "8xl",
    "xl",
  ]),
  variant: PropTypes.oneOf(["fill"]),
  color: PropTypes.oneOf([
    "blue_gray_100_03",
    "black_900_0f",
    "blue_gray_500_02",
    "gray_50_01",
    "gray_600_8c",
    "w_background",
    "blue_gray_100_02",
    "deep_purple_A400",
    "blue_gray_500",
    "blue_A200_19",
    "blue_100",
    "blue_A200",
    "blue_gray_100_bc",
    "gray_100_02",
    "gray_300_02",
  ]),
};

export { Button };
