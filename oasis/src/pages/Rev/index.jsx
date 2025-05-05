import { Text } from "../../components"; 
import Header from "../../components/Header"; 
import Sidebar4 from "../../components/Sidebar8"; 
import React, { Suspense, useEffect, useState } from "react"; 
import { Link } from "react-router-dom"; 

const translations = {
  ar: {
    title: "رؤيتك الناقدة هي اساس الابتكار",
    search: "بحث",
    notifications: "الإشعارات",
    notification1: "إشعار 1",
    notification2: "إشعار 2",
    notification3: "إشعار 3",
    language: "العربية",
    view: "عرض",
  },
  en: {
    title: "Your critical vision is the foundation of innovation",
    search: "Search",
    notifications: "Notifications",
    notification1: "Notification 1",
    notification2: "Notification 2",
    notification3: "Notification 3",
    language: "English",
    view: "View",
  }
};

const evaluationIdeasList = [ 
  { prop: { ar: "  جميع الأفكار في المنصة", en: "page12" }, link: "/page12" }, 
  { prop: { ar: "الأفكار المقيمة", en: "page18" }, link: "/page18" }, 
  { prop: { ar: " الأفكار المقبولة التي تحتاج تقييم نهائي", en: "page4" }, link: "/page4" }, 
]; 

const Button = ({ text }) => {
  return (
    <button className="bg-blue-200 text-white border-none cursor-pointer rounded-md w-[100px] h-[45px] transition duration-300 hover:bg-blue-400 hover:text-white hover:shadow-md">{text}</button>
  );
};

const Card = ({ title, linkText, link }) => { 
  return ( 
    <div className="h-[16em] w-[18em] rounded-[1.5em] bg-gradient-to-b from-[#b0b3b8] to-[#d1d5db] text-white font-nunito p-[1em] flex justify-center items-center flex-col gap-[0.75em] shadow-lg backdrop-blur-[12px]"> 
      <div className="text-center"> 
        <h1 className="text-[1.5em] font-medium">{title}</h1> 
      </div> 
      <Link to={link} className="mt-4"> 
        <Button text={linkText} /> 
      </Link>
    </div> 
  ); 
}; 

export default function RevPage() { 
  useEffect(() => { 
    document.title = "Review Ideas - Contribute to Innovation"; 
  }, []); 

  return ( 
    <div className="w-full bg-w_background"> 
      <div className="mb-[52px]"> 
        <Header /> 
        <div className="flex items-start"> 
          <div className="w-[60px] md:w-[50px] sm:w-[40px]"> 
            <Sidebar4 className="text-gray-400 [&>svg]:text-gray-400 [&>svg:first-child]:text-black" /> 
          </div>
          <div className="mt-[124px] flex flex-1 flex-col items-center px-14 md:px-5"> 
            <Text size="m3_display_medium" as="p" className="!font-roboto text-[45px] font-normal md:text-[41px] sm:text-[35px] mt-10" > 
              {translations["ar"].title}
            </Text> 
            <div className="mt-4 flex w-[50%] items-center justify-center md:w-full sm:flex-col"> 
              <div className="h-px w-[34%] bg-black-900" /> 
              <div className="flex w-[16%] justify-end gap-[11px] sm:w-full"> 
                <div className="h-[20px] w-[12px] rounded-[50%] bg-blue_gray-500_02" /> 
                <div className="h-[20px] w-[12px] rounded-[50%] bg-blue_gray-500_02" /> 
                <div className="h-[20px] w-[12px] rounded-[50%] bg-blue_gray-500_02" /> 
              </div> 
              <div className="ml-[42px] h-px w-[34%] bg-black-900 sm:ml-0" /> 
            </div> 
            <div className="mt-40 flex w-full justify-center gap-[30px] flex-wrap"> 
              <Suspense fallback={<div>Loading feed...</div>}> 
                {evaluationIdeasList.map((d, index) => ( 
                  <Card key={index} title={d.prop["ar"]} linkText={translations["ar"].view} link={d.link} /> 
                ))} 
              </Suspense> 
            </div> 
          </div> 
        </div> 
      </div> 
    </div> 
  ); 
}