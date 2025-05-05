import { Helmet } from "react-helmet";
import { Button, Heading, Img } from "../../components";
import Header from "../../components/Header";
import Sidebar3 from "../../components/Sidebar3";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import translations from "../../translations/translations";

const lang = localStorage.getItem("lang") || "ar";


export default function InnovatorPage() {
  const [animateItems, setAnimateItems] = useState(false);

  useEffect(() => {
    setAnimateItems(true);
  }, []);

  const primaryColor = "bg-blue-gray-100_03"; 
  const accentColor1 = "bg-blue-200";
  const accentColor2 = "bg-purple-200";
  const textColor = "text-gray-800";
  const hoverEffect = "hover:shadow-lg hover:bg-gray-100";

  const dashboardItems = [
    {
      title: translations.common.mentorshipRequestLabel[lang],
      link: "/page16",
    },
    {
      title: translations.common.ideasLabel[lang],
      link: "/page11",
    },
    {
      title: translations.common.fundingRequestLabel[lang],
      link: "/page19",
    },
    {
      title: translations.common.smartEvaluationLabel[lang],
      link: "/botAI",
    },
    {
      title: translations.common.viewFundingRequestsLabel[lang],
      link: "/page24",
    },
    {
      title: translations.common.viewMentorshipRequestsLabel[lang],
      link: "/page22",
    },
    {
      title: translations.common.contractManagementLabel[lang],
      link: "/page23",
    },

  ];

  return (
    <>
      <Helmet>
        <title>Innovator Dashboard - Access Your Innovation Tools</title>
        <meta
          name="description"
          content="Explore the Innovation Oasis as an innovator. Find guidance, submit ideas, request funding, get smart evaluations, and manage contracts for your innovative projects."
        />
      </Helmet>
      <div className="w-full bg-gray-50 min-h-screen">
        <div>
          <Header className="ml-2.5 mr-[19px] md:mx-0" />
          <div className="flex items-start">
            <Sidebar3 />
            <div className="mt-[16px] flex flex-1 justify-center px-14 md:px-5">
              <div className="flex w-full min-h-screen flex-col items-center pt-[100px]">
                <div className="relative mb-16">
                  <Heading
                    size="heading8xl"
                    as="h1"
                    className="self-center text-[40px] font-bold text-gray-700 md:text-[36px] sm:text-[32px]"
                  >
                  {translations.pages.Innovator.title[lang]}
                  </Heading>
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full"></div>
                </div>

                <div className="mx-[222px] mt-[20px] flex items-center justify-center self-stretch md:mx-0 md:flex-col">
                  <div className="h-px w-[38%] bg-gray-300" />
                  <div className="mx-2 h-[12px] w-[12px] rounded-full bg-blue-200" />
                  <div className="mx-2 h-[12px] w-[12px] rounded-full bg-gray-300" />
                  <div className="mx-2 h-[12px] w-[12px] rounded-full bg-purple-200" />
                  <div className="h-px w-[38%] bg-gray-300" />
                </div>

                <div className="mt-[40px] w-full max-w-[1000px]">
                  <div className="grid grid-cols-3 gap-8 sm:grid-cols-1 md:grid-cols-2">
                    {dashboardItems.map((item, index) => (
                      <Link 
                        key={index} 
                        to={item.link || "#"} 
                        className="group"
                      >
                        <div 
                          className={`
                            w-full h-[180px] flex flex-col justify-center items-center 
                            rounded-[30px] ${primaryColor} ${textColor}
                            shadow-md transform transition-all duration-300
                            ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                            hover:scale-105 ${hoverEffect}
                            relative overflow-hidden
                          `}
                          style={{ transitionDelay: `${index * 0.1}s` }}
                        >
                          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-200 to-purple-200 opacity-60"></div>
                          
                          <div className="absolute bottom-0 right-0 w-20 h-20 bg-blue-200 opacity-20 rounded-tl-3xl"></div>
                          <div className="absolute top-0 left-0 w-16 h-16 bg-purple-200 opacity-10 rounded-br-3xl"></div>
                          
                          <span className="text-4xl mb-3">{item.icon}</span>
                          <span className="text-[34px] font-bold mb-2 text-center px-4">
                            {item.title}
                          </span>
                          
                          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}