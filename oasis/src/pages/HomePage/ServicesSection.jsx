import { Text } from "../../components";
import React, { useEffect, useRef, useState } from "react";
import { FiUsers, FiDollarSign, FiCompass, FiCheckCircle } from "react-icons/fi";

export default function ServicesSection({ isEnglish = false }) {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const servicesList = [
    {
      ar: {
        title: "الشبكات المهنية",
        description: "بناء شبكة تعاون بين المبتكرين والمرشدين والمستثمرين لتعزيز الفرص وتبادل الخبرات."
      },
      en: {
        title: "Professional Networks",
        description: "Building a collaborative network between innovators, mentors, and investors to enhance opportunities and exchange expertise."
      },
      icon: <FiUsers className="w-10 h-10 text-[#F5EFEB]" />
    },
    {
      ar: {
        title: "التمويل والاستثمار",
        description: "تسهيل التواصل مع المستثمرين لتوفير التمويل اللازم للمشاريع."
      },
      en: {
        title: "Funding & Investment",
        description: "Facilitating connections with investors to provide the necessary funding for projects."
      },
      icon: <FiDollarSign className="w-10 h-10 text-[#F5EFEB]" />
    },
    {
      ar: {
        title: "التوجيه والإرشاد",
        description: "توفير مرشدين ذوي خبرة لدعم المبتكرين في تطوير أفكارهم."
      },
      en: {
        title: "Mentoring & Guidance",
        description: "Providing experienced mentors to support innovators in developing their ideas."
      },
      icon: <FiCompass className="w-10 h-10 text-[#F5EFEB]" />
    },
    {
      ar: {
        title: "تقييم الأفكار",
        description: "تقييم سريع وفعال للأفكار باستخدام الذكاء الاصطناعي أو خبراء متخصصين."
      },
      en: {
        title: "Idea Evaluation",
        description: "Quick and effective evaluation of ideas using artificial intelligence or specialized experts."
      },
      icon: <FiCheckCircle className="w-10 h-10 text-[#F5EFEB]" />
    }
  ];

  //  تمرير تلقائي كل 3 ثوانٍ
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % servicesList.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [servicesList.length]);

  //  التمرير 
  useEffect(() => {
    const card = cardRefs.current[activeIndex];
    const container = containerRef.current;

    if (card && container) {
      const cardLeft = card.offsetLeft;
      const cardWidth = card.offsetWidth;
      const containerWidth = container.offsetWidth;

      const scrollTo = cardLeft - (containerWidth - cardWidth) / 2;

      container.scrollTo({
        left: scrollTo,
        behavior: "smooth"
      });
    }
  }, [activeIndex]);

  return (
    <>
      <div className={`px-6 py-16 ${isEnglish ? "ltr" : "rtl"} bg-white`} dir={isEnglish ? "ltr" : "rtl"}>
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col items-center gap-16">
            <Text size="text13xl" as="h2" className="text-6xl font-bold text-[#2F4156]">
              {isEnglish ? "Services" : "الخدمات"}
            </Text>

            <div
              ref={containerRef}
              className="services-scroll-wrapper flex overflow-x-auto gap-6 w-full py-20 px-4"
              style={{ background: "linear-gradient(to bottom, #2F4156, #567C8D)" }}
            >
              {servicesList.map((item, index) => (
                <div
                  key={index}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className="glass"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="icon-container">{item.icon}</div>
                    <h3 className="text-lg font-bold text-[#F5EFEB] text-center">
                      {isEnglish ? item.en.title : item.ar.title}
                    </h3>
                    <p className="text-center px-4 hidden-content">
                      {isEnglish ? item.en.description : item.ar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .services-scroll-wrapper {
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          overflow-y: hidden;
          max-height: 100%;
        }

        .services-scroll-wrapper::-webkit-scrollbar {
          display: none;
        }

        .glass {
          min-width: 340px;
          height: auto;
          background: linear-gradient(rgba(200, 217, 230, 0.3), rgba(47, 65, 86, 0.1));
          border: 1px solid rgba(245, 239, 235, 0.2);
          box-shadow: 0 25px 45px rgba(47, 65, 86, 0.3);
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          transition: 0.5s;
          border-radius: 15px;
          backdrop-filter: blur(10px);
          cursor: pointer;
          padding: 24px;
          text-align: center;
          scroll-snap-align: start;
        }

        .icon-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100px;
          width: 100px;
          background-color: rgba(47, 65, 86, 0.6);
          border-radius: 50%;
          margin-bottom: 20px;
        }

        .hidden-content {
          color: #F5EFEB;
          font-size: 1.1rem;
          text-align: center;
          max-width: 90%;
        }

        @media (max-width: 768px) {
          .glass {
            min-width: 80%;
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
}
