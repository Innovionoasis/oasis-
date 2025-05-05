import { Img } from "./..";
import React, { useState } from "react";
import { MenuItem, Menu, Sidebar } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react"; // Assuming you have lucide-react for the User icon

export default function Sidebar3({ ...props }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  // Sample accounts data - replace with your actual data source
  const [accounts, setAccounts] = useState([
    { username: "User 1", id: 1 },
    { username: "User 2", id: 2 },
    { username: "User 3", id: 3 }
  ]);
  
  // Current account state
  const [currentAccount, setCurrentAccount] = useState(accounts[0]);
  
  // Function to handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };
  
  // Function to switch between accounts
  const switchAccount = (account) => {
    setCurrentAccount(account);
    setIsDropdownOpen(false);
    // Add any additional logic needed when switching accounts
  };

  // Added logout confirmation function
  const handleLogoutClick = () => {
    const confirmed = window.confirm("هل أنت متأكد أنك تريد تسجيل الخروج؟");
    if (confirmed) {
      // نفترض أن صفحة تسجيل الدخول هي /login، غيرها إذا احتجت
      navigate("/Homepage");
    }
  };

  return (
    <div className="relative">
      <Sidebar
        {...props}
        width="80px !important"
        collapsedWidth="80px !important"
        collapsed={collapsed}
        className={`${props.className} flex flex-col h-screen top-[18px] top-0 bg-w_background !sticky overflow-auto`}
      >
        <Menu
          menuItemStyles={{
            button: {
              padding: "14px",
              justifyContent: "center",
              marginBottom: "8px",
              cursor: "pointer",
            },
            icon: {
              display: "flex",
              justifyContent: "center",
              minWidth: "36px",
            },
            label: { display: "none" },
          }}
          rootStyles={{
            ["& > ul"]: {
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              padding: "0 4px",
            }
          }}
          className="flex w-full flex-col self-stretch"
        >
          <MenuItem 
            onClick={() => handleNavigation("/innovator")}
            icon={<Img src="images/img_home.png" alt="Home" className="h-[26px] w-[36px] object-cover" />} 
          />
          
          <MenuItem 
            onClick={() => handleNavigation("/page11")}
            icon={<Img src="images/img_light_on.png" alt="Lighton" className="h-[34px] w-[36px] object-cover" />} 
          />
          
          <MenuItem 
            onClick={() => handleNavigation("/page19")}
            icon={<Img src="images/img_coin_in_hand.png" alt="Coininhand" className="h-[32px] w-[32px] object-cover" />} 
          />
          
          <MenuItem 
            onClick={() => handleNavigation("/page16")}
            icon={<Img src="images/img_training.png" alt="Training" className="h-[32px] w-[34px] object-cover" />} 
          />
          
          <MenuItem 
            onClick={() => handleNavigation("/page27")}
            icon={<Img src="images/img_male_user.png" alt="Maleuser" className="h-[34px] w-[28px] object-cover" />} 
          />
          
          <MenuItem 
            onClick={() => handleNavigation("/chat")}
            icon={<Img src="images/img_settings_blue_gray_900_01.svg" alt="Settings" className="h-[24px] w-[22px]" />} 
          />
          
          <MenuItem 
            onClick={() => handleNavigation("/BotAI")}
            icon={<Img src="images/img_message_bot.png" alt="Messagebot" className="h-[32px] w-[36px] object-cover" />} 
          />
          
          <MenuItem 
            onClick={() => handleNavigation("/FrameOne")}
            icon={<Img src="images/img_pass_fail.png" alt="Lighton" className="h-[34px] w-[36px] object-cover" />} 
          />
   
          <MenuItem 
            onClick={() => handleNavigation("/Page25")}
            icon={<Img src="images/img_search.svg" alt="Search" className="h-[24px] w-[24px]" />} 
          />
          
          {/* Changed to use handleLogoutClick instead of handleNavigation */}
          <MenuItem 
            onClick={handleLogoutClick}
            icon={<Img src="images/img_logout_rounded.png" alt="Logoutrounded" className="h-[30px] w-[36px] object-contain" />} 
          />
        </Menu>
      </Sidebar>
    </div>
  );
}