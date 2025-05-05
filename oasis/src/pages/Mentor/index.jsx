import { Helmet } from "react-helmet";
import { Heading } from "../../components";
import Header from "../../components/Header";
import Sidebar2 from "../../components/Sidebar2";
import React from "react";
import { Link } from "react-router-dom";
import styled from 'styled-components';
import translations from "../../translations/translations";

const lang = localStorage.getItem("lang") || "ar"; 

const Img = ({ src, alt, className }) => (
  <img src={src || "images/img_image_1.png"} alt={alt} className={className} />
);

const Text = ({ className, children }) => (
  <p className={className}>{children}</p>
);

const Button = ({ className, children, linkTo }) => (
  <Link to={linkTo || "#"}>
    <button className={className}>{children}</button>
  </Link>
);
const StyledWrapper = styled.div`
  .btn {
   outline: 0;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    background:rgb(118, 118, 118);
    min-width: 15px;
    border: 0;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, .1);
    box-sizing: border-box;
    padding: 16px 20px;
    color: black;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    overflow: hidden;
    cursor: pointer;
  }

  .btn:hover {
    opacity: .95;
  }

  .btn .animation {
    border-radius: 100%;
    animation: ripple 0.6s linear infinite;
  }

  @keyframes ripple {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.1), 0 0 0 20px rgba(255, 255, 255, 0.1), 0 0 0 40px rgba(255, 255, 255, 0.1), 0 0 0 60px rgba(255, 255, 255, 0.1);
    }

    100% {
      box-shadow: 0 0 0 20px rgba(255, 255, 255, 0.1), 0 0 0 40px rgba(255, 255, 255, 0.1), 0 0 0 60px rgba(255, 255, 255, 0.1), 0 0 0 80px rgba(255, 255, 255, 0);
    }
  }`;



const CustomMentorCard = ({ title, subtitle, imagePath, className, linkTo }) => {

  return (
    <div
      className={`${className} flex sm:flex-col items-start w-full gap-6 p-6 sm:p-5 border border-solid rounded-lg`}
    >
      <div className="relative h-[160px] w-[36%] content-center self-center">
        <Img 
          src={imagePath}
          alt={title} 
          className="h-[160px] w-full flex-1 object-cover" 
        />
        <div
          className="absolute bottom-0 left-0 right-0 top-0 m-auto h-[160px] w-full flex-1 bg-black bg-opacity-20"
        ></div>
      </div>

      <div className="flex flex-1 flex-col items-start gap-4 sm:self-stretch">
        <div className="flex flex-col items-start justify-center gap-0.5 self-stretch">
          <Heading size="heading" as="h4" className="text-2xl font-semibold tracking-tight text-gray-900">
            {title} 
          </Heading>
          
          <Text className="text-base font-normal text-gray-600">
            {subtitle}
          </Text>
        </div>
        <StyledWrapper>
          <Button 
            className="btn" 
            linkTo={linkTo}
          > 
            <i className="animation" /> {translations.common.All[lang]} <i className="animation" />
          </Button>
        </StyledWrapper>
        
      </div>
    </div>
  );
};


export default function MentorPage() {
  const cardsData = [
    {
      id: 1,
      title: translations.pages.MentorPage.cards[0].title[lang],
      subtitle: translations.pages.MentorPage.cards[0].subtitle[lang],
      imagePath: "images/img_image_1.png",
      linkTo: "/page5"
    },
    {
      id: 2,
      title: translations.pages.MentorPage.cards[1].title[lang],
      subtitle: translations.pages.MentorPage.cards[1].subtitle[lang],
      imagePath: "images/img_image_2.png",
      linkTo: "/page9"
    },
    {
      id: 3,
      title: translations.pages.MentorPage.cards[2].title[lang],
      subtitle: translations.pages.MentorPage.cards[2].subtitle[lang],
      imagePath: "images/3photo-mentor.jpg",
      linkTo: "/page13"
    },
    {
      id: 4,
      title: translations.pages.MentorPage.cards[3].title[lang],
      subtitle: translations.pages.MentorPage.cards[3].subtitle[lang],
      imagePath: "images/3photo-mentor.jpg",
      linkTo: "/ReviewRequestsPage"
    },
  ];

  return (
    <>
      <Helmet>
        <title>{translations.pages.MentorPage.title[lang]}</title>
        <meta name="description" content={translations.pages.MentorPage.metaDescription[lang]} />
      </Helmet>

      <div className="w-full bg-gray-50_01">
        <Header />
        <div className="flex items-start">
          <Sidebar2 />
          <div className="mt-[84px] flex flex-1 justify-center px-14 md:px-5">
            <div className="flex w-[94%] flex-col items-center gap-[20px] md:w-full sm:gap-[33px]">
              <Heading size="heading9xl" as="h1" className="text-[36px] font-semibold md:text-[34px] sm:text-[32px]">
                {translations.pages.MentorPage.title[lang]}
              </Heading>

                <div className="flex w-[46%] items-center justify-center md:w-full sm:flex-col"> 
                  <div className="h-px flex-1 bg-black-900 sm:self-stretch" />
                  <div className="ml-[42px] h-[20px] w-[12px] rounded-[50%] bg-blue_gray-500_02 sm:ml-0" />
                  <div className="ml-2.5 h-[20px] w-[12px] rounded-[50%] bg-blue_gray-500_02 sm:ml-0" />
                  <div className="ml-2.5 h-[20px] w-[12px] rounded-[50%] bg-blue_gray-500_02 sm:ml-0" />
                  <div className="ml-[42px] h-px flex-1 bg-black-900 sm:ml-0 sm:self-stretch" />
                </div>
               
                <div className="mt-20 w-full flex justify-center gap-40 md:flex-col">
                  <div className="w-[500px] md:w-full">
                    <CustomMentorCard
                      title={cardsData[0].title}
                      subtitle={cardsData[0].subtitle}
                      imagePath={cardsData[0].imagePath}
                      className="bg-gray-300_66 h-full w-full"
                      linkTo={cardsData[0].linkTo} 
                    />
                  </div>
                  
                  <div className="w-[500px] md:w-full">
                    <CustomMentorCard
                      title={cardsData[1].title}
                      subtitle={cardsData[1].subtitle}
                      imagePath={cardsData[1].imagePath}
                      className="bg-gray-300_66 h-full w-full"
                      linkTo={cardsData[1].linkTo} 
                    />
                  </div>
                </div>

                <div className="mt-2 w-full flex justify-center gap-40 md:flex-col">
                <div className="w-[500px] md:w-full">
                    <CustomMentorCard
                      title={cardsData[2].title}
                      subtitle={cardsData[2].subtitle}
                      imagePath={cardsData[2].imagePath}
                      className="bg-gray-300_66 h-full w-full"
                      linkTo={cardsData[2].linkTo} 
                    />
                  </div>

                  <div className="w-[500px] md:w-full">
                    <CustomMentorCard
                      title={cardsData[3].title}
                      subtitle={cardsData[3].subtitle}
                      imagePath={cardsData[1].imagePath}
                      className="bg-gray-300_66 h-full w-full"
                      linkTo={cardsData[3].linkTo} 
                    />
                  </div>
                  
                  
                </div>
                
               
                
              </div>
             </div>
            </div> 
          </div>
        
    </>
  );
}