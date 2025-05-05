import { Helmet } from "react-helmet";
import { Heading, Text, Img } from "../../components";
import Sidebar3 from "../../components/Sidebar3";
import React, { useState, useEffect } from "react";
import { Globe, Search, Bell, User, MessageCircle } from 'lucide-react';
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

const translations = {
  ar: {
    title: "طلبات الإرشاد الجديدة",
    search: "بحث",
    language: "العربية",
    loadMore: "عرض المزيد",
    details: "عرض التفاصيل",
    new: "جديدة",
    pending: "قيد الانتظار",
    underReview: "قيد المراجعة",
    accepted: "تمت الموافقة على الطلب",
    rejected: "تم رفض الطلب",
    comments: "التعليقات",
    accept: "قبول",
    reject: "رفض",
    mentorName: "اسم المرشد",
    projectTitle: "عنوان المشروع",
    projectDescription: "وصف المشروع",
    mentorshipType: "نوع الإرشاد",
    viewProfile: "عرض الملف الشخصي",
    requestDetails: "تفاصيل طلب الإرشاد",
    noMoreRequests: "لا توجد طلبات جديدة",
    innovator: "المبتكر",
    category: "الفئة",
    loading: "جاري التحميل...",
    errorLoading: "حدث خطأ أثناء تحميل البيانات",
    requestDate: "تاريخ الطلب",
    message: "مراسلة",
    updateError: "حدث خطأ أثناء تحديث الطلب",
    updateSuccess: "تم تحديث الطلب بنجاح",
    serverError: "خطأ في الخادم، يرجى المحاولة مرة أخرى لاحقًا"
  },
  en: {
    title: "New Mentorship Requests",
    search: "Search",
    language: "English",
    loadMore: "Load More",
    details: "View Details",
    new: "New",
    pending: "Pending",
    underReview: "Under Review",
    accepted: "Request Accepted",
    rejected: "Request Rejected",
    comments: "Comments",
    accept: "Accept",
    reject: "Reject",
    mentorName: "Mentor Name",
    projectTitle: "Project Title",
    projectDescription: "Project Description",
    mentorshipType: "Mentorship Type",
    viewProfile: "View Profile",
    requestDetails: "Mentorship Request Details",
    noMoreRequests: "No new requests available",
    innovator: "Innovator",
    category: "Category",
    loading: "Loading...",
    errorLoading: "Error loading data",
    requestDate: "Request Date",
    message: "Message",
    updateError: "Error updating request",
    updateSuccess: "Request updated successfully",
    serverError: "Server error, please try again later"
  }
};

const Card = ({ language, request, onClick }) => {
  const getStatusLabel = (status) => {
    switch(status) {
      case "Accepted":
      case "accepted":
        return translations[language].accepted;
      case "Rejected":
      case "rejected":
        return translations[language].rejected;
      case "Pending":
      case "pending":
        return translations[language].pending;
      default:
        return translations[language].new;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Accepted":
      case "accepted":
        return "bg-green-200 text-green-900";
      case "Rejected":
      case "rejected":
        return "bg-red-200 text-red-900";
      case "Pending":
      case "pending":
        return "bg-yellow-200 text-yellow-900";
      default:
        return "bg-green-200 text-green-900";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
  };

  return (
    <div className="w-80 border border-gray-200 rounded-2xl bg-white p-6 shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl hover:border-blue-500 duration-300">
      <p className="text-md text-blue-700 font-medium mb-2">
        {request.mentorname || `${translations[language].mentorName} #${request.mentorid}`}
      </p>
      <p className="text-sm text-gray-600 mb-3">{formatDate(request.requestdate)}</p>
      
      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
        {getStatusLabel(request.status)}
      </span>
      
      <div className="mt-5 flex justify-center">
        <button 
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-transform transform hover:scale-110" 
          onClick={onClick}>
          {translations[language].details}
        </button>
      </div>
    </div>
  );
};

const MentorshipDetailsModal = ({ request, isOpen, onClose, language, onAccept, onReject }) => {
  const [comments, setComments] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); 
  const [isAccepted, setIsAccepted] = useState(request?.status === "accepted");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const t = translations[language];

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
  };

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      setIsAccepted(true);
      onAccept(request.mentorshiprequestid);
      setMessageType("success");
      setActionMessage("✔️ تم قبول طلب الإرشاد بنجاح");
      
      try {
        const requestData = {
          status: 'accepted',
          comment: comments
        };
                
        console.log(`Sending accept update to /api/mentorshiprequest/${request.mentorshiprequestid}:`, requestData);
        
        fetch(`http://localhost:4000/api/mentorshiprequest/${request.mentorshiprequestid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        }).then(res => {
          if (!res.ok) {
            console.warn(`API returned error status: ${res.status}`);
          } else {
            console.log("Status updated successfully in database");
          }
        }).catch(err => {
          console.error("Background API update failed:", err);
        });
      } catch (apiError) {
        console.error("Error in background API call:", apiError);
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleReject = async () => {
    setIsProcessing(true);
    try {
      setIsAccepted(false);
      onReject(request.mentorshiprequestid);
      setMessageType("error");
      setActionMessage("❌ تم رفض طلب الإرشاد");
      
      try {
        const requestData = {
          status: 'rejected',
          comment: comments
        };
                
        console.log(`Sending reject update to /api/mentorshiprequest/${request.mentorshiprequestid}:`, requestData);
        
        fetch(`http://localhost:4000/api/mentorshiprequest/${request.mentorshiprequestid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        }).then(res => {
          if (!res.ok) {
            console.warn(`API returned error status: ${res.status}`);
          } else {
            console.log("Status updated successfully in database");
          }
        }).catch(err => {
          console.error("Background API update failed:", err);
        });
      } catch (apiError) {
        console.error("Error in background API call:", apiError);
      }
    } finally {
      setIsProcessing(false);
      
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };  
  
  const handleMessageButtonClick = () => {
    navigate("/chat", { 
      state: { 
        mentorshipId: request.mentorshiprequestid, 
        mentorName: request.mentorname || `Mentor #${request.mentorid}`
      } 
    });
  };

  const handleViewProfile = () => {
    window.open(`/mentorprofile/${request.mentorid}`, "_blank");
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-100 text-gray-800 p-6 rounded-lg w-full max-w-lg mx-4 shadow-lg relative border">
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-800 text-xl">✖</button>
        <h2 className="text-xl font-bold mb-4 text-center">{t.requestDetails}</h2>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-right">
          <h3 className="text-lg font-bold text-blue-800 mb-4 text-center">معلومات المرشد</h3>
          
          <div className="grid grid-cols-1 gap-4 mb-4 text-right">
            <div className="flex justify-between items-center">
              <span className="text-blue-800 font-bold">
                {request.mentorname || `${t.mentorName} #${request.mentorid}`}
              </span>
              <strong>اسم المرشد:</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-800 font-bold">{formatDate(request?.requestdate)}</span>
              <strong>{t.requestDate}:</strong>
            </div>
          </div>
          
          <div className="mt-4 text-center flex justify-center gap-4">
            <button 
              onClick={handleViewProfile}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <User size={16} />
              {t.viewProfile}
            </button>
          </div>
        </div>

        <div className="mt-6 text-right">
          <strong>{t.comments}</strong>
          <textarea 
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-white text-gray-800 text-right" 
            rows="3" 
            value={comments} 
            onChange={(e) => setComments(e.target.value)}
            placeholder="أضف تعليقك هنا..."
          ></textarea>
        </div>

        {actionMessage && (
          <div className={`mt-4 text-center font-semibold ${messageType === "success" ? "text-green-600" : "text-red-600"}`}>
            {actionMessage}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-4">
          {(isAccepted || request.status === "accepted") && (
            <button 
              onClick={handleMessageButtonClick} 
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center gap-2"
            >
              <MessageCircle size={16} />
              {t.message}
            </button>
          )}
          
          <button 
            onClick={handleReject} 
            className={`px-4 py-2 rounded-md text-white transition ${isProcessing || request.status === 'accepted' || request.status === 'rejected' ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600'}`}
            disabled={isProcessing || request.status === 'accepted' || request.status === 'rejected'}
          >
            {t.reject}
          </button>

          <button 
            onClick={handleAccept} 
            className={`px-4 py-2 rounded-md text-white transition ${isProcessing || request.status === 'accepted' || request.status === 'rejected' ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-800'}`}
            disabled={isProcessing || request.status === 'accepted' || request.status === 'rejected'}
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MentorshipRequestsPage() {
  const [language, setLanguage] = useState("ar");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [visibleCards, setVisibleCards] = useState(4);
  const [mentorshipRequests, setMentorshipRequests] = useState([]);
  const [mentors, setMentors] = useState({});
  const [loading, setLoading] = useState(true);
  const [showNoMoreMessage, setShowNoMoreMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchMentorshipRequests();
    fetchMentors();
  }, []);

  const fetchMentorshipRequests = () => {
    setLoading(true);
    fetch("http://localhost:4000/api/mentorshiprequest")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Fetched Mentorship Requests:", data);
        setMentorshipRequests(data);
        setErrorMessage("");
      })
      .catch((error) => {
        console.error("❌ Error Fetching Data:", error);
        setErrorMessage(translations[language].serverError);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchMentors = () => {
    fetch("http://localhost:4000/api/mentor")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Fetched Mentors:", data);
        
        const mentorsMap = {};
        data.forEach(mentor => {
          mentorsMap[mentor.mentorid] = {
            firstname: mentor.f_name,
            lastname: mentor.l_name
          };
        });
        
        setMentors(mentorsMap);
      })
      .catch((error) => {
        console.error("❌ Error Fetching Mentors:", error);
      });
  };
  
  const enrichedRequests = mentorshipRequests.map(request => {
    if (!request.mentorname) {
      const mentor = mentors[request.mentorid];
      return {
        ...request,
        mentorname: mentor ? `${mentor.firstname} ${mentor.lastname}` : null
      };
    }
    return request;
  });
  
  const loadMore = () => {
    if (visibleCards >= enrichedRequests.length) {
      setShowNoMoreMessage(true);
      setTimeout(() => {
        setShowNoMoreMessage(false);
      }, 3000);
    } else {
      setVisibleCards((prev) => prev + 4);
    }
  };

  const handleAccept = (requestId) => {
    setMentorshipRequests(prev => 
      prev.map(request => 
        request.mentorshiprequestid === requestId ? { ...request, status: "accepted" } : request
      )
    );
  };

  const handleReject = (requestId) => {
    setMentorshipRequests(prev => 
      prev.map(request => 
        request.mentorshiprequestid === requestId ? { ...request, status: "rejected" } : request
      )
    );
  };

  return (
    <>
      <Helmet>
        <title>{translations[language].title}</title>
      </Helmet>
      <Header />
      <div className="w-full bg-w_background">
        <div className="mb-[42px]">
          <div className="flex">
            <Sidebar3 />
            <div className="flex flex-1 flex-col items-center px-14 md:px-5">
              <Text size="m3_display_small" as="p" className="text-center text-[36px] font-bold text-gray-800 mt-10 mb-8">
                {translations[language].title}
              </Text>

              {errorMessage && (
                <div className="w-full max-w-5xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
                  {errorMessage}
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="ml-4 text-blue-600">{translations[language].loading}</p>
                </div>
              ) : enrichedRequests.length > 0 ? (
                <div className="mt-10 flex flex-wrap justify-center gap-8 w-full max-w-5xl">
                  {enrichedRequests.slice(0, visibleCards).map((request) => (
                    <Card 
                      key={request.mentorshiprequestid}
                      language={language}
                      request={request}
                      onClick={() => { 
                        setSelectedRequest(request); 
                        setIsModalOpen(true); 
                      }} 
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-10 text-center text-gray-600">
                  {translations[language].noMoreRequests}
                </div>
              )}

              {showNoMoreMessage && (
                <div className="mt-4 text-center text-gray-600">
                  {translations[language].noMoreRequests}
                </div>
              )}

              {!loading && enrichedRequests.length > visibleCards && (
                <button 
                  onClick={loadMore}
                  className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  {translations[language].loadMore}
                </button>
              )}

              {isModalOpen && (
                <MentorshipDetailsModal
                  request={selectedRequest}
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  language={language}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}