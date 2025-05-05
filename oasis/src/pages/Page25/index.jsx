import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Text, Img, Button, Input, Heading } from "../../components";
import Sidebar3 from "../../components/Sidebar3";
import Header from "../../components/Header";

const SelectBox = ({ options, value, onChange, shape, className, indicator, placeholder, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={`relative w-full ${className}`}>
      <div 
        className={`flex items-center justify-between h-12 ${disabled ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer'} ${shape === "round" ? "rounded-lg" : ""} border border-gray-300 bg-gray-50_01 px-4 py-2`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div>{value ? options.find(opt => opt.value === value)?.label : placeholder || "Select option"}</div>
        {!disabled && (indicator || <span>▼</span>)}
      </div>
      
      {isOpen && !disabled && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          {options.map((option) => (
            <li 
              key={option.value} 
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function ProfileSettingsPage() {
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "Sarah",
    gender: "female",
    age: "28",
    language: "arabic",
    country: "saudi",
    phone: "512345678",
    phone_code: "saudi",
    email: "sarah@gmail.com",
  });
  
  const fileInputRef = useRef(null);
  useEffect(() => {
    fetch('http://localhost:4000/api/innovator/23')
      .then(res => res.json())
      .then(data => {
        setFormData({
          name: data.name || '',
          gender: data.gender || '',
          age: data.age || '',
          language: data.language || '',
          country: data.country || '',
          phone: data.phone || '',
          phone_code: data.phone_code || '',
          email: data.email || '',
        });
        setEmails(data.additional_emails || []);
      });
  }, []);
  
  const [emails, setEmails] = useState(["sarah@gmail.com"]);
  const [newEmail, setNewEmail] = useState("");
  const [showAddEmailForm, setShowAddEmailForm] = useState(false);

  const genderOptions = [
    { label: "ذكر", value: "male" },
    { label: "أنثى", value: "female" },
    { label: "غير ذلك", value: "other" },
  ];

  const languageOptions = [
    { label: "العربية", value: "arabic" },
    { label: "English", value: "english" },
    { label: "Français", value: "french" },
  ];

  const countryOptions = [
    { label: "المملكة العربية السعودية", value: "saudi" },
    { label: "الإمارات العربية المتحدة", value: "uae" },
    { label: "مصر", value: "egypt" },
    { label: "الأردن", value: "jordan" },
  ];

  const phoneOptions = [
    { label: "+966", value: "saudi" },
    { label: "+971", value: "uae" },
    { label: "+20", value: "egypt" },
    { label: "+962", value: "jordan" },
  ];

  const toggleEditMode = () => {
    if (editMode) {
      saveChanges();
    }
    setEditMode(!editMode);
  };
  
  const saveChanges = () => {
    const payload = {
      user_id: 5, 
      user_type: "innovator", 
      name: formData.name,
      gender: formData.gender,
      age: formData.age,
      language: formData.language,
      country: formData.country,
      phone_code: formData.phone_code,
      phone: formData.phone,
      email: formData.email,
      additional_emails: emails || [], 
    };
  
    console.log("🚀 Sending payload:", JSON.stringify(payload, null, 2));
  
    fetch("http://localhost:4000/api/user_settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(data => {
            throw new Error(data.error || `HTTP error! Status: ${res.status}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          alert("تم حفظ البيانات بنجاح!");
          setEditMode(false);
        }
      })
      .catch(error => {
        console.error("Error saving settings:", error);
      });
  };
  
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddEmail = () => {
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setNewEmail("");
      setShowAddEmailForm(false);
    }
  };

  const inputClasses = "h-12 self-stretch rounded-lg px-4";
  const labelClasses = "text-base font-normal !text-black-900_cc";
  const formGroupClasses = "mb-6 flex flex-col items-start gap-3 self-stretch";

  return (
    <>
      <Helmet>
        <title>User Profile Settings - Innovation Oasis</title>
        <meta
          name="description"
          content="Customize your Innovation Oasis profile settings. Update personal information and add email addresses."
        />
      </Helmet>
      <div className="w-full bg-white-a700_dd">
        <div className="flex items-start gap-9 bg-gray-50_01">
          <Sidebar3 />
          
          <div className="flex flex-1 flex-col gap-9">
            <Header />
            
            <div className="relative h-auto md:h-auto">
              <div className="flex-1">
                <div className="relative z-[1] mr-10 h-24 rounded-tl-lg rounded-tr-lg bg-[url(/public/images/img_group_383.png)] bg-cover bg-no-repeat md:mr-0 md:h-auto">
                  <Img
                    src="images/img_group_383.png"
                    alt="Banner"
                    className="h-24 w-full rounded-tl-lg rounded-tr-lg object-cover md:h-auto"
                  />
                </div>
                
                <div className="relative mr-10 mt-[-62px] rounded-lg bg-w_background md:mr-0">
                  <div className="mt-24 flex flex-col gap-[52px] sm:gap-6">
                    <div className="mx-8 flex items-center justify-between md:mx-4 md:flex-col">
                      <div className="flex items-center gap-6 md:self-stretch md:px-5">
                        <div className="relative h-20 w-20">
                          <Img
                            src="images/img_woman_profile.png"
                            alt="Profile"
                            className="h-full w-full rounded-full object-cover border border-solid border-black-900"
                          />
                        </div>
                        <div className="flex flex-col items-start gap-1.5">
                          <Text as="p" className="text-xl font-medium">
                            {formData.name}
                          </Text>
                          <Text size="text4xl" as="p" className="text-base font-normal !text-black-900_7f">
                            {formData.email}
                          </Text>
                        </div>
                      </div>
                      <Button
                        color={editMode ? "blue_gray_500" : "blue_gray_500"}
                        size="4xl"
                        shape="round"
                        className="min-w-[92px] rounded-lg font-poppins"
                        onClick={toggleEditMode}
                      >
                        {editMode ? "حفظ" : "تعديل"}
                      </Button>
                    </div>
                    
                    <div className="mx-8 text-right">
                      <Text size="text3xl" as="p" className="font-kanit text-base font-normal">
                      </Text>
                    </div>
                    
                    <div className="mx-8 flex items-start gap-8 md:flex-col">
                      <div className="w-1/2 md:w-full md:px-5">
                        <div className="flex flex-col items-start">
                          <div className={formGroupClasses}>
                            <Text size="text4xl" as="p" className={labelClasses}>
                              الاسم
                            </Text>
                            <Input
                              color="gray_50_01"
                              name="name"
                              value={formData.name}
                              onChange={(e) => handleInputChange("name", e.target.value)}
                              className={`${inputClasses} ${!editMode ? 'bg-gray-100' : ''}`}
                              disabled={!editMode}
                            />
                          </div>
                          
                          <div className={formGroupClasses}>
                            <Text size="text4xl" as="p" className={labelClasses}>
                              الجنس
                            </Text>
                            <SelectBox
                              shape="round"
                              indicator={<Img src="images/img_checkmark.svg" alt="Checkmark" className="h-6 w-6" />}
                              options={genderOptions}
                              value={formData.gender}
                              onChange={(value) => handleInputChange("gender", value)}
                              className="gap-4 self-stretch rounded-lg"
                              placeholder="اختر الجنس"
                              disabled={!editMode}
                            />
                          </div>
                          
                          <div className={formGroupClasses}>
                            <Text size="text4xl" as="p" className={labelClasses}>
                              اللغة
                            </Text>
                            <SelectBox
                              shape="round"
                              indicator={<Img src="images/img_checkmark.svg" alt="Checkmark" className="h-6 w-6" />}
                              options={languageOptions}
                              value={formData.language}
                              onChange={(value) => handleInputChange("language", value)}
                              className="gap-4 self-stretch rounded-lg"
                              placeholder="اختر اللغة"
                              disabled={!editMode}
                            />
                          </div>
                          
                          <Heading size="text5xl" as="h1" className="mt-8 mb-5 text-lg font-medium">
                            البريد الالكتروني
                          </Heading>
                          
                          {emails.map((email, index) => (
                            <div key={index} className="mb-4 flex items-center gap-5 self-stretch">
                              <Button
                                color="blue_A200_19"
                                size="7xl"
                                shape="circle"
                                className="w-12 h-12 rounded-full px-3"
                              >
                                <Img src="images/img_checkmark_blue_a200.svg" />
                              </Button>
                              <Text size="text4xl" as="p" className="text-base font-normal">
                                {email}
                              </Text>
                            </div>
                          ))}
                          
                          {editMode && (
                            <>
                              {showAddEmailForm ? (
                                <div className="mt-4 flex w-full flex-col gap-4">
                                  <Input
                                    color="gray_50_01"
                                    name="newEmail"
                                    placeholder="أدخل البريد الإلكتروني الجديد"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className={`${inputClasses}`}
                                  />
                                  <div className="flex gap-4">
                                    <Button
                                      color="blue_A200_19"
                                      size="4xl"
                                      shape="round"
                                      className="min-w-[100px] h-12 rounded-lg font-poppins"
                                      onClick={handleAddEmail}
                                    >
                                      إضافة
                                    </Button>
                                    <Button
                                      color="gray_50_01"
                                      size="4xl"
                                      shape="round"
                                      className="min-w-[100px] h-12 rounded-lg font-poppins"
                                      onClick={() => setShowAddEmailForm(false)}
                                    >
                                      إلغاء
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <Button
                                  color="blue_A200_19"
                                  size="4xl"
                                  shape="round"
                                  className="mt-6 min-w-[208px] h-12 rounded-lg font-poppins"
                                  onClick={() => setShowAddEmailForm(true)}
                                >
                                  +اضافة بريد الكتروني
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="w-1/2 md:w-full md:px-5">
                        <div className="flex flex-col gap-8">
                          <div className="flex flex-col items-start gap-3">
                            <Text size="text4xl" as="p" className={labelClasses}>
                              العمر
                            </Text>
                            <Input
                              color="gray_50_01"
                              name="age"
                              type="number"
                              value={formData.age}
                              onChange={(e) => handleInputChange("age", e.target.value)}
                              className={`${inputClasses} ${!editMode ? 'bg-gray-100' : ''}`}
                              disabled={!editMode}
                            />
                          </div>
                          
                          <div className="flex flex-col items-start gap-3">
                            <Text size="text4xl" as="p" className={labelClasses}>
                              البلد
                            </Text>
                            <SelectBox
                              shape="round"
                              indicator={<Img src="images/img_checkmark.svg" alt="Checkmark" className="h-6 w-6" />}
                              options={countryOptions}
                              value={formData.country}
                              onChange={(value) => handleInputChange("country", value)}
                              className="gap-4 self-stretch rounded-lg"
                              placeholder="اختر البلد"
                              disabled={!editMode}
                            />
                          </div>
                          
                          <div className="flex flex-col items-start gap-3">
                            <Text size="text4xl" as="p" className={labelClasses}>
                              رقم الهاتف
                            </Text>
                            <div className="flex w-full gap-4">
                              <SelectBox
                                shape="round"
                                indicator={<Img src="images/img_checkmark.svg" alt="Checkmark" className="h-6 w-6" />}
                                options={phoneOptions}
                                value={formData.phone_code}
                                onChange={(value) => handleInputChange("phone_code", value)}
                                className="w-1/4 gap-4 rounded-lg"
                                placeholder="+966"
                                disabled={!editMode}
                              />
                              <Input
                                color="gray_50_01"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                className={`w-3/4 ${inputClasses} ${!editMode ? 'bg-gray-100' : ''}`}
                                placeholder="5XXXXXXXX"
                                disabled={!editMode}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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