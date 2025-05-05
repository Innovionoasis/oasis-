import { Text } from "../../components";
import React from "react";

export default function InnovationSupportSection({ isEnglish = false }) {
  const content = [
    {
      number: "01",
      title: isEnglish
        ? "Supporting Innovation and Entrepreneurship"
        : "دعم الابتكار وريادة الأعمال",
      description: isEnglish
        ? "Innovation Oasis platform aims to support innovators and entrepreneurs in Saudi Arabia to transform their ideas into successful projects."
        : "منصة Innovation Oasis تهدف إلى دعم المبتكرين ورواد الأعمال في المملكة العربية السعودية لتحويل أفكارهم إلى مشاريع ناجحة.",
      bg: "#C8D9E6"
    },
    {
      number: "02",
      title: isEnglish ? "Integrated Services" : "خدمات متكاملة",
      description: isEnglish
        ? "We provide intelligent idea assessment using artificial intelligence, specialized guidance from experienced mentors, and funding opportunities through a wide network of investors."
        : "نقدم تقييمًا ذكيًا للأفكار باستخدام الذكاء الاصطناعي، توجيهًا متخصصًا من مرشدين ذوي خبرة، وفرص تمويل من خلال شبكة واسعة من المستثمرين.",
      bg: "#567C8D33"
    },
    {
      number: "03",
      title: isEnglish ? "Building Collaboration Networks" : "بناء شبكات تعاون",
      description: isEnglish
        ? "We seek to build an integrated ecosystem that connects innovators with mentors and investors to promote collaboration and exchange of expertise."
        : "نسعى إلى بناء نظام بيئي متكامل يربط المبتكرين بالمرشدين والمستثمرين لتعزيز التعاون وتبادل الخبرات.",
      bg: "#2F415633"
    },
    {
      number: "04",
      title: isEnglish ? "Achieving Vision 2030" : "تحقيق رؤية 2030",
      description: isEnglish
        ? "We work to enhance innovation and entrepreneurship to support the goals of Vision 2030 and build a knowledge and innovation-based economy."
        : "نعمل على تعزيز الابتكار وريادة الأعمال لدعم أهداف رؤية 2030 وبناء اقتصاد قائم على المعرفة والابتكار.",
      bg: "#F5EFEB"
    }
  ];

  return (
    <>
      <div id="about-section" className="max-w-screen-xl mx-auto py-20 px-6 bg-white">
        <div className="flex flex-col items-center">
          <Text
            size="text13xl"
            as="p"
            className="text-6xl font-bold mb-20 text-center text-[#2F4156]"
          >
            {isEnglish ? "About the Platform" : "عن المنصة"}
          </Text>

          <div className="innovation-scroll-wrapper flex overflow-x-auto gap-6 w-full px-2 py-8">
            {content.map((item, i) => (
              <div
                key={i}
                className="innovation-card scroll-snap"
                style={{
                  background: item.bg
                }}
              >
                <Text size="text15xl" as="p" className="!font-jersey text-8xl font-bold mb-12 md:text-7xl">
                  {item.number}
                </Text>
                <div className="mt-auto">
                  <Text
                    size="text9xl"
                    as="p"
                    className="text-2xl font-bold mb-6"
                    style={{ textAlign: isEnglish ? "left" : "right" }}
                  >
                    {item.title}
                  </Text>
                  <Text as="p" className="text-lg" style={{ textAlign: isEnglish ? "left" : "right" }}>
                    {item.description}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .innovation-scroll-wrapper {
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }

        .innovation-scroll-wrapper::-webkit-scrollbar {
          display: none;
        }

        .scroll-snap {
          scroll-snap-align: start;
          flex-shrink: 0;
        }

        .innovation-card {
          min-width: 300px;
          max-width: 400px;
          min-height: 520px;
          height: auto;
          padding: 2.5rem;
          border-radius: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          transition: all 0.3s ease;
        }

        .innovation-card:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }

        @media (max-width: 768px) {
          .innovation-card {
            min-width: 80%;
            padding: 2rem;
          }
        }
      `}</style>
    </>
  );
}

