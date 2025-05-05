import { Helmet } from "react-helmet";
import { Text } from "../../components";
import Sidebar2 from "../../components/Sidebar2";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

<style jsx>{`
    .sticky-sidebar {
        position: sticky;
        top: 100;
         /* لضمان أن السايد بار يظهر فوق المحتوى */
    }
`} 
</style>

const getStatusBadge = (status) => {
  switch (status) {
    case "مقبول":
      return { text: "تم القبول", color: "bg-green-200 text-green-900" };
    case "معلق":
      return { text: "معلق", color: "bg-yellow-200 text-yellow-900" };
    default:
      return { text: "جديدة", color: "bg-blue-200 text-blue-900" };
  }
};

const Card = ({ idea, onClick }) => {
  const statusBadge = getStatusBadge(idea.status);

  return (
    <div className="w-80 border border-gray-200 rounded-2xl bg-white p-6 shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl hover:border-blue-500 duration-300">
      <h3 className="text-xl font-semibold text-gray-900 mb-3 break-words">{idea.title}</h3>
      <p className="text-sm text-gray-700 mb-2">
        <strong>اسم المبتكر:</strong> {idea.innovator_name}
      </p>
      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusBadge.color}`}>
        {statusBadge.text}
      </span>
      <div className="mt-5 flex justify-center">
        <button
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-transform transform hover:scale-110"
          onClick={onClick}
        >
          عرض التفاصيل
        </button>
      </div>
    </div>
  );
};

const IdeaDetailsModal = ({ idea, isOpen, onClose, onStatusChange }) => {
  const [actionMessage, setActionMessage] = useState("");
  const navigate = useNavigate(); 

  if (!isOpen || !idea) return null;

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/mentorship-requests/${idea.request_id}/status`,
        { status: newStatus }
      );

      if (response.status === 200) {
        setActionMessage(newStatus === "مقبول" ? "✔️ تم قبول الفكرة بنجاح" : "❌ تم رفض الفكرة");
        setTimeout(() => {
          setActionMessage("");
          onClose();
          onStatusChange(idea.request_id, newStatus);
        }, 2000);
      } else {
        setActionMessage("⚠️ حدث خطأ أثناء تحديث الحالة");
      }
    } catch (error) {
      console.error("❌ Error updating status:", error);
      setActionMessage("⚠️ حدث خطأ أثناء إرسال الطلب");
    }
  };


  const handleViewProfile = () => {
    navigate(`/innovatorprofile`)
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-100 text-gray-800 p-6 rounded-lg w-full max-w-lg mx-4 shadow-lg relative border max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-800 text-xl">✖</button>
        <h2 className="text-xl font-bold mb-4 text-center">تفاصيل الفكرة</h2>
  
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-right mb-6">
          <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="flex justify-between items-center">
              <span className="text-blue-800 font-bold">{idea?.innovator_name || ''}</span>
              <strong>اسم المبتكر: </strong>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-blue-800 font-bold">{idea?.title || ''}</span>
              <strong>اسم الفكرة:</strong>
            </div>
            
            <div className="flex justify-center mt-2">
              <button
                onClick={handleViewProfile}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                عرض الملف الشخصي
              </button>
            </div>
          </div>
        </div>
  
        <div className="grid grid-cols-2 gap-4 text-gray-800 text-right">
         
          
            <div className="col-span-2">
            <strong>المجال </strong>
            <input type="text" className="w-full mt-2 p-2 border border-gray-500 rounded-md bg-white text-gray-800 text-right"
              defaultValue={idea?.category || ''} disabled />
          </div>

          <div className="col-span-2">
            <strong>وصف الفكرة</strong>
            <input type="text" className="w-full mt-2 p-2 border border-gray-500 rounded-md bg-white text-gray-800 text-right"
              defaultValue={idea?.description || ''} disabled />
          </div>

          <div className="col-span-2">
            <strong>المشاكل التي تحلها</strong>
            <input type="text" className="w-full mt-2 p-2 border border-gray-500 rounded-md bg-white text-gray-800 text-right"
              defaultValue={idea?.problems || ''} disabled />
          </div>
          <div className="col-span-2">
            <strong>سبب الطلب</strong>
            <input type="text" className="w-full mt-2 p-2 border border-gray-500 rounded-md bg-white text-gray-800 text-right"
              defaultValue={idea?.reason || ''} disabled />
          </div>
        </div>
  
        <div className="mt-4 text-right">
          <strong className="text-gray-800">المرفقات:</strong>
          <div className="mt-2 flex items-center justify-end">
            {idea?.attachment && (
              <a href={idea.attachment} download className="bg-white text-gray-800 px-3 py-2 rounded border shadow-sm">📄 تحميل الملف</a>
            )}
          </div>
        </div>
  
        {actionMessage && (
          <div className="mt-4 text-center text-green-600 font-semibold">
            {actionMessage}
          </div>
        )}
  
        <div className="mt-4 flex justify-end gap-4">
          <button onClick={() => handleStatusUpdate("مرفوض")} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition">رفض</button>
          <button onClick={() => handleStatusUpdate("مقبول")} className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition">قبول</button>
        </div>
      </div>
    </div>
  );
};  

export default function Page4Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [visibleCards, setVisibleCards] = useState(4);
  const [ideasList, setIdeasList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios.get("http://localhost:4000/api/IdeasInnovatorsView")
      .then((response) => {
        setIdeasList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ هناك خطأ في جلب البيانات:", error);
        setLoading(false);
      });
  }, []);
  
  const handleStatusChange = (id, newStatus) => {
    if (newStatus === "مرفوض") {
      setIdeasList(prev => prev.filter(idea => idea.request_id !== id));
    } else {
      setIdeasList(prev =>
        prev.map(idea =>
          idea.request_id === id ? { ...idea, status: newStatus } : idea
        )
      );
    }
  };
  
  const loadMore = () => {
    setVisibleCards((prev) => prev + 4);
  };

  return (
    <>
      <Helmet>
        <title>طلبات الإشراف الجديدة</title>
      </Helmet>
      <div className="w-full bg-gray-50_01">
        <Header />

        <div className="flex">
        <div className=" sticky-sidebar">
            <Sidebar2 />
            </div>

          <div className="flex flex-1 flex-col items-center px-14 md:px-5">
            <Text size="m3_display_small" as="p" className="text-center text-[36px] font-bold text-gray-800 mt-10">
              طلبات الإشراف الجديدة
            </Text>
            {loading ? <p>⏳ جاري تحميل البيانات...</p> : (
              <div className="mt-10 flex flex-wrap justify-center gap-6 w-full">
                {ideasList.slice(0, visibleCards).map((idea, index) => (
                  <Card key={index} idea={idea} onClick={() => { setSelectedIdea(idea); setIsModalOpen(true); }} />
                ))}
              </div>
            )}
            <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300" onClick={loadMore}>
              عرض المزيد
            </button>
          </div>
        </div>
        </div>
      <IdeaDetailsModal
        idea={selectedIdea}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
