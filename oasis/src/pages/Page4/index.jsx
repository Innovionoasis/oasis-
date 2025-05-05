import { Helmet } from "react-helmet";
import React, { useState, useEffect } from "react";
import Sidebar8 from "../../components/Sidebar8";
import Header from "../../components/Header";

const translations = {
  ar: {
    title: "الأفكار المقبولة التي تحتاج تقييم نهائي",
    loadMore: "عرض المزيد",
    details: "عرض التفاصيل",
    new: "تحتاج لتقييم",
    evaluated: "تم التقييم",
  },
  en: {
    title: "Accepted Ideas - Final Evaluation",
    loadMore: "Load More",
    details: "View Details",
    new: "Needs Evaluation",
    evaluated: "Evaluated",
  },
};

const Card = ({ language, idea, onClick }) => {
  const statusLabel =
    idea.status === "تم التقييم"
      ? translations[language].evaluated
      : translations[language].new;

  const statusColor =
    idea.status === "تم التقييم"
      ? "bg-gray-200 text-gray-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="w-60 border border-gray-200 rounded-xl bg-white p-4 shadow-md">
      <h3 className="text-lg font-bold text-gray-800">{idea.title}</h3>
      <span className={`inline-block px-3 py-1 mt-2 text-xs font-semibold rounded-full ${statusColor}`}>
        {statusLabel}
      </span>
      <div className="mt-4 flex justify-center">
        <button
          className="px-4 py-2 bg-[#3D7AB3] text-white rounded-md"
          onClick={onClick}
        >
          {translations[language].details}
        </button>
      </div>
    </div>
  );
};

const IdeaDetailsModal = ({ idea, isOpen, onClose }) => {
  const [applicability, setApplicability] = useState(false);
  const [creativity, setCreativity] = useState(false);
  const [rating, setRating] = useState(80);
  const [comments, setComments] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  if (!isOpen) return null;


const handleSubmitEvaluation = async () => {
  try {
    const res = await fetch(`http://localhost:4000/api/review/${idea?.reviewid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        review_comment: comments,
        is_applicable: applicability,
        rating: rating,
        status: "تم التقييم",
      }),
    });
    
    if (res.ok) {
      const submittedIdeas = JSON.parse(localStorage.getItem("submittedIdeas") || "[]");

      const updatedIdeas = submittedIdeas.map(i => {
        if (i.title === idea.title) {
          return {
            ...i,
            reviewStatus: "accepted",
            canSubmitMentorRequest: true,  
            mentorshipStatus: "متاح للإرشاد",  
            evaluation: {
              applicability: applicability,
              creativity: creativity,
              rating: rating,
              comments: comments,
              reviewDate: new Date().toISOString().split('T')[0]
            }
          };
        }
        return i;
      });
      
      localStorage.setItem("submittedIdeas", JSON.stringify(updatedIdeas));
      
      window.dispatchEvent(new Event('storage'));
      
      setActionMessage("✅ تم إرسال التقييم بنجاح");
      setTimeout(() => {
        setActionMessage("");
        onClose();
      }, 2000);
    }
  } catch (err) {
    console.error("❌ خطأ أثناء إرسال التقييم:", err);
  }
};  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-100 text-gray-800 p-6 rounded-lg w-full max-w-lg mx-4 shadow-lg relative border">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-800 text-xl"
        >✖</button>
        <h2 className="text-xl font-bold mb-4 text-center">تفاصيل الفكرة</h2>

        <div className="grid grid-cols-2 gap-4 text-right">
          <div><strong>اسم المبتكر</strong> {idea?.innovator}</div>
          <div><strong>عنوان الفكرة</strong> {idea?.title}</div>
          <div className="col-span-2"><strong>المجال</strong> {idea?.category}</div>
          <div className="col-span-2">
            <strong>وصف الفكرة</strong>
            <textarea
              className="w-full mt-2 p-2 border border-gray-500 rounded-md bg-white text-gray-800 text-right"
              rows="3"
              defaultValue={idea?.description}
              disabled
            />
          </div>
        </div>

        <div className="mt-4 space-y-2 text-right">
          <div className="flex items-center gap-2 justify-end">
            <label>الأثر</label>
            <input
              type="checkbox"
              checked={applicability}
              onChange={() => setApplicability(!applicability)}
            />
          </div>
          <div className="flex items-center gap-2 justify-end">
            <label>الجدوى والاستدامة المالية</label>
            <input
              type="checkbox"
              checked={creativity}
              onChange={() => setCreativity(!creativity)}
            />
          </div>
          <div className="flex items-center gap-2 justify-end">
            <label>الابتكار و الابداع</label>
            <input
              type="checkbox"
              checked={creativity}
              onChange={() => setCreativity(!creativity)}
            />
          </div>
          <div className="flex items-center gap-2 justify-end">
            <label>قابلية التطبيق</label>
            <input
              type="checkbox"
              checked={applicability}
              onChange={() => setApplicability(!applicability)}
            />
          </div>
        </div>

        <div className="mt-4 text-right">
          <strong className="text-gray-800">المرفقات</strong>
          <div className="mt-2 flex items-center justify-end">
            {idea?.attachment && (
              <a href={idea.attachment} download className="bg-white text-gray-800 px-3 py-2 rounded border shadow-sm">
                📄 تحميل الملف
              </a>
            )}
          </div>
        </div>

        <div className="mt-4 text-right">
          <strong>التعليقات</strong>
          <textarea
            className="w-full mt-2 p-2 border border-gray-500 rounded-md bg-white text-gray-800 text-right"
            rows="2"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          ></textarea>
        </div>

        {actionMessage && (
          <div className="mt-4 text-center text-green-600 font-semibold">{actionMessage}</div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmitEvaluation}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            إرسال التقييم النهائي
          </button>
        </div>
      </div>
    </div>
  );
};

  export default function Page4Page() {
    const [ideas, setIdeas] = useState([]);
    const [visibleCards, setVisibleCards] = useState(30);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState(null);
    const language = "ar";
  
    useEffect(() => {
      fetch("http://localhost:4000/custom/reviewIdeaInnovator")
      .then((res) => res.json())
      .then((data) => {
        console.log("🚀 Page4 - fetched ideas:", data); // 👈
        setIdeas(data);
      })
      .catch((error) => {
        console.error("❌ Error fetching ideas:", error);
      });
      }, [isModalOpen]);
    
    // ✅ Add this!
    const loadMore = () => {
      setVisibleCards((prev) => prev + 4);
    };  return (
    <>
      <Helmet>
        <title>{translations[language].title}</title>
      </Helmet>
      <Header />
      <div className="w-full bg-w_background">
        <div className="mb-[42px]">
          <div className="flex">
            <Sidebar8 />
            <div className="flex flex-1 flex-col items-center px-14 md:px-5">
              <h1 className="text-[36px] font-bold mt-10">{translations[language].title}</h1>
              <div className="mt-10 flex flex-wrap justify-center gap-6 w-full">
                {ideas.slice(0, visibleCards).map((idea, index) => (
                  <Card
                    key={index}
                    language={language}
                    idea={idea}
                    onClick={() => {
                      setSelectedIdea(idea);
                      setIsModalOpen(true);
                    }}
                  />
                ))}
              </div>
              {visibleCards < ideas.length && (
                <button
                  className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                  onClick={loadMore}
                >
                  {translations[language].loadMore}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <IdeaDetailsModal
        idea={selectedIdea}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}