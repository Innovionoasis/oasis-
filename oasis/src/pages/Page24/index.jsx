import { Helmet } from "react-helmet";
import { Heading, Text, Img } from "../../components";
import Sidebar3 from "../../components/Sidebar3";
import React, { useState, useEffect } from "react";
import { Globe, Search, Bell, User } from 'lucide-react';
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom"; 

const translations = {
  ar: {
    title: "عرض طلبات التمويل الجديدة",
    search: "بحث",
    language: "العربية",
    loadMore: "عرض المزيد",
    details: "عرض التفاصيل",
    new: "جديدة",
    underReview: "قيد المراجعة",
    accepted: "تمت الموافقة",
    rejected: "تم رفض الطلب",
    comments: "التعليقات",
    accept: "قبول",
    reject: "رفض",
    investorName: "اسم المستثمر",
    fundingAmount: "المبلغ التمويل المعروض",
    requestDetails: "تفاصيل طلب التمويل",
    noMoreOffers: "لا توجد عروض جديدة",
    viewProfile: "عرض الملف الشخصي",
    message: "مراسلة", 
    updateError: "حدث خطأ أثناء تحديث الطلب",
    updateSuccess: "تم تحديث الطلب بنجاح",
    serverError: "خطأ في الخادم، يرجى المحاولة مرة أخرى لاحقًا",
    loadingInvestors: "جاري تحميل بيانات المستثمرين..."
  },
  en: {
    title: "New Funding Requests",
    search: "Search",
    language: "English",
    loadMore: "Load More",
    details: "View Details",
    new: "New",
    underReview: "Under Review",
    accepted: "Accepted",
    rejected: "Rejected",
    comments: "Comments",
    accept: "Accept",
    reject: "Reject",
    investorName: "Investor Name",
    fundingAmount: "Offered Funding Amount",
    requestDetails: "Funding Request Details",
    noMoreOffers: "No new offers available",
    viewProfile: "View Profile",
    message: "Message",
    updateError: "Error updating request",
    updateSuccess: "Request updated successfully",
    serverError: "Server error, please try again later",
    loadingInvestors: "Loading investor data..."
  }
};

const Card = ({ language, request, investors, onClick }) => {
  const getStatusLabel = (status) => {
    switch(status) {
      case "Accepted":
      case "accepted":
        return translations[language].accepted;
      case "Rejected":
      case "rejected":
        return translations[language].rejected;
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
      default:
        return "bg-green-200 text-green-900";
    }
  };

  const getInvestorName = () => {
    if (request.investor_id && investors[request.investor_id]) {
      const investor = investors[request.investor_id];
      return `${investor.f_name} ${investor.l_name}`;
    }
    return request.investor_name || translations[language].loadingInvestors;
  };

  return (
    <div className="w-80 border border-gray-200 rounded-2xl bg-white p-6 shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl hover:border-blue-500 duration-300">
      <h3 className="text-xl font-semibold text-gray-900 mb-3 break-words">{getInvestorName()}</h3>
      
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

const FundingDetailsModal = ({ request, isOpen, onClose, language, onAccept, onReject, investors }) => {
  const [comments, setComments] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isAccepted, setIsAccepted] = useState(request?.status === "accepted");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const t = translations[language];

  if (!isOpen) return null;

  const getInvestorName = () => {
    if (request.investor_id && investors[request.investor_id]) {
      const investor = investors[request.investor_id];
      return `${investor.f_name} ${investor.l_name}`;
    }
    return request.investor_name || t.loadingInvestors;
  };
  
  const displayName = getInvestorName();

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      setIsAccepted(true);
      onAccept(request.fundingid);
      setMessageType("success");
      setActionMessage("✔️ تم قبول طلب التمويل بنجاح");
      
      try {
        const requestData = {
          status: "accepted",
          comments: comments || ''
        };
        
        console.log(`Sending update to /api/fundingoffer/${request.fundingid}:`, requestData);
        
        fetch(`http://localhost:4000/api/fundingoffer/${request.fundingid}`, {
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
      onReject(request.fundingid);
      setMessageType("error");
      setActionMessage("❌ تم رفض طلب التمويل");
      
      try {
        const requestData = {
          status: "rejected",
          comments: comments || ''
        };
        
        console.log(`Sending update to /api/fundingoffer/${request.fundingid}:`, requestData);
        
        fetch(`http://localhost:4000/api/fundingoffer/${request.fundingid}`, {
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

  const handleViewProfile = () => {
    navigate("/page17", { 
      state: { 
        investorId: request.investor_id || request.fundingid, 
        investorName: displayName 
      } 
    });
    onClose(); 
  };

  const handleMessageButtonClick = () => {
    navigate("/chat", { 
      state: { 
        investorId: request.investor_id || request.fundingid, 
        investorName: displayName 
      } 
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-100 text-gray-800 p-6 rounded-lg w-full max-w-lg mx-4 shadow-lg relative border">
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-800 text-xl">✖</button>
        <h2 className="text-xl font-bold mb-4 text-center">{t.requestDetails}</h2>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-right">
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-800 font-bold">{displayName}</span>
              <strong>{t.investorName}:</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-800 font-bold">{request.moneyoffered}</span>
              <strong>{t.fundingAmount}:</strong>
            </div>
            <div className="flex justify-center mt-2">
              <button 
                onClick={handleViewProfile}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                {t.viewProfile}
              </button>
            </div>
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
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
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

export default function Page4Page() {
  const [language, setLanguage] = useState("ar");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [visibleCards, setVisibleCards] = useState(4);
  const [ideas, setIdeas] = useState([]);
  const [investors, setInvestors] = useState({});
  const [showNoMoreMessage, setShowNoMoreMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvestors();
    fetchFundingOffers();
  }, []);

  const fetchInvestors = () => {
    fetch("http://localhost:4000/api/investor")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Fetched Investors:", data);
        
        const investorsMap = {};
        data.forEach(investor => {
          investorsMap[investor.investor_id] = {
            f_name: investor.f_name,
            l_name: investor.l_name
          };
        });
        
        setInvestors(investorsMap);
      })
      .catch((error) => {
        console.error("❌ Error Fetching Investors:", error);
      });
  };

  const fetchFundingOffers = () => {
    setIsLoading(true);
    fetch("http://localhost:4000/api/fundingoffer")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Fetched Funding Offers:", data);
        setIdeas(data);
        setErrorMessage("");
      })
      .catch((error) => {
        console.error("❌ Error Fetching Funding Offers:", error);
        setErrorMessage(translations[language].serverError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const loadMore = () => {
    if (visibleCards >= ideas.length) {
      setShowNoMoreMessage(true);
      setTimeout(() => {
        setShowNoMoreMessage(false);
      }, 3000);
    } else {
      setVisibleCards((prev) => prev + 4);
    }
  };

  const handleAccept = (requestId) => {
    setIdeas(prev => 
      prev.map(request => 
        request.fundingid === requestId ? { ...request, status: "accepted" } : request
      )
    );
  };

  const handleReject = (requestId) => {
    setIdeas(prev => 
      prev.map(request => 
        request.fundingid === requestId ? { ...request, status: "rejected" } : request
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

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  <div className="mt-10 flex flex-wrap justify-center gap-8 w-full max-w-5xl">
                    {ideas.slice(0, visibleCards).map((request) => (
                      <Card 
                        key={request.fundingid}
                        language={language}
                        request={request}
                        investors={investors}
                        onClick={() => { 
                          setSelectedRequest(request); 
                          setIsModalOpen(true); 
                        }} 
                      />
                    ))}
                  </div>

                  {showNoMoreMessage && (
                    <div className="mt-4 text-center text-gray-600">
                      {translations[language].noMoreOffers}
                    </div>
                  )}

                  {ideas.length > visibleCards && (
                    <button 
                      onClick={loadMore}
                      className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      {translations[language].loadMore}
                    </button>
                  )}
                </>
              )}

              {isModalOpen && (
                <FundingDetailsModal
                  request={selectedRequest}
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  language={language}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  investors={investors}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}