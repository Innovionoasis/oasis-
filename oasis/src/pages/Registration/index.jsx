import React, { useState } from "react";
import { Helmet } from "react-helmet";
import RegistrationContainer from "./RegistrationContainer";
import OTPVerification from "./OTPVerification";

export default function RegistrationPage() {
  const [currentPage, setCurrentPage] = useState("registration");
  const [verificationData, setVerificationData] = useState(null);

  const handlePageChange = (page, data = null) => {
    setCurrentPage(page);
    if (data) setVerificationData(data);
  };

  return (
    <>
      <Helmet>
        <title>
          {currentPage === "registration"
            ? "التسجيل - انضم الآن"
            : "التحقق من الحساب"}
        </title>
        <meta
          name="description"
          content={
            currentPage === "registration"
              ? "أدخل بياناتك الأساسية للانضمام إلى منصتنا."
              : "قم بإدخال رمز التحقق لتفعيل حسابك."
          }
        />
      </Helmet>

      <div className="flex w-full flex-col gap-3 bg-gray-50_91 py-[22px] sm:py-5">
        {currentPage === "registration" ? (
          <RegistrationContainer 
            onPageChange={handlePageChange} 
            verificationData={verificationData}
          />
        ) : (
          <OTPVerification 
            {...verificationData} 
            onBack={() => handlePageChange("registration")}
          />
        )}
      </div>
    </>
  );
}

