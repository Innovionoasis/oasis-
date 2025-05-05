import { Heading, Img } from "./..";
import React from "react";
import { Link } from "react-router-dom";
import { Globe, Search, Bell } from "lucide-react";

export default function Header({ ...props }) {
  return (
    <header {...props} className="relative w-full bg-gray-50_01">
      <div className="relative h-[98px] w-full">
        <Heading
          size="text7xl"
          as="p"
          className="absolute bottom-[27px] left-[14%] m-auto text-[22.47px] font-medium !text-blue_gray-800"
        >
        </Heading>
        
        <Img
          src="images/img_rectangle_6717.png"
          alt="Image"
          className="absolute bottom-0 right-px m-auto h-[20px] w-[90%] rounded-tl-md rounded-tr-md object-contain"
        />
        
        <div className="absolute left-0 top-0 m-auto h-[92px] w-[10%] content-center md:h-auto">
          <Img
            src="images/img_img_4360_1.png"
            alt="Img4360one"
            className="h-[92px] w-full flex-1 rounded-[32px] object-cover"
          />
          <Heading
            size="headingxl"
            as="p"
            className="absolute bottom-[0.50px] left-10  m-auto text-[13px] font-bold !text-blue_gray-500_02"
          >
            Innovation Oasis
          </Heading>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 flex items-center space-x-4 p-5">
  
  <div className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group cursor-pointer">
    <Globe size={18} />
    <button
      onClick={() => {
        const currentLang = localStorage.getItem("lang") || "ar";
        const newLang = currentLang === "ar" ? "en" : "ar";
        localStorage.setItem("lang", newLang);
        window.location.reload();
      }}
      className="text-sm font-medium"
    >
      {localStorage.getItem("lang") === "en" ? "عربي" : "English"}
    </button>
  </div>


</div>
    </header>
  );
}