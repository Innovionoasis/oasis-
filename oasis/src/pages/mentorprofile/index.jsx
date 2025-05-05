import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Star, X, Phone, Linkedin, MessageSquare, UserPlus, Camera, Check, Globe } from 'lucide-react';
import { Img, Heading, Text } from "../../components";
import { Link } from "react-router-dom";
import Sidebar2 from "../../components/Sidebar2";
import axios from "axios";

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
            {defaultTitle}
          </Heading>
        </div>
      </div>
      
      <div className="absolute top-0 right-6 flex items-center gap-4 p-5">
        <div className="flex items-center gap-2 text-gray-600">
          <Globe size={18} />
          <span>English</span>
        </div>
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
            className="border-b-2 border-blue-500 bg-transparent text-xl font-bold focus:outline-none px-1 w-full"
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
  const [reviewedProjects, setReviewedProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [certificates, setCertificates] = useState([]);
  
  const [profilePhoto, setProfilePhoto] = useState("images/img_test_account_90x90.png"); 
  const [coverPhoto, setCoverPhoto] = useState("https://www.hipi.info/wp-content/uploads/2013/01/Twitter-Header-Grey02.jpg"); 
  const [name, setName] = useState("User Name");
  const [bio, setBio] = useState("");
  
  const userId = 3;

  useEffect(() => {
    axios.get(`/api/profile/${userId}`)
      .then((res) => {
        console.log("Profile data:", res.data);
        if (res.data.basic) {
          setName(res.data.basic.username || "اسم المستخدم");
        }
        if (res.data.profile) {
          setBio(res.data.profile.bio || "");
          setProfilePhoto(res.data.profile.profile_picture || "images/img_test_account_90x90.png");
          setCoverPhoto(res.data.profile.cover_photo || "https://www.hipi.info/wp-content/uploads/2013/01/Twitter-Header-Grey02.jpg");
          setProjects(res.data.profile.projects || []);
          setSkills(res.data.profile.skills || []);
          setExperiences(res.data.profile.experiences || []);
          setCertificates(res.data.profile.certificates || []);
        }
        if (res.data.reviewedProjects){
          setReviewedProjects(res.data.reviewedProjects);
        }
      })
      .catch((err) => {
        console.error("Error loading profile data:", err);
      });
  }, [userId]);
  
  const [inputState, setInputState] = useState({ type: null, mode: null, index: null, value: "" });

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

  const handleLoadMoreReviewedProjects = () => {
    axios.get(`/api/reviewed-projects?userId=${userId}`)
      .then(res => setReviewedProjects(prev => [...prev, ...res.data]))
      .catch(err => console.error("Error loading more projects:", err));
  };

  const renderInput = () => (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        value={inputState.value}
        onChange={(e) => setInputState({ ...inputState, value: e.target.value })}
        placeholder="اكتب هنا"
        className="border rounded px-2 py-1 text-sm w-full"
      />
      <button
        onClick={inputState.mode === "add" ? handleAdd : handleEdit}
        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
      >
        حفظ
      </button>
    </div>
  );

  const renderBox = (title, items, setItems, type, iconSrc) => (
    <div className="flex flex-col gap-2 bg-gradient7 p-4 rounded-md w-full h-[140px] overflow-y-auto text-xs">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {items.length > 0 && (
            <Img 
              src="images/img_edit.png" 
              alt="Edit" 
              className="h-[20px] cursor-pointer" 
              onClick={() => setInputState({ type, mode: "edit", index: 0, value: items[0] })} 
            />
          )}
          <Img 
            src="images/img_plus_math.png" 
            alt="Add" 
            className="h-[20px] cursor-pointer" 
            onClick={() => setInputState({ type, mode: "add", index: null, value: "" })} 
          />
        </div>
        <div className="flex items-center gap-1">
          <Heading size="heading5xl" as="h5" className="text-[14px] font-bold">{title}</Heading>
          <Img src={iconSrc} alt="icon" className="h-[20px]" />
        </div>
      </div>
      
      {items.length === 0 && !inputState.type && (
        <div className="flex justify-center items-center h-16 text-gray-400 text-xs italic">
          اضغط على + لإضافة {title}
        </div>
      )}
      
      {items.map((item, i) => (
        <div key={i} className="flex justify-between items-center">
          <Text as="p" className="text-xs">{item}</Text>
          <button
            onClick={() => handleDelete(i, type)}
            className="text-red-500 text-[10px] px-1 py-0.5 rounded hover:bg-red-100"
          >
            حذف
          </button>
        </div>
      ))}
      {inputState.type === type && renderInput()}
    </div>
  );

  const socialLinks = {
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
      
      <div className="mt-4 w-full">
        <div className="flex flex-col gap-0.5 w-full">
          <div className="mb-1 flex items-end justify-end w-full md:flex-col md:self-stretch md:px-5">
            <div className="mt-3 flex w-full justify-center bg-gray-100 px-2.5 py-4 shadow-md">
              <EditableText 
                value={bio}
                onChange={setBio}
              />
            </div>
            <Heading 
              size="heading5xl" 
              as="h2" 
              className="mb-5 ml-[36px] text-[18px] font-thin md:ml-0"
            >
              نبذه عني:
            </Heading>
          </div>

          <div className="flex items-start justify-between mt-6 px-8 w-full">
            <div className="flex w-[25%] flex-col items-start gap-[10px]">
              <Heading size="heading5xl" as="h1" className="text-[16px] font-bold">المشاريع تم الاشراف عليها </Heading>
              <div className="flex flex-col gap-2 h-[180px] overflow-y-auto w-full pr-1">
                {reviewedProjects.length > 0 ? (
                  reviewedProjects.map((p, i) => (
                    <div key={i} className="bg-gradient-to-r from-gray-100 to-gray-300 rounded-full shadow px-3 py-1 text-xs font-bold text-gray-700">
                      {p}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-xs italic">لا توجد مشاريع</div>
                )}
              </div>
              <button onClick={handleLoadMoreReviewedProjects} className="mt-2 text-xs font-bold bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">عرض المزيد</button>
            </div>

            <div className="grid grid-cols-2 gap-4 w-[70%]">
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
            ].map((item) => {
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

export default function Page21Page() {
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

      <div className="bg-gray-100 min-h-screen w-full">
        <EditableHeader defaultTitle="Innovation Oasis" />

        <div className="flex w-full">
          <div className="flex">
            <Sidebar2 />
          </div>
          
          <div className="w-full bg-white min-h-screen ml-16 pt-4">
            <div className="px-4">
              <ProfileSection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}