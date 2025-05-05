import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, X, Globe, Bell } from 'lucide-react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import Sidebar3 from "../../components/Sidebar3"; 
import axios from 'axios'; 

const Heading = ({ size, as: Component = "h1", className, children, ...props }) => {
  return (
    <Component className={`${size} ${className}`} {...props}>
      {children}
    </Component>
  );
};

const Img = ({ src, alt, className, ...props }) => {
  return <img src={src} alt={alt} className={className} {...props} />;
};

export  function Header({ ...props }) {
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
          className="absolute bottom-0 right-px m-auto h-[30px] w-[90%] rounded-tl-md rounded-tr-md object-contain"
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
            className="absolute bottom-[0.50px] left-10  m-auto text-[13px] font-bold !text-blue_gray-500_02"
          >
            Innovation Oasis
          </Heading>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 flex items-center gap-4 p-5">
        <div className="flex items-center gap-2 text-gray-600">
          <Globe size={18} />
          <span>English</span>
        </div>
        
      </div>
    </header>
  );
}

const MentorRequestPage = () => {
  const [selectedFileType, setSelectedFileType] = useState('الكل');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIdea, setCurrentIdea] = useState(null);
  const [ideaTitle, setIdeaTitle] = useState("");
  const [mentors, setMentors] = useState([]);


  const [mentorRequestForm, setMentorRequestForm] = useState({
    mentorid: "",
    innovator_name: "",
    innovatorid: null,
    reason: ""

  });


  const [ideas, setIdeas] = useState([]);

  const [previousRequests, setPreviousRequests] = useState([]);
  const [innovators, setInnovators] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/api/innovator")
      .then(res => setInnovators(res.data))
      .catch(err => console.error("Error fetching innovators:", err));
  }, []);
  
  useEffect(() => {
const fetchApprovedIdeas = () => {
  fetch("http://localhost:4000/approvedideas")
    .then(res => res.json())
    .then(data => {
      console.log("Raw data from API:", data);
      
      const formattedIdeas = data.map(item => ({
        id: item.reviewid, 
        ideaid: item.ideaid, 
        ideaName: item.title,
        title: item.title, 
        domain: item.category,
        category: item.category,
        description: item.description,
        submissionDate: new Date().toISOString().split("T")[0],
        mentorshipStatus: "متاح للإرشاد",
        canSubmitMentorRequest: true,
        attachments: item.attachments || []
      }));
      
      console.log("Formatted ideas:", formattedIdeas); 
      setIdeas(formattedIdeas);
    })
    .catch(err => console.error('Error fetching approved ideas:', err));
};
    const fetchPreviousRequests = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/mentorshiprequestsfrominnovators");
        setPreviousRequests(res.data);
      } catch (error) {
        console.error("❌ فشل في تحميل الطلبات السابقة:", error);
      }
    };
  
    fetchApprovedIdeas();
    fetchPreviousRequests();
  
    const handleStorageChange = () => {
      fetchApprovedIdeas();
      fetchPreviousRequests();
    };
  
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/mentor");
        setMentors(response.data);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };

    fetchMentors();
  }, []);
  
  const fileTypeIcons = {
    'pdf': <span className="text-red-500">PDF</span>,
    'word': <span className="text-blue-500">Word</span>,
    'image': <span className="text-green-500">صورة</span>,
    'code': <span className="text-purple-500">نص</span>
  };

  const filteredIdeas = selectedFileType === 'الكل' 
    ? ideas 
    : ideas.filter(idea => 
      idea.attachments && idea.attachments.some(attachment => attachment.type === selectedFileType)
    );

const openMentorRequestModal = (idea) => {
  console.log("Selected idea object:", idea); 
  
  const ideaId = idea.ideaid;
  console.log("Using ideaid:", ideaId); 
  
  setCurrentIdea(idea);
  setIdeaTitle(idea.ideaName || idea.title || "");

  setMentorRequestForm(prev => ({
    ...prev,
    ideaid: ideaId 
  }));

  setIsModalOpen(true);
};

  const handleFormChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "innovator_name") {
      const matched = innovators.find(inv =>
        `${inv.f_name} ${inv.l_name}` === value
      );
  
      setMentorRequestForm(prev => ({
        ...prev,
        innovator_name: value,
        innovatorid: matched?.innovatorid || null
      }));
    }
    else if (name === "mentorid") {
      setMentorRequestForm(prev => ({
        ...prev,
        mentorid: value
      }));
    }
    else {
      setMentorRequestForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
    

const submitMentorRequest = async () => {
  const { mentorid, innovatorid, reason } = mentorRequestForm;
  
  const ideaid = currentIdea.ideaid;
  
  console.log("About to submit with:", {
    mentorid,
    innovatorid,
    reason,
    ideaid,
    currentIdea
  });

  if (!mentorid || !innovatorid || !reason || !ideaid) {
    alert("يرجى تعبئة جميع الحقول");
    return;
  }

  const requestData = {
    mentorid,
    innovatorid,
    reason,
    ideaid,
    title: currentIdea.title
  };
  
  console.log("🚀 Sending mentorship request data:", requestData);
  
  try {
    const res = await axios.post("http://localhost:4000/api/mentorshiprequestsfrominnovators", requestData);

    if (res.status === 200 || res.status === 201) {
      alert("✅ تم إرسال الطلب بنجاح!");

      const selectedMentor = mentors.find(mentor => mentor.mentorid === mentorid);
      const mentorName = selectedMentor ? `${selectedMentor.f_name} ${selectedMentor.l_name}` : "غير معروف";
      
      const newRequest = {
        request_id: res.data.request_id || `temp-${Date.now()}`, 
        mentor_name: mentorName,
        innovator_name: mentorRequestForm.innovator_name,
        title: ideaTitle,
        reason: reason,
        status: 'قيد المراجعة' 
      };
      
      setPreviousRequests(prevRequests => [newRequest, ...prevRequests]);

      setIsModalOpen(false);
      setMentorRequestForm({
        mentorid: "",
        innovator_name: "",
        innovatorid: null,
        reason: "",
      });
      setCurrentIdea(null);
    } else {
      alert(`❌ فشل في إرسال الطلب: ${res.data.error || 'خطأ غير معروف'}`);
    }
  } catch (error) {
    console.error("❌ خطأ في إرسال الطلب:", error);
    const errorMessage = error.response?.data?.error || error.message || "حدث خطأ أثناء الإرسال";
    alert(errorMessage);
  }
};
  return (
    <>  
      <Helmet>
        <title>Innovation Oasis</title>
      </Helmet>
      <div className="min-h-screen bg-gray-100 font-sans" dir="rtl">
        <Header />
        <div className="flex flex-row-reverse"> 
          <Sidebar3 />

          <div className="flex-1 p-6">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">أفكاري</h1>
                  <div className="flex items-center space-x-reverse space-x-2">
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
                        <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المرفقات</th>
                        <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حالة طلب التمويل</th>
                        <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ التقديم</th>
                        <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المجال</th>
                        <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم الفكرة</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredIdeas.length > 0 ? (
  filteredIdeas.map((idea, index) => (
    <tr key={idea.id || idea.ideaid || idea.reviewid || `idea-${index}`} className="hover:bg-gray-50 transition">
                            <td className="p-3">
                              <button 
                                onClick={() => openMentorRequestModal(idea)}
                                disabled={!idea.canSubmitMentorRequest}
                                className={`
                                  px-4 py-2 rounded-md transition 
                                  ${idea.canSubmitMentorRequest 
                                    ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  }
                                `}
                              >
                                طلب إرشاد
                              </button>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-col space-y-1">
                              {idea.attachments && idea.attachments.map((attachment, attachIndex) => (
  <div 
    key={attachment.id || `${idea.id}-attach-${attachIndex}`} 
    className="flex items-center space-x-reverse space-x-2"
  >
    {fileTypeIcons[attachment.type]}
    <span>{attachment.name}</span>
  </div>
))}
                              </div>
                            </td>
                            <td className="p-3">
                              <span 
                                className={`
                                  px-3 py-1 rounded-full text-xs font-medium
                                  ${idea.canSubmitMentorRequest 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                  }
                                `}
                              >
                                {idea.mentorshipStatus}
                              </span>
                            </td>
                            <td className="p-3 text-gray-600">{idea.submissionDate}</td>
                            <td className="p-3 text-gray-600">{idea.domain}</td>
                            <td className="p-3 font-medium text-gray-900">{idea.ideaName}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="p-4 text-center text-gray-500">
                            لا توجد أفكار متاحة حاليًا. يرجى تقديم فكرة جديدة أولاً.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {filteredIdeas.length > 0 && (
                  <div className="flex justify-center items-center mt-6 space-x-reverse space-x-4">
                    <button className="text-gray-600 hover:text-gray-900 transition"><ChevronRight /></button>
                    <span className="text-gray-600">1</span>
                    <button className="text-gray-600 hover:text-gray-900 transition"><ChevronLeft /></button>
                  </div>
                )}
              </div>

              {previousRequests.length > 0 && (
  <div className="bg-white rounded-lg shadow-md p-6 mt-6">
    <h1 className="text-2xl font-bold mb-6 text-gray-800">حالة الطلبات السابقة</h1>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المرشد</th>
            <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبتكر</th>
            <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم الفكرة</th>
            <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سبب الطلب</th>
            <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {previousRequests.map((row, index) => (
            <tr key={row.request_id || `request-${index}`} className="hover:bg-gray-50 transition">
              <td className="p-3 text-gray-600">{row.mentor_name}</td>
              <td className="p-3 text-gray-600">{row.innovator_name}</td>
              <td className="p-3 text-gray-600">{row.title || '—'}</td>
              <td className="p-3 text-gray-600">{row.reason}</td>
              <td className="p-3">
                {row.status === 'مقبول' || row.status === 'accepted' ? (
                  <span className="text-green-500">✓ تمت الموافقة</span>
                ) : row.status === 'مرفوض' || row.status === 'rejected' ? (
                  <span className="text-red-500">✗ مرفوض</span>
                ) : (
                  <span className="text-yellow-500">⟳ قيد المراجعة</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 p-6 relative border"
            style={{
              backgroundColor: 'white',
              opacity: 1,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 hover:text-gray-900 absolute top-4 left-4"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold w-full text-center">نموذج طلب مرشد</h2>
            </div>

            <div className="mt-6">
              <div className="mb-4">
                <label className="block mb-2 text-right">اختار مرشد</label>
                <select
      name="mentorid"
      value={mentorRequestForm.mentorid}
      onChange={handleFormChange}
      className="w-full border rounded p-2 text-right"
    >
      <option value="">اختر مرشد</option>
      {mentors.map((mentor) => (
        <option key={mentor.mentorid} value={mentor.mentorid}>
          {mentor.f_name} {mentor.l_name} - {mentor.specialization || ""}
        </option>
      ))}
    </select>

              </div>

              <div>
                <label className="block text-gray-700 mb-2">اسم المستخدم:</label>
                <input
                  type="text"
                  name="innovator_name"  
                  value={mentorRequestForm.innovator_name}
                  onChange={handleFormChange}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-200 transition"
                  placeholder="أدخل اسمك"
                />
              </div>
              <div className="mb-4">
  <label className="block text-gray-700 mb-2">عنوان الفكرة:</label>
  <input
    type="text"
    value={ideaTitle}
    readOnly
    className="w-full border rounded-md p-2 bg-gray-100 text-gray-800"
  />
</div>
              <div>
                <label className="block text-gray-700 mb-2">سبب الطلب:</label>
                <textarea
                  name="reason"
                  placeholder="اذكر سبب طلب الإرشاد"
                  value={mentorRequestForm.reason}
                  onChange={handleFormChange}
                  className="p-2 border rounded w-full"
                />
              </div>

              <div className="flex justify-end space-x-reverse space-x-4 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={submitMentorRequest}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition"
                >
                  تقديم الطلب
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MentorRequestPage;