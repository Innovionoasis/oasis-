import { Helmet } from "react-helmet";
import { Text, Img, Button } from "../../components";
import ContactUsSection from "./ContactUsSection";
import InnovationSupportSection from "./InnovationSupportSection";
import ServicesSection from "./ServicesSection";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function Home1Page() {
  const [isEnglish, setIsEnglish] = useState(false);
  const aboutSectionRef = useRef(null);
  const servicesSectionRef = useRef(null);
  const contactSectionRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  return (
    <>
      <Helmet>
        <title>{isEnglish ? "Innovation Oasis - Nurturing Creativity" : "واحة الابتكار - بيئة داعمة للإبداع"}</title>
      </Helmet>

      <div className={`flex w-full flex-col items-start bg-white gap-[60px] ${isEnglish ? 'ltr dir-ltr' : 'rtl dir-rtl'}`} dir={isEnglish ? "ltr" : "rtl"}>
        <header className="w-full bg-white py-6 px-8 flex justify-between items-center shadow-md z-50">
          <div className="flex items-center">
            <Img src="images/img_img_4360_1_140x184.png" alt="Logo" className={`h-[60px] w-auto object-contain ${isEnglish ? 'mr-4' : 'ml-4'}`} />
            <h1 className="text-[28px] font-bold text-[#2F4156]">{isEnglish ? "Innovation Oasis" : "واحة الابتكار"}</h1>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => scrollToSection(aboutSectionRef)}>{isEnglish ? "About" : "عن المنصة"}</button>
            <button onClick={() => scrollToSection(servicesSectionRef)}>{isEnglish ? "Services" : "الخدمات"}</button>
            <button onClick={() => scrollToSection(contactSectionRef)}>{isEnglish ? "Contact" : "الاتصال بنا"}</button>
            <button onClick={toggleLanguage} className="bg-[#2F4156] text-white px-3 py-1 rounded-md hover:bg-[#567C8D]">{isEnglish ? "العربية" : "English"}</button>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/Login"><Text>{isEnglish ? "Login" : "تسجيل الدخول"}</Text></Link>
            <Link to="/Registration">
  <Button
    className="rounded-[20px] px-6 py-2 bg-gradient-to-r from-[#C8D9E6] to-[#BFDDEB] text-[#2F4156] font-semibold hover:from-[#BFDDEB] hover:to-[#C8D9E6] transition-all"
  >
    {isEnglish ? "Register" : "التسجيل"}
  </Button>
</Link>
          </div>
        </header>

        <div className="relative w-full h-[800px] flex justify-center items-center px-8 mt-0">
          <div className="absolute w-[94%] h-[90%] rounded-[34px] bg-[#e4ebf1] top-0"></div>

          <div className="relative z-10 w-[90%] max-w-[1200px] flex flex-col items-center text-center">
            <Text className="text-[65px] font-normal text-black-900_72">{isEnglish ? "Innovation Oasis Platform\nSupportive Environment for Creativity" : "منصة Innovation Oasis\nبيئة داعمة للإبداع والابتكار"}</Text>

            <Text className="max-w-[80%] text-[18px] text-blue_gray-500_02 mt-6">
              {isEnglish
                ? "Platform supporting innovators in Saudi Arabia with AI evaluation, guidance, and investment."
                : "منصة Innovation Oasis هي بيئة شاملة لدعم المبتكرين ورواد الأعمال في المملكة العربية السعودية. نقدم خدمات متكاملة تشمل تقييم الأفكار باستخدام الذكاء الاصطناعي، التوجيه المتخصص من مرشدين ذوي خبرة، وفرص التمويل من خلال شبكة واسعة من المستثمرين."
                }
            </Text>

            <div className="flex justify-center gap-10 mt-12 flex-wrap">
              <div className="card custom-card">
                <div className="content">
                  <h2 className="heading">{isEnglish ? "Innovative Ideas" : "الأفكار المبتكرة"}</h2>
                  <p className="para">{isEnglish ? "Explore creative ideas shared by users." : "تعرف على أحدث الأفكار المبتكرة المقدمة من مستخدمي منصة Innovation Oasis. يمكنك استعراض الأفكار المقبولة والمقترحات الجديدة التي تساهم في بناء مستقبل أفضل."
                    }</p>
                </div>
              </div>

              <div className="card custom-card">
                <div className="content">
                  <h2 className="heading">{isEnglish ? "Connect with Investors" : "تواصل مع المستثمرين"}</h2>
                  <p className="para">{isEnglish ? "Join the investor network and support innovation." : "هل أنت مستثمر أو مرشد وتريد المشاركة في دعم الأفكار المبتكرة؟ تواصل معنا اليوم لتصبح جزءًا من مجتمع Innovation Oasis وساهم في بناء مستقبل الابتكار."
                    }</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[120px] w-full lg:gap-[100px] md:gap-[80px] sm:gap-[60px]">
          <div ref={aboutSectionRef}><InnovationSupportSection isEnglish={isEnglish} /></div>
          <div ref={servicesSectionRef}><ServicesSection isEnglish={isEnglish} /></div>
          <div ref={contactSectionRef}><ContactUsSection isEnglish={isEnglish} /></div>
        </div>

        <footer className="w-full px-6 py-10 bg-[#2F4156] text-white">
  <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-10">
    
    <div className="flex items-start gap-4">
      <Img
        src="images/img_img_4360_1_140x184.png"
        alt="Innovation Oasis Logo"
        className="h-[60px] w-auto object-contain brightness-200"
      />
      <div>
        <h3 className="text-xl font-bold mb-1">
          {isEnglish ? "Innovation Oasis" : "واحة الابتكار"}
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed max-w-[260px]">
          {isEnglish
            ? "Empowering innovators with AI-based tools and mentorship to bring ideas to life."
            : "تمكين المبتكرين بأدوات الذكاء الاصطناعي والإرشاد لتحقيق الأفكار."}
        </p>
      </div>
    </div>

    <div className="flex flex-col gap-3 text-sm mt-4 lg:mt-0">
      <button className="hover:text-[#C8D9E6] transition-colors">
        {isEnglish ? "Privacy Policy" : "سياسة الخصوصية"}
      </button>
      <button className="hover:text-[#C8D9E6] transition-colors">
        {isEnglish ? "Terms of Use" : "شروط الاستخدام"}
      </button>
    </div>

    <div className="text-xs text-gray-400 mt-6 lg:mt-0">
      {isEnglish
        ? "© 2025 Innovation Oasis. All rights reserved."
        : "© 2025 واحة الابتكار. جميع الحقوق محفوظة."}
    </div>
  </div>
</footer>

      </div>

      <style jsx>{`
  .card.custom-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 320px;
  padding: 2px;
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.5s ease;
}

.custom-card .content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  padding: 30px;
  border-radius: 22px;
  background: #ffffff;
  color: #2F4156;
  transition: all 0.5s ease;
}

.custom-card .heading {
  font-size: 32px;
  font-weight: bold;
  color: #2F4156;
}

.custom-card .para {
  font-size: 16px;
  color: #567C8D;
  opacity: 0.9;
}

.custom-card::before {
  content: "";
  position: absolute;
  height: 160%;
  width: 160%;
  border-radius: inherit;
  background: linear-gradient(to right, #C8D9E6, #BFDDEB);
  transform-origin: center;
  animation: rotateCard 4.8s linear infinite paused;
  transition: all 0.8s ease;
}

.custom-card:hover::before {
  animation-play-state: running;
  z-index: -1;
  width: 20%;
}

.custom-card:hover .heading,
.custom-card:hover .para {
  color: #000000;
}

.custom-card:hover {
  box-shadow: 0px 6px 13px rgba(200, 217, 230, 0.2),
    0px 24px 24px rgba(200, 217, 230, 0.15),
    0px 55px 33px rgba(200, 217, 230, 0.1),
    0px 97px 39px rgba(200, 217, 230, 0.05);
  scale: 1.05;
}

@keyframes rotateCard {
  0% { transform: rotate(0); }
  100% { transform: rotate(360deg); }
}

`}</style>

    </>
  );
}
