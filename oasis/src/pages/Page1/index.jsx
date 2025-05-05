import { Helmet } from "react-helmet";
import { Heading } from "../../components";
import Header from "../../components/Header";
import Sidebar20 from "components/Sidebar20";
import React from "react";
import { Bell, Search, Globe } from "lucide-react";
import { Link } from "react-router-dom";

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

const CustomInvestorCard = ({ title, subtitle, imagePath, className, linkTo }) => {
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
        <Button className="min-w-[52px] rounded-lg border border-solid border-gray-600 px-4 py-1" linkTo={linkTo}>
          الكل
        </Button>
      </div>
    </div>
  );
};

export default function investorPage() {
  const cardsData = [
    {
      id: 1,
      title: "استثمر في الفكرة التي تثير اهتمامك",
      subtitle:"اطلع على الافكار وقدم الدعم لها",
      imagePath: "images/img_hand_writes_down.png",
      linkTo: "/Page30" 
    },
    {
      id: 2,
      title: "طلبات التمويل",
      subtitle: "اطلع على طلبات المبتكرين لتكون ممول لهم",
      imagePath: "images/img_finance_management.png",
      linkTo: "/Page3"
    },
    
  ];

  const sidebarLinks = {
    home: "/Page1", 
    profile: "/Page17", 
    ideas: "/Page13", 
    funding: "/Page14", 
    chat: "/ChatInvestor"
  };

  const SidebarWithLinks = () => (
    <Sidebar20 
      homeLink={sidebarLinks.home}
      profileLink={sidebarLinks.profile}
      ideasLink={sidebarLinks.ideas}
      fundingLink={sidebarLinks.funding}
      chatLink={sidebarLinks.chat}
    />
  );

  return (
    <>
      <Helmet>
        <title>Mentor Guidance - Fostering Innovation</title>
        <meta
          name="description"
          content="Your guidance makes a difference. Supervise innovators, review new requests, and browse inspiring ideas to oversee and contribute to the excellence of innovation."
        />
      </Helmet>
      
      <div className="w-full bg-gray-50_01">
        <div>
          <Header className="mr-3 md:mr-0" homeLink={sidebarLinks.home} />
          
          <div className="absolute top-0 right-0 flex items-center gap-4 p-5">
          
          </div>
          
          <div className="flex items-start">
            <SidebarWithLinks />
            <div className="mt-[84px] flex flex-1 justify-center px-14 md:px-5">
              <div className="flex w-[94%] flex-col items-center gap-[20px] md:w-full sm:gap-[33px]">
                <Heading size="heading9xl" as="h1" className="text-[36px] font-semibold md:text-[34px] sm:text-[32px]">
              كل فكرة تستحق ان تكون واقع
                </Heading>
                <div className="flex w-[46%] items-center justify-center md:w-full sm:flex-col"> 
                  <div className="h-px flex-1 bg-black-900 sm:self-stretch" />
                  <div className="ml-[42px] h-[20px] w-[12px] rounded-[50%] bg-blue_gray-500_02 sm:ml-0" />
                  <div className="ml-2.5 h-[20px] w-[12px] rounded-[50%] bg-blue_gray-500_02 sm:ml-0" />
                  <div className="ml-2.5 h-[20px] w-[12px] rounded-[50%] bg-blue_gray-500_02 sm:ml-0" />
                  <div className="ml-[42px] h-px flex-1 bg-black-900 sm:ml-0 sm:self-stretch" />
                </div>
               
                <div className="mt-28 w-full flex justify-center gap-40 md:flex-col">
                  <div className="w-[500px] md:w-full">
                    <CustomInvestorCard
                      title={cardsData[0].title}
                      subtitle={cardsData[0].subtitle}
                      imagePath={cardsData[0].imagePath}
                      className="bg-gray-300_66 h-full w-full"
                      linkTo={cardsData[0].linkTo} 
                    />
                  </div>
                  
                  <div className="w-[500px] md:w-full">
                    <CustomInvestorCard
                      title={cardsData[1].title}
                      subtitle={cardsData[1].subtitle}
                      imagePath={cardsData[1].imagePath}
                      className="bg-gray-300_66 h-full w-full"
                      linkTo={cardsData[1].linkTo}
                    />
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