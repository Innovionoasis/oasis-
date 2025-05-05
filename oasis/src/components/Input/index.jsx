import React from "react";
import PropTypes from "prop-types";

const shapes = {
  square: "rounded-[0px]",
  round: "rounded-lg",
};

const variants = {
  fill: {
    system_materials_sm_l_thick: "bg-system_materials-sm_l_thick text-gray-800_99",
    gray_50_04: "bg-gray-50_04",
    gray_50_01: "bg-gray-50_01",
    gray_50_02: "bg-gray-50_02",
    w_background: "bg-w_background",
  },
};

const sizes = {
  "8xl": "h-[58px] pl-[18px] pr-3 text-[16px]",
  "6xl": "h-[56px] pl-8 pr-14",
  xl: "h-[44px] pl-5 pr-3 text-[14px]",
  md: "h-[36px] pl-[18px] pr-2.5 text-[17px]",
  sm: "h-[36px] px-3",
  lg: "h-[40px] pl-[18px] pr-2.5 text-[12px]",
  "7xl": "h-[56px] pl-8 pr-14 text-[12px]",
  "5xl": "h-[56px] px-3 text-[20px]",
  "2xl": "h-[48px] pl-5 pr-3 text-[14px]",
  xs: "h-[36px] px-3 text-[20px]",
  "3xl": "h-[50px] px-3",
  "4xl": "h-[52px] px-4 text-[16px]",
};

const Input = React.forwardRef(
  (
    {
      className = "",
      name = "",
      placeholder = "",
      type = "text",
      label = "",
      prefix,
      suffix,
      onChange,
      shape,
      variant = "fill",
      size = "4xl",
      color = "w_background",
      ...restProps
    },
    ref,
  ) => {
    return (
      <label
        className={`${className} flex items-center justify-center cursor-text  ${shape && shapes[shape]} ${variant && (variants[variant]?.[color] || variants[variant])} ${size && sizes[size]}`}
      >
        {!!label && label}
        {!!prefix && prefix}
        <input ref={ref} type={type} name={name} placeholder={placeholder} onChange={onChange} {...restProps} />
        {!!suffix && suffix}
      </label>
    );
  },
);
Input.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  shape: PropTypes.oneOf(["square", "round"]),
  size: PropTypes.oneOf(["8xl", "6xl", "xl", "md", "sm", "lg", "7xl", "5xl", "2xl", "xs", "3xl", "4xl"]),
  variant: PropTypes.oneOf(["fill"]),
  color: PropTypes.oneOf(["system_materials_sm_l_thick", "gray_50_04", "gray_50_01", "gray_50_02", "w_background"]),
};

export { Input };
