import { Img } from "./..";
import React, { useState } from "react";
import { MenuItem, Menu, Sidebar } from "react-pro-sidebar";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { FaEnvelope } from 'react-icons/fa';
import { User } from "lucide-react";

export default function Sidebar2({ ...props }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState({
    username: " ", 
    email: "account1@example.com"
  });
  
  const navigate = useNavigate(); // Added for programmatic navigation

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
      width="80px !important"
      collapsedWidth="80px !important"
      collapsed={collapsed}
      className={`${props.className} flex flex-col self-center h-screen pt-6 top-0 sm:pt-5 bg-w_background !sticky overflow-auto`}
    >
      <Menu
        menuItemStyles={{
          button: {
            padding: "10px",
            justifyContent: "center",
          },
          label: { display: "none" },
        }}
        className="w-full self-stretch"
      >
        <MenuItem 
          component={<Link to="/mentor" />} 
          icon={<Img src="images/img_home.png" alt="Home" className="h-[36px] w-[34px] object-cover" />} 
        />
        <MenuItem 
          component={<Link to="/MentorProfile" />} 
          icon={<Img src="images/img_male_user.png" alt="Maleuser" className="h-[36px] w-[36px] object-cover" />} 
        />
        <MenuItem 
          component={<Link to="/page13" />} 
          icon={<Img src="images/img_light_on.png" alt="Lighton" className="h-[36px] w-[34px] object-cover" />} 
        />
        <MenuItem 
          component={<Link to="/chat" />} 
          icon={<Img src="images/img_user.svg" alt="User" className="h-[36px] w-[34px]" />} 
        />
        <MenuItem 
          component={<Link to="/page25" />} 
          icon={<Img src="images/img_search.svg" alt="Search" className="h-[36px] w-[34px]" />} 
        />
        
        {/* Modified logout button to use the handleLogoutClick function */}
        <MenuItem 
          onClick={handleLogoutClick} 
          icon={<Img src="images/img_logout_rounded.png" alt="Logoutrounded" className="h-[50px] w-[56px] object-contain" />} 
        />
      </Menu>
    </Sidebar>
  );
}