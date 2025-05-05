import { Helmet } from "react-helmet";
import React, { useState, useEffect } from "react";
import Sidebar16 from "../../components/Sidebar8";
import Header from "../../components/Header";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const translations = {
  ar: {
    title: "جميع الافكار في المنصة",
    loadMore: "عرض المزيد",
    accept: "قبول",
    reject: "رفض",
    new: "تحتاج لتقييم",
    evaluated: "تم التقييم",
    problem: "المشكلة",
    category: "التصنيف",
    date: "التاريخ",
    attachments: "المرفقات",
    file: "ملف"
  }
};

const Card = ({ idea, onAccept, onReject }) => {
  const handleAcceptClick = () => {
    onAccept(idea);
  };

  const handleRejectClick = () => {
    onReject(idea);
  };

  return (
    <div className="w-60">
      <div className="relative h-[400px] bg-white border border-gray-200 rounded-2xl p-5 shadow-md transform transition duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 text-right">{idea.title}</h3>

          <div className="mt-2 text-right text-sm">
            <p className="text-gray-700 line-clamp-3 text-xs">{idea.description}</p>

            {idea.problem && (
              <p className="text-gray-600 mt-1 text-xs">
                <span className="font-medium">المشكلة: </span>
                {idea.problem.substring(0, 50)}{idea.problem.length > 50 ? '...' : ''}
              </p>
            )}

            <p className="text-gray-600 mt-1 text-xs">
              <span className="font-medium">الفئة: </span>
              {idea.category}
            </p>

            <p className="text-gray-600 text-xs">
              <span className="font-medium">التاريخ: </span>
              {idea.date}
            </p>

            {idea.attachments && idea.attachments.length > 0 && (
              <div className="flex flex-col items-end text-xs mt-1">
                <span className="font-medium text-xs">المرفقات:</span>
                <ul className="flex flex-wrap gap-1 justify-end">
                  {idea.attachments.slice(0, 2).map((attachment, idx) => (
                    <li key={idx}>
                      <a
                        href={`http://localhost:4000${attachment.url || attachment}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-xs"
                      >
                        {attachment.name || `ملف ${idx + 1}`}
                      </a>
                    </li>
                  ))}
                  {idea.attachments.length > 2 && (
                    <li>
                      <span className="text-xs">+{idea.attachments.length - 2}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          <button
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm transition duration-200 hover:bg-blue-700 shadow"
            onClick={handleAcceptClick}
          >
            قبول
          </button>
          <button
            className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm transition duration-200 hover:bg-blue-600 shadow"
            onClick={handleRejectClick}
          >
            رفض
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Page12() {
  const [ideas, setIdeas] = useState([]);
  const [visibleIdeas, setVisibleIdeas] = useState([]);
  const [visibleCards, setVisibleCards] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:4000'; 
  const API_IDEAS_URL = `${API_BASE_URL}/api/idea`;
  const API_REVIEW_URL = `${API_BASE_URL}/api/review`;

  axios.defaults.baseURL = API_BASE_URL;

  const fetchIdeas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_IDEAS_URL}?filter=pending`);
      
      const formattedIdeas = response.data
        .filter(idea => idea.status !== "مقبول" && idea.status !== "مرفوض")
        .map(idea => {
          let attachments = idea.attachments || [];
          if (typeof attachments === 'string') {
            try {
              attachments = JSON.parse(attachments);
            } catch (err) {
              attachments = [];
            }
          }
          
          return {
            _id: idea._id || idea.ideaid, 
            ideaid: idea.ideaid,          
            innovatorid: idea.innovatorid,
            title: idea.title,
            description: idea.description,
            problem: idea.problem || "",
            category: idea.category || "",
            status: idea.status || "قيد النظر",
            attachments: attachments,
            date: idea.submissiondate || new Date().toLocaleDateString('ar-SA'),
            innovator: idea.innovator || "مبتكر", 
          };
        });
      
      console.log("Fetched ideas:", formattedIdeas);
      
      setIdeas(formattedIdeas);
      setVisibleIdeas(formattedIdeas.slice(0, visibleCards));
      setIsLoading(false);
    } catch (error) {
      console.error("❌ خطأ في جلب البيانات:", error);
      setError("فشل في جلب البيانات. يرجى المحاولة مرة أخرى.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
    
    const pollingInterval = setInterval(() => {
      fetchIdeas();
    }, 30000);
    
    return () => clearInterval(pollingInterval);
  }, []);

  const handleAccept = async (idea) => {
    try {
      const ideaId = idea._id || idea.ideaid || idea.innovatorid;
      
      if (!ideaId) {
        console.error("Missing idea ID:", idea);
        alert("تعذر العثور على معرف الفكرة");
        return;
      }
      
      console.log(`Accepting idea with ID: ${ideaId}`);
      
      const response = await axios.put(`${API_IDEAS_URL}/${ideaId}`, {
        status: "مقبول"
      });
      
      if (response.data) {
        setVisibleIdeas(prevIdeas => 
          prevIdeas.filter(item => 
            item._id !== ideaId && 
            item.ideaid !== ideaId && 
            item.innovatorid !== ideaId
          )
        );
        
        setIdeas(prevIdeas => 
          prevIdeas.filter(item => 
            item._id !== ideaId && 
            item.ideaid !== ideaId && 
            item.innovatorid !== ideaId
          )
        );
        
        try {
          const submittedIdeas = JSON.parse(localStorage.getItem("submittedIdeas") || "[]");
          
          const alreadyExists = submittedIdeas.some(item => 
            (item.ideaid && item.ideaid === ideaId) || item.title === idea.title);
            
          if (!alreadyExists) {
            let attachmentUrl = "";
            if (idea.attachments && idea.attachments.length > 0) {
              attachmentUrl = typeof idea.attachments[0] === 'string' 
                ? idea.attachments[0] 
                : idea.attachments[0].url || "";
            }
            
            submittedIdeas.push({
              ideaid: ideaId,
              title: idea.title,
              description: idea.description,
              category: idea.category || "",
              status: "تحتاج لتقييم",
              attachment: attachmentUrl,
              innovator: idea.innovator || "مبتكر",
              reviewid: "local_" + Date.now(),
              canSubmitMentorRequest: false,
              mentorshipStatus: "غير متاح للإرشاد",
            });
            
            localStorage.setItem("submittedIdeas", JSON.stringify(submittedIdeas));
            
            window.dispatchEvent(new Event('storage'));
            
            toast.success("تم قبول الفكرة بنجاح وإضافتها إلى قائمة التقييم النهائي");
          }
        } catch (storageErr) {
          console.error("❌ فشل في تخزين الفكرة محلياً:", storageErr);
        }
        
        try {
          const reviewResponse = await axios.post(API_REVIEW_URL, {
            ideaid: ideaId,
            status: "تحتاج لتقييم"
          });
          
          console.log("Review entry created with minimal data:", reviewResponse.data);
        } catch (reviewErr) {
          console.error("❌ فشل في إضافة الفكرة إلى نظام التقييم:", reviewErr);
          if (reviewErr.response) {
            console.error("Response data:", reviewErr.response.data);
            console.error("Response status:", reviewErr.response.status);
          }
        }
      }
    } catch (err) {
      console.error("❌ فشل في قبول الفكرة:", err);
      if (err.response && err.response.status === 404) {
        toast.error("الفكرة غير موجودة في قاعدة البيانات");
      } else {
        toast.error("حدث خطأ أثناء قبول الفكرة");
      }
    }
  };  
  
  const handleReject = async (idea) => {
    try {
      const ideaId = idea._id || idea.ideaid || idea.innovatorid;
      
      if (!ideaId) {
        console.error("Missing idea ID:", idea);
        toast.error("تعذر العثور على معرف الفكرة");
        return;
      }
      
      console.log(`Rejecting idea with ID: ${ideaId}`);
      
      const response = await axios.put(`${API_IDEAS_URL}/${ideaId}`, {
        status: "مرفوض"
      });
      
      if (response.data) {
        setVisibleIdeas(prevIdeas => 
          prevIdeas.filter(item => 
            item._id !== ideaId && 
            item.ideaid !== ideaId && 
            item.innovatorid !== ideaId
          )
        );
        
        setIdeas(prevIdeas => 
          prevIdeas.filter(item => 
            item._id !== ideaId && 
            item.ideaid !== ideaId && 
            item.innovatorid !== ideaId
          )
        );
        
        toast.info("تم رفض الفكرة");
      }
    } catch (err) {
      console.error("❌ فشل في رفض الفكرة:", err);
      if (err.response && err.response.status === 404) {
        toast.error("الفكرة غير موجودة في قاعدة البيانات");
      } else {
        toast.error("حدث خطأ أثناء رفض الفكرة");
      }
    }
  };

  const loadMore = () => {
    setVisibleCards((prev) => prev + 6);
    setVisibleIdeas(ideas.slice(0, visibleCards + 6));
  };

  return (
    <>
      <Helmet>
        <title>{translations.ar.title}</title>
      </Helmet>
      <Header />
      <div className="w-full bg-w_background">
        <div className="mb-[42px]">
          <div className="flex">
            <Sidebar16 />
            <div className="flex flex-1 flex-col items-center px-14 md:px-5">
              <h1 className="text-[36px] font-bold mt-10">{translations.ar.title}</h1>
              
              {isLoading && (
                <div className="mt-10 text-center">
                  <p>جاري تحميل البيانات...</p>
                </div>
              )}
              
              {error && (
                <div className="mt-10 text-center text-red-600">
                  <p>{error}</p>
                </div>
              )}
              
              {!isLoading && !error && visibleIdeas.length === 0 && (
                <div className="mt-10 text-center">
                  <p>لا توجد أفكار حالياً</p>
                </div>
              )}
              
              <div className="mt-10 flex flex-wrap justify-center gap-6 w-full">
                {visibleIdeas.map((idea, index) => (
                  <Card
                    key={index}
                    idea={idea}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                ))}
              </div>
              
              {visibleCards < ideas.length && (
                <button
                  className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                  onClick={loadMore}
                >
                  {translations.ar.loadMore}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        rtl={true}
        pauseOnHover
      />
    </>
  );
}