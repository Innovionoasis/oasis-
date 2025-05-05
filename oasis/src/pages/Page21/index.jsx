import { useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { Img, Heading, Text } from "../../components";
import Sidebar26 from "../../components/Sidebar8";
import Header from "../../components/Header";
import { Camera, Linkedin, X, Phone, MessageSquare, Trash2, Pencil } from "lucide-react";

const CoverAndProfile = ({ coverPhoto, setCoverPhoto, profilePhoto, setProfilePhoto }) => {
  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const handleImageChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result);
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="relative">
      <div
  className="h-[120px] w-full bg-gray-300 rounded-t-xl bg-cover bg-center cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
  style={{ backgroundImage: `url(${coverPhoto})` }}
  onClick={() => coverInputRef.current.click()}
   />
     <input
        type="file"
        ref={coverInputRef}
        onChange={(e) => handleImageChange(e, setCoverPhoto)}
        accept="image/*"
        className="hidden"
      />

      <div
        className="absolute left-6 bottom-[-45px] w-[90px] h-[90px] rounded-full border-4 border-white bg-gray-200 shadow-lg overflow-hidden cursor-pointer"
        onClick={() => profileInputRef.current.click()}
      >
        <img
          src={profilePhoto}
          alt="Profile"
          className="w-full h-full object-cover"
        />
        <input
          type="file"
          ref={profileInputRef}
          onChange={(e) => handleImageChange(e, setProfilePhoto)}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
};

const EditableBox = ({ title, items, setItems, iconSrc }) => {
  const [newItem, setNewItem] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [showInput, setShowInput] = useState(false);

  const handleAdd = () => {
    if (newItem.trim()) {
      if (editIndex !== null) {
        const updated = [...items];
        updated[editIndex] = newItem;
        setItems(updated);
        setEditIndex(null);
      } else {
        setItems([...items, newItem]);
      }
      setNewItem("");
      setShowInput(false);
    }
  };

  const handleDelete = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    if (editIndex === index || updated.length === 0) {
      setEditIndex(null);
      setShowInput(false);
      setNewItem("");
    }
  };

  const handleEdit = (index) => {
    setNewItem(items[index]);
    setEditIndex(index);
    setShowInput(true);
  };

  const handleNewClick = () => {
    setNewItem("");
    setEditIndex(null);
    setShowInput(true);
  };

  return (
    <div className="flex flex-col gap-2 bg-gradient7 p-4 rounded-md w-full h-[180px] overflow-y-auto text-xs">
      <div className="flex items-center justify-between">
        <Heading size="heading5xl" as="h5" className="text-[14px] font-bold">{title}</Heading>
        <div className="flex items-center gap-2">
          <Img src={iconSrc} alt="icon" className="h-[20px]" />
          <Pencil size={14} className="cursor-pointer text-black" onClick={() => items.length > 0 && handleEdit(0)} />
          <span onClick={handleNewClick} className="text-lg font-bold text-green-700 cursor-pointer">+</span>
          {items.length > 0 && (
            <Trash2 size={14} className="cursor-pointer text-red-500" onClick={() => handleDelete(0)} />
          )}
        </div>
      </div>
      {items.map((item, i) => (
        <div key={i} className="bg-white/20 rounded px-2 py-1">
          <Text as="p" className="truncate">{item}</Text>
        </div>
      ))}
      {showInput && (
        <div className="flex mt-2 gap-1">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="flex-1 border rounded px-2 py-1 text-xs"
            placeholder={`أدخل ${title}`}
          />
          <button onClick={handleAdd} className="bg-blue-600 text-white text-xs rounded px-3">حفظ</button>
        </div>
      )}
    </div>
  );
};


export default function Page21Page() {
  const [coverPhoto, setCoverPhoto] = useState("https://via.placeholder.com/800x200");
  const [profilePhoto, setProfilePhoto] = useState("images/img_test_account_90x90.png");
  const [reviewedProjects, setReviewedProjects] = useState([
    "مشروع دعم أدوات الذكاء..", "مشروع دعم أدوات الذكاء..", "مشروع دعم أدوات الذكاء..", "مشروع جديد", "تحليل البيانات"
  ]);
  const [projects, setProjects] = useState(["مشروعي الأول"]);
  const [skills, setSkills] = useState(["تحليل البيانات"]);
  const [experiences, setExperiences] = useState(["  "]);
  const [certificates, setCertificates] = useState(["شهادة الذكاء الاصطناعي"]);

  const [bio, setBio] = useState(
    "CDMP |Data Scientist | AI & ML Expert |Data Analyst |Statistician |Power BI Specialist General Authority For StatisticsKing Saud University Riyadh Region"
  );
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [showMoreReviewed, setShowMoreReviewed] = useState(false);
  const reviewedContainerRef = useRef(null);

  const socialLinks = {
    linkedin: "https://www.linkedin.com",
    twitter: "https://twitter.com",
    website: "https://example.com",
  };

  const handleShowMore = () => {
    setShowMoreReviewed(true);
    setTimeout(() => {
      reviewedContainerRef.current?.scrollTo({
        top: reviewedContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <>
      <Helmet>
        <title>ملف المحكم - منصة تقييم المشاريع</title>
      </Helmet>

      <div className="flex w-full items-start bg-w_background">
        <Sidebar26 />
        <div className="flex flex-1 flex-col">
          <Header />
          <div className="mt-6 px-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full">
              <CoverAndProfile
                coverPhoto={coverPhoto}
                setCoverPhoto={setCoverPhoto}
                profilePhoto={profilePhoto}
                setProfilePhoto={setProfilePhoto}
              />
              <div className="pt-12 px-6">
                <div className="flex justify-between items-center">
                  <div>
                    <Heading size="heading3xl" as="h2" className="font-bold">prof Sarah</Heading>
                    <Heading size="heading5xl" as="h4" className="text-gray-500">AI</Heading>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heading size="heading5xl" as="h5" className="text-[18px] font-bold">4.5</Heading>
                    <Img src="images/img_star_34x32.png" alt="Rating" className="h-[24px] object-cover" />
                  </div>
                </div>

                <div className="mt-4 relative">
                  <div className="flex items-center justify-between mb-2">
                    {!isEditingBio && (
                      <div className="flex items-center gap-2">
                        <Pencil size={14} className="cursor-pointer text-gray-600" onClick={() => setIsEditingBio(true)} />
                      </div>
                    )}
                  </div>

                  {!isEditingBio ? (
                    <Text as="p" className="text-sm text-gray-700 leading-relaxed font-medium">
                      {bio}
                    </Text>
                  ) : (
                    <div className="flex flex-col gap-2 mt-2">
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full h-[120px] rounded border border-gray-300 p-2 text-sm"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setIsEditingBio(false)} className="text-white bg-blue-600 px-3 py-1 text-xs rounded">
                          حفظ
                        </button>
                        <button onClick={() => setIsEditingBio(false)} className="text-gray-600 text-xs">
                          إلغاء
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-start justify-between mt-6">
                  <div className="flex w-[25%] flex-col gap-2">
                    <Heading size="heading5xl" as="h1" className="text-[16px] font-bold">المشاريع تم تقييمها</Heading>
                    <div
                      ref={reviewedContainerRef}
                      className="flex flex-col gap-2 h-[140px] overflow-y-auto pr-1 transition-all duration-300"
                    >
                      {(showMoreReviewed ? reviewedProjects : reviewedProjects.slice(0, 3)).map((p, i) => (
                        <div key={i} className="bg-gray-100 rounded-full px-3 py-1 text-xs font-bold text-gray-700 whitespace-nowrap">
                          {p}
                        </div>
                      ))}
                    </div>
                    {!showMoreReviewed && reviewedProjects.length > 3 && (
                      <button
                        onClick={handleShowMore}
                        className="text-blue-500 text-xs mt-2 self-start hover:underline"
                      >
                        عرض المزيد...
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-[70%]">
                    <EditableBox title="المشاريع" items={projects} setItems={setProjects} iconSrc="images/img_flipboard.png" />
                    <EditableBox title="المهارات" items={skills} setItems={setSkills} iconSrc="images/img_resume.png" />
                    <EditableBox title="الخبرات" items={experiences} setItems={setExperiences} iconSrc="images/img_front_desk.png" />
                    <EditableBox title="الشهادات" items={certificates} setItems={setCertificates} iconSrc="images/img_internship.png" />
                  </div>
                </div>

                <div className="flex justify-center mt-6 gap-4 text-gray-700 text-sm">
                  <a href={socialLinks.linkedin} target="_blank" rel="noreferrer"><Linkedin size={22} /></a>
                  <a href={socialLinks.twitter} target="_blank" rel="noreferrer"><X size={22} /></a>
                  <a href="#"><Phone size={22} /></a>
                  <a href="#"><MessageSquare size={22} /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
