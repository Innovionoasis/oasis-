import { Img } from "./..";
import React, { useState } from "react";
import { MenuItem, Menu, Sidebar } from "react-pro-sidebar";
import { User } from "react-feather"; // أيقونة المستخدم
import { useNavigate } from "react-router-dom"; // إضافة هوك الانتقال

export default function Sidebar20({ ...props }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // لتحديد حالة فتح القائمة
  const [currentAccount, setCurrentAccount] = useState({
    username: " ", 
    email: "account1@example.com"
  });
  
  // إضافة هوك الانتقال
  const navigate = useNavigate();

  // قائمة الحسابات
  const accounts = [
    { username: '  مشرف ', email: 'account1@example.com' },
    { username: 'مستثمر', email: 'account2@example.com' },
  ];

  // دالة لتبديل الحسابات
  const switchAccount = (account) => {
    setCurrentAccount(account);
    setIsDropdownOpen(false); // إغلاق القائمة بعد التبديل
  };

  // دالة للانتقال إلى الصفحات
  const navigateTo = (path) => {
    navigate(path);
  };

  // إضافة دالة تسجيل الخروج مع التأكيد
  const handleLogoutClick = () => {
    const confirmed = window.confirm("هل أنت متأكد أنك تريد تسجيل الخروج؟");
    if (confirmed) {
      // نفترض أن صفحة تسجيل الدخول هي /login، غيرها إذا احتجت
      navigate("/Homepage");
    }
  };

  return (
    <div className="relative flex">
      {/* السايد بار */}
      <Sidebar
        {...props}
        width="76px !important"
        collapsedWidth="80px !important"
        collapsed={collapsed}
        className={'${props.className} flex flex-col self-center h-screen pt-8 top-0 sm:pt-5 bg-w_background !sticky overflow-auto'}
      >
        <Menu
          menuItemStyles={{
            button: {
              padding: "6px",
              justifyContent: "center",
              cursor: "pointer", // إضافة مؤشر الماوس
              ['&:hover, &.ps-active']: { background: "linear-gradient(268.22deg,rgb(84, 117, 176),#4182f901)" },
            },
            label: { display: "none" },
          }}
          rootStyles={{ ["&>ul"]: { gap: "10.00px" } }}
          className="flex w-full flex-col self-stretch"
        >
          {/* تعديل العناصر لإضافة وظيفة الانتقال */}
          <MenuItem 
            icon={<Img src="images/img_home.png" alt="Home" className="h-[32px] w-[34px] object-cover" />} 
            onClick={() => navigateTo("/Page1")} // الانتقال إلى الصفحة الرئيسية
          />
          <MenuItem 
            icon={<Img src="images/img_male_user.png" alt="Maleuser" className="h-[32px] w-[34px] object-cover" />} 
            onClick={() => navigateTo("/Page17")} // الانتقال إلى صفحة البروفايل
          />
          <MenuItem 
            icon={<Img src="images/img_light_on.png" alt="Lighton" className="h-[32px] w-[34px] object-cover" />} 
            onClick={() => navigateTo("/Page30")} // الانتقال إلى صفحة الأفكار
          />
          <MenuItem 
            icon={<Img src="images/img_coin_in_hand.png" alt="Coininhand" className="h-[32px] w-[34px] object-cover" />} 
            onClick={() => navigateTo("/Page14")} // الانتقال إلى صفحة التمويل
          />
          <MenuItem 
            icon={<Img src="images/img_settings.svg" alt="Settings" className="h-[32px] w-[34px]" />} 
            onClick={() => navigateTo("/chat")} // الانتقال إلى صفحة الدردشة
          />
          <MenuItem 
            icon={<Img src="images/img_to_do.png" alt="Signinga" className="h-[32px] w-[34px] object-cover" />} 
            onClick={() => navigateTo("/Page29")} // الانتقال إلى صفحة 29
          />
          
          {/* إضافة أيقونة جديدة لإنشاء العقود */}
          <MenuItem 
            icon={<Img src="images/img_signing_a_document.png" alt="CreateContract" className="h-[32px] w-[34px] object-cover" />} 
            onClick={() => navigateTo("/InvestorContract")} // الانتقال إلى صفحة إنشاء العقود
          />
          
          <MenuItem 
            icon={<Img src="images/img_search.svg" alt="Search" className="h-[32px] w-[34px]" />} 
            onClick={() => navigateTo("/page25")} // الانتقال إلى صفحة البحث
          />
          
          {/* تعديل زر تسجيل الخروج لاستخدام دالة التأكيد */}
          <MenuItem 
            icon={<Img src="images/img_logout_rounded.png" alt="Logoutrounded" className="h-[32px] w-[34px] object-cover" />} 
            onClick={handleLogoutClick} // استخدام دالة تسجيل الخروج مع التأكيد
          />
          
        </Menu>
      </Sidebar>
    </div>
  );
}