import { Img } from "./..";
import React from "react";
import { MenuItem, Menu, Sidebar } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";

export default function Sidebar1({ ...props }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate(); // لاستخدام التنقل البرمجي

  const handleLogoutClick = () => {
    const confirmed = window.confirm("هل أنت متأكد أنك تريد تسجيل الخروج؟");
    if (confirmed) {
      // نفترض أن صفحة تسجيل الدخول هي /login، غيرها إذا احتجت
      navigate("/login");
    }
  };

  return (
    <Sidebar
      {...props}
      width="124px !important"
      collapsedWidth="80px !important"
      collapsed={collapsed}
      className={`${props.className} flex flex-col h-screen top-0 !sticky overflow-auto`}
    >
      <Menu
        menuItemStyles={{
          button: ({ active }) => ({
            padding: "12px",
            alignSelf: "stretch",
            borderRadius: "10px",
            backgroundColor: active ? "#ffffff" : "transparent",
            "&:hover": { backgroundColor: "#ffffff !important" },
          }),
          label: { display: "none" },
        }}
        rootStyles={{ ul: { gap: "4px" } }}
        className="flex w-full flex-col items-start self-stretch px-1.5"
      >
        {/* أيقونة تسجيل الخروج مع تأكيد */}
        <MenuItem
          icon={
            <Img
              src="images/img_logout_rounded_30x46.png" // تأكد أن هذه الأيقونة موجودة
              alt="Logout"
              className="h-[46px] w-[46px] object-contain opacity-80"
            />
          }
          onClick={handleLogoutClick}
        />
      </Menu>
    </Sidebar>
  );
}
