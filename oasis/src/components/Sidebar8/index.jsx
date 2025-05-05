import { Img } from "./..";
import React from "react";
import { MenuItem, Menu, Sidebar } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";

export default function Sidebar4({ ...props }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();

  // Add logout confirmation function
  const handleLogoutClick = () => {
    const confirmed = window.confirm("هل أنت متأكد أنك تريد تسجيل الخروج؟");
    if (confirmed) {
      // نفترض أن صفحة تسجيل الدخول هي /login، غيرها إذا احتجت
      navigate("/Homepage");
    }
  };

  return (
    <Sidebar
      {...props}
      width="86px !important"
      collapsedWidth="80px !important"
      collapsed={collapsed}
      className={`${props.className} flex flex-col h-screen top-[-10px] left-0 bg-w_background fixed z-50 overflow-hidden`}
    >
      <Menu
        menuItemStyles={{
          button: {
            padding: "16px",
            justifyContent: "center",
          },
          label: { display: "none" },
        }}
        rootStyles={{ ["&>ul"]: { gap: "1.00px" } }}
        className="flex w-full flex-col self-stretch"
      >
        <MenuItem 
          icon={<Img src="images/img_home.png" alt="Home" className="h-[36px] w-[36px] object-cover opacity-40" />} 
          onClick={() => navigate("/rev")}
        />
        <MenuItem 
          icon={<Img src="images/img_light_on.png" alt="Lighton" className="h-[36px] w-[36px] object-cover opacity-40" />} 
          onClick={() => navigate("/page4")}
        />
        <MenuItem 
          icon={<Img src="images/img_pass_fail.png" alt="Passfail" className="h-[36px] w-[36px] object-cover opacity-40" />} 
          onClick={() => navigate("/page18")}
        />
        <MenuItem 
          icon={<Img src="images/img_to_do.png" alt="Todo" className="h-[36px] w-[36px] object-cover opacity-40" />} 
          onClick={() => navigate("/page12")}
        />
        <MenuItem 
          icon={<Img src="images/img_male_user.png" alt="Maleuser" className="h-[36px] w-[36px] object-cover opacity-40" />} 
          onClick={() => navigate("/page21")}
        />
        <MenuItem 
          icon={<Img src="images/img_search.svg" alt="Search" className="h-[36px] w-[36px] object-cover opacity-40" />} 
          onClick={() => navigate("/page25")}
        />
        <MenuItem 
          icon={<Img src="images/img_logout_rounded_36x36.png" alt="Logoutrounded" className="h-[36px] w-[36px] object-cover opacity-0.44" />} 
          onClick={handleLogoutClick} // Changed to use the confirmation function
        />
      </Menu>
    </Sidebar>
  );
}