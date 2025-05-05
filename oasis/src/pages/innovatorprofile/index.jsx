import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Globe, Edit, Star, X, Phone, Linkedin, MessageSquare, UserPlus, Camera, Check } from 'lucide-react';
import { Img, Heading, Text } from "../../components";
import { Link } from "react-router-dom";
import Sidebar3 from "../../components/Sidebar3";

const translations = {
  en: {
    title: "Innovator Profile - Explore Creative Solutions"
  },
  ar: {
    title: "ملف المحكم - منصة تقييم المشاريع"
  }
};

const EditableHeader = ({ defaultTitle = "Innovation Oasis", ...props }) => {
  return (
    <header {...props} className="relative w-full bg-gray-50_01">
      <div className="relative h-[98px] w-full">
        <Heading
          size="text7xl"
          as="p"
          className="absolute bottom-[27px] left-[14%] m-auto text-[22.47px] font-medium !text-blue_gray-800"
        >
        </Heading>
        
        <Img
          src="images/img_rectangle_6717.png"
          alt="Image"
          className="absolute bottom-0 right-px m-auto h-[30px] w-[95%] rounded-tl-md rounded-tr-md object-contain"
        />
        
        <div className="absolute left-0 top-0 m-auto h-[92px] w-[10%] content-center md:h-auto">
          <Img
            src="images/img_img_4360_1.png"
            alt="Img4360one"
            className="h-[92px] w-full flex-1 rounded-[32px] object-cover"
          />
          <Heading
            size="headingxl"
            as="p"
            className="absolute bottom-[0.50px] left-10 m-auto text-[13px] font-bold !text-blue_gray-500_02"
          >
            Innovation Oasis
          </Heading>
        </div>
      </div>
      
      <div className="absolute top-0 right-6 flex items-center gap-4 p-5">
        <div className="flex items-center gap-2 text-gray-600">
          <Globe size={18} />
          <span>English</span>
        </div>
        
        <form className="form relative">
          <button className="absolute left-2 -translate-y-1/2 top-1/2 p-1">
            <svg
              width="17"                       
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-labelledby="search"
              className="w-5 h-5 text-gray-700"
            >
              <path
                d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                stroke="currentColor"
                strokeWidth="1.333"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
          <input
            className="input rounded-full px-8 py-2 border-2 border-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md"
            placeholder="Search..."
            required=""
            type="text"
          />
          <button type="reset" className="absolute right-3 -translate-y-1/2 top-1/2 p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </form>
        
        <Link to="/page28" className="mr-2">
          <button className="p-1.5 rounded-full hover:bg-gray-100">
            <Bell size={20} className="text-gray-600" />
          </button>
        </Link>
      </div>
    </header>
  );
};

const ProfilePhotoEditor = ({ currentPhoto, onPhotoChange }) => {
  const fileInputRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      className="relative"
      whileHover={{ scale: 1.05 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img
        src={currentPhoto}
        alt="Profile"
        className="h-[70px] w-[70px] rounded-full border-3 border-white shadow-lg object-cover"
      />
      
      <motion.div 
        className={`absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => fileInputRef.current.click()}
      >
        <Camera size={24} className="text-white" /> 
      </motion.div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </motion.div>
  );
};

const CoverPhotoEditor = ({ currentPhoto, onPhotoChange }) => {
  const fileInputRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className="relative h-[80px] w-full" 
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img
        src={currentPhoto}
        alt="Cover"
        className="w-full h-full object-cover"
      />
      
      <motion.div 
        className={`absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => fileInputRef.current.click()}
      >
        <div className="bg-white p-2 rounded-full shadow-lg"> 
          <Camera size={18} className="text-gray-700" /> 
        </div>
        <span className="absolute bottom-2 text-white font-medium text-xs">Click to change cover photo</span> 
      </motion.div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
};

const EditableText = ({ value, onChange, isHeading = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(text);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-start gap-2 w-full">
        {isHeading ? (
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border-b-2 border-blue-500 bg-transparent text-xl font-bold focus:outline-none px-1 w-full" /* Reduced from text-2xl to text-xl */
          />
        ) : (
           <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border-2 border-blue-500 rounded text-sm p-2 w-full resize-y min-h-[100px]"
            rows={4}
          />
        )}
        <motion.button
          onClick={handleSave}
          className="bg-blue-500 text-white p-1.5 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Check size={isHeading ? 16 : 18} />
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 group w-full">
      {isHeading ? (
        <h2 className="text-2xl font-bold">{text}</h2>
      ) : (
        <p className="text-sm text-right w-full pr-1">{text}</p>
      )}
      <motion.button
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-full"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Edit size={isHeading ? 16 : 18} className="text-gray-600" />
      </motion.button>
    </div>
  );
};

function ProfileSection() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [inputState, setInputState] = useState({ type: null, mode: null, index: null, value: "" });
  
  const [profilePhoto, setProfilePhoto] = useState("images/img_test_account_90x90.png");
  const [coverPhoto, setCoverPhoto] = useState("https://www.hipi.info/wp-content/uploads/2013/01/Twitter-Header-Grey02.jpg");
  
  const [name, setName] = useState("Prof Sarah");
  const [bio, setBio] = useState("محكم ذو خبرة في تقييم المشاريع باستخدام تقنيات الذكاء الاصطناعي لتحليل البيانات وتقديم رؤى دقيقة ومبنية على أسس علمية. أمتلك خبرة في تطوير حلول مبتكرة تعتمد على الذكاء الاصطناعي، وأسعى لدعم المشاريع الناشئة وتعزيز جودة الأداء من خلال تطبيق معايير تقييم متقدمة وعادلة");

  const handleAdd = () => {
    if (inputState.value.trim()) {
      const updater = (setFn, prev) => setFn([...prev, inputState.value]);
      if (inputState.type === "projects") updater(setProjects, projects);
      if (inputState.type === "skills") updater(setSkills, skills);
      if (inputState.type === "experiences") updater(setExperiences, experiences);
      if (inputState.type === "certificates") updater(setCertificates, certificates);
      setInputState({ type: null, mode: null, index: null, value: "" });
    }
  };

  const handleEdit = () => {
    if (inputState.value.trim()) {
      const editItem = (setFn, items) => {
        const updated = [...items];
        updated[inputState.index] = inputState.value;
        setFn(updated);
      };
      if (inputState.type === "projects") editItem(setProjects, projects);
      if (inputState.type === "skills") editItem(setSkills, skills);
      if (inputState.type === "experiences") editItem(setExperiences, experiences);
      if (inputState.type === "certificates") editItem(setCertificates, certificates);
      setInputState({ type: null, mode: null, index: null, value: "" });
    }
  };

  const handleDelete = (index, type) => {
    const deleteItem = (setFn, items) => {
      const updated = [...items];
      updated.splice(index, 1);
      setFn(updated);
    };
    if (type === "projects") deleteItem(setProjects, projects);
    if (type === "skills") deleteItem(setSkills, skills);
    if (type === "experiences") deleteItem(setExperiences, experiences);
    if (type === "certificates") deleteItem(setCertificates, certificates);
  };

  const renderBox = (title, items, setItems, type, iconSrc) => (
    <div className="flex flex-col gap-0.5 bg-gradient7 p-3 rounded-md w-[400px] h-[100px] overflow-y-auto text-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <Img src="images/img_edit.png" alt="Edit" className="h-[16px] w-[16px] cursor-pointer" onClick={() => setInputState({ type, mode: "edit", index: 0, value: items[0] })} />
          <Img src="images/img_plus_math.png" alt="Add" className="h-[16px] w-[16px] cursor-pointer" onClick={() => setInputState({ type, mode: "add", index: null, value: "" })} />
        </div>
        <div className="flex items-center gap-2">
          <Heading size="heading5xl" as="h5" className="text-sm font-bold">{title}</Heading>
          <Img src={iconSrc} alt="icon" className="h-[16px] w-[16px]" />
        </div>
      </div>
      <div className="overflow-y-auto max-h-[50px] scrollbar-thin scrollbar-thumb-gray-300">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center py-1">
            <Text as="p" className="text-xs">{item}</Text>
            <button
              onClick={() => handleDelete(i, type)}
              className="text-red-500 text-xs px-1 py-0.5 rounded hover:bg-red-100"
            >
              حذف
            </button>
          </div>
        ))}
      </div>
      {inputState.type === type && (
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            value={inputState.value}
            onChange={(e) => setInputState({ ...inputState, value: e.target.value })}
            placeholder="اكتب هنا"
            className="border rounded px-2 py-1 text-xs w-full"
          />
          <button
            onClick={inputState.mode === "add" ? handleAdd : handleEdit}
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
          >
            حفظ
          </button>
        </div>
      )}
    </div>
  );  const socialLinks = {
    linkedin: "https://www.linkedin.com",
    twitter: "https://twitter.com",
    website: "https://example.com"
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <CoverPhotoEditor 
          currentPhoto={coverPhoto} 
          onPhotoChange={setCoverPhoto} 
        />
        
        <div className="relative px-4 pb-3"> 
          <div className="absolute left-6 -top-10"> 
         
            <ProfilePhotoEditor 
              currentPhoto={profilePhoto}
              onPhotoChange={setProfilePhoto}
            />
          </div>
          
          <div className="pt-8"> 
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-0 w-full"> 
                <div className="flex items-center mt-1">
                  <EditableText 
                    value={name}
                    onChange={setName}
                    isHeading={true}
                  />
                  
                  <div className="flex items-center ml-3">
                    <span className="text-base font-semibold text-gray-700">4.5</span>
                    <Star className="h-4 w-4 text-yellow-400 ml-1 fill-current" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex flex-col gap-0.5">
          <div className="mb-1 flex items-end justify-end md:flex-col md:self-stretch md:px-5">
            <div className="mt-3 flex w-[58%] justify-center bg-gray-100 px-2.5 py-4 shadow-md md:w-full">
              <EditableText 
                value={bio}
                onChange={setBio}
              />
            </div>
            <Heading 
              size="heading5xl" 
              as="h2" 
              className="mb-5 ml-[26px] text-[18px] font-thin md:ml-0"
            >
              نبذه عني:
            </Heading>
          </div>
          
          <div className="flex items-start justify-center mt-6 px-8">
  <div className="grid grid-cols-2 gap-x-12 gap-y-6 max-w-5xl mx-auto">
    {renderBox("المشاريع", projects, setProjects, "projects", "images/img_flipboard.png")}
    {renderBox("المهارات", skills, setSkills, "skills", "images/img_resume.png")}
    {renderBox("الخبرات", experiences, setExperiences, "experiences", "images/img_front_desk.png")}
    {renderBox("الشهادات", certificates, setCertificates, "certificates", "images/img_internship.png")}
  </div>
</div>

          <motion.div 
            className="flex justify-center mt-6 gap-6 py-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            {[
              { icon: X, label: "Twitter", href: socialLinks.twitter },
              { icon: Phone, label: "Phone", href: "#" },
              { icon: MessageSquare, label: "Message", href: "#" },
              { icon: Linkedin, label: "LinkedIn", href: socialLinks.linkedin }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.a
                  href={item.href}
                  key={item.label}
                  className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={24} className="text-gray-600" />
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default function InnovatorProfile() {
  const [language, setLanguage] = useState("ar"); 

  return (
    <>
      <Helmet>
        <title>{translations[language].title}</title>
        <meta
          name="description"
          content="تعرف على خبرات المحكم في تقييم المشاريع الابتكارية باستخدام الذكاء الاصطناعي. ملف المحكم يوضح تقييماته ودعمه للمشاريع الناشئة."
        />
      </Helmet>

      <div className="bg-gray-100 min-h-screen">
        <EditableHeader defaultTitle="Innovation Oasis" />

        <div className="flex">
          <div className="fixed left-0 top-[98px] h-full">
            <Sidebar3 className="z-10" />
          </div>
          
          <div className="w-full ml-16 py-6 px-8">
            <ProfileSection />
          </div>
        </div>
      </div>
    </>
  );
}
