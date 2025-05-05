import { Img, Text } from "../../components";
import { FaXTwitter, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import React, { useRef } from "react";

export default function ContactUsSection({ isEnglish = false }) {
  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = formRef.current;

    const name = form.name.value;
    const email = form.email.value;
    const subject = form.subject.value;
    const message = form.message.value;

    const mailtoLink = `mailto:innovation1oasis@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `${isEnglish ? "Name" : "الاسم"}: ${name}\n${isEnglish ? "Email" : "البريد"}: ${email}\n\n${message}`
    )}`;

    window.location.href = mailtoLink;
  };

  return (
    <>
      <div className="px-6 lg:px-16 py-10 bg-gray-50_91">
        <div className="max-w-screen-xl mx-auto flex flex-row gap-10 md:flex-col-reverse items-start justify-between">
          
          {/* Contact Info */}
          <div className="flex flex-col gap-6 flex-1 max-w-[500px]">
            <div className="info-card flex items-center gap-4 bg-w_background p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="icon-box bg-blue_gray-500_bc p-2 rounded flex items-center justify-center">
                <Img src="images/img_smartphone.png" alt="phone" className="h-8 w-8 object-contain" />
              </div>
              <div className={`${isEnglish ? "text-left" : "text-right"}`}>
                <Text className="font-semibold text-[#2F4156]">
                  {isEnglish ? "Phone Number" : "رقم الهاتف"}
                </Text>
                <Text className="text-[#567C8D] text-sm">+966 123 456 789</Text>
              </div>
            </div>

            <div className="info-card flex items-center gap-4 bg-w_background p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="icon-box bg-blue_gray-500_bc p-2 rounded flex items-center justify-center">
                <Img src="images/img_letter.png" alt="email" className="h-8 w-8 object-contain" />
              </div>
              <div className={`${isEnglish ? "text-left" : "text-right"}`}>
                <Text className="font-semibold text-[#2F4156]">
                  {isEnglish ? "Email Address" : "البريد الإلكتروني"}
                </Text>
                <Text className="text-[#567C8D] text-sm break-all">innovation1oasis@gmail.com</Text>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-4 items-start">
              <Text as="p" className="font-medium text-[#2F4156]">
                {isEnglish ? "Follow us on:" : "تابعنا على:"}
              </Text>
              <div className="flex flex-row items-center justify-start gap-3">
                <button className="button" title="Instagram"><FaInstagram /></button>
                <button className="button" title="WhatsApp"><FaWhatsapp /></button>
                <button className="button" title="X"><FaXTwitter /></button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="form-wrapper container flex-1 max-w-[500px]">
            <h2 className="heading">{isEnglish ? "Contact Us" : "تواصل معنا"}</h2>

            <form className="form" ref={formRef} onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder={isEnglish ? "Name" : "الاسم"} className="input" />
              <input type="email" name="email" placeholder={isEnglish ? "Email" : "البريد الإلكتروني"} className="input" />
              <input type="text" name="subject" placeholder={isEnglish ? "Subject" : "الموضوع"} className="input" />
              <textarea name="message" placeholder={isEnglish ? "Message" : "الرسالة"} className="input" style={{ height: "120px", resize: "none" }}></textarea>

              <button type="submit" className="login-button">
                {isEnglish ? "Send Message" : "إرسال الرسالة"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .heading {
          text-align: center;
          font-weight: 900;
          font-size: 28px;
          color: #2F4156;
          margin-bottom: 10px;
        }

        .input {
          width: 100%;
          background: white;
          border: none;
          padding: 15px 20px;
          border-radius: 20px;
          margin-top: 15px;
          box-shadow: #cff0ff 0px 10px 10px -5px;
          border-inline: 2px solid transparent;
          transition: border 0.3s ease;
        }

        .input:focus {
          outline: none;
          border-inline: 2px solid #567C8D;
        }

        .login-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 180px;
          height: 42px;
          margin: 20px auto 0;
          background-color: #567C8D;
          color: white;
          border-radius: 20px;
          border: none;
          font-weight: 600;
          font-size: 15px;
          box-shadow: rgba(133, 189, 215, 0.3) 0px 8px 12px -5px;
          transition: transform 0.2s ease-in-out;
        }

        .login-button:hover {
          transform: scale(1.03);
        }

        .icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .button {
          cursor: pointer;
          width: 50px;
          height: 50px;
          border-radius: 50px;
          border: none;
          background: linear-gradient(120deg, #833ab4, #fd1d1d, #fcb045);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .button svg {
          color: white;
          width: 30px;
          height: 30px;
        }

        .button:nth-child(2) {
          background: linear-gradient(120deg, #02ff2c, #008a12);
        }

        .button:nth-child(3) {
          background: black;
        }

        @media (max-width: 768px) {
          .container {
            margin: 0 auto;
          }
        }
      `}</style>
    </>
  );
}


