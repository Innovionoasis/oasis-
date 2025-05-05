import { Helmet } from "react-helmet";
import { Heading, Text, Img } from "../../components";
import Sidebar20 from "../../components/Sidebar20";
import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import axios from "axios";

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
    innovatorName: "اسم المبتكر",
    fundingAmount: "مبلغ التمويل المطلوب",
    ideaName: "اسم الفكرة",
    requestDetails: "تفاصيل طلب التمويل",
    noMoreOffers: "لا توجد عروض جديدة",
    viewProfile: "عرض الملف الشخصي",
    actionSuccess: "تم تنفيذ الإجراء بنجاح",
    actionError: "حدث خطأ أثناء تنفيذ الإجراء",
    acceptSuccess: "✔️ تم قبول طلب التمويل بنجاح",
    rejectSuccess: "❌ تم رفض طلب التمويل بنجاح",
    category: "مجال الفكرة",
    description: "وصف الفكرة",
    problems: "المشاكل التي تحلها",
    attachments: "المرفقات",
    addComment: "أضف تعليقك هنا...",
    noAttachments: "لا توجد مرفقات",
    noDescription: "لا يوجد وصف"
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
    innovatorName: "Innovator Name",
    fundingAmount: "Requested Funding Amount",
    ideaName: "Idea Name",
    requestDetails: "Funding Request Details",
    noMoreOffers: "No new offers available",
    viewProfile: "View Profile",
    actionSuccess: "Action completed successfully",
    actionError: "Error while performing action",
    acceptSuccess: "✔️ Funding request accepted successfully",
    rejectSuccess: "❌ Funding request rejected successfully",
    category: "Idea Category",
    description: "Idea Description",
    problems: "Problems It Solves",
    attachments: "Attachments",
    addComment: "Add your comment here...",
    noAttachments: "No attachments",
    noDescription: "No description"
  }
};

const Card = ({ language, request, onClick }) => {
  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "new":
        return translations[language].new;
      case "approved":
        return translations[language].accepted;
      case "rejected":
        return translations[language].rejected;
      case "pending":
      default:
        return translations[language].underReview;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "bg-blue-200 text-blue-900";
      case "approved":
        return "bg-green-200 text-green-900";
      case "rejected":
        return "bg-red-200 text-red-900";
      case "pending":
      default:
        return "bg-yellow-200 text-yellow-900";
    }
  };

  return (
    <div className="w-80 border border-gray-200 rounded-2xl bg-white p-6 shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl hover:border-blue-500 duration-300">
      <h3 className="text-xl font-semibold text-gray-900 mb-3 break-words">
        {request.idea_name || "-"}
      </h3>
      <span
        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
          request.status
        )}`}
      >
        {getStatusLabel(request.status)}
      </span>
      <div className="mt-5 flex justify-center">
        <button
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-transform transform hover:scale-110"
          onClick={onClick}
        >
          {translations[language].details}
        </button>
      </div>
    </div>
  );
};

const FundingDetailsModal = ({
  request,
  isOpen,
  onClose,
  language,
  onAccept,
  onReject
}) => {
  const [comments, setComments] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const t = translations[language];

  if (!isOpen) return null;

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        status: "Approved",
        reason: comments.trim() !== "" ? comments : undefined
      };

      const response = await axios.put(
        `http://localhost:4000/api/fundingrequest/${request.fundingrequestid}`,
        updateData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        onAccept(request.fundingrequestid);
        setActionMessage(t.acceptSuccess);
      } else {
        setActionMessage(t.actionError);
      }
    } catch (error) {
      setActionMessage(t.actionError);
      console.error("Error accepting funding request:", error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (actionMessage.includes("✔️")) {
          onClose();
        }
      }, 2000);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        status: "Rejected",
        reason: comments.trim() !== "" ? comments : undefined
      };

      const response = await axios.put(
        `http://localhost:4000/api/fundingrequest/${request.fundingrequestid}`,
        updateData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        onReject(request.fundingrequestid);
        setActionMessage(t.rejectSuccess);
      } else {
        setActionMessage(t.actionError);
      }
    } catch (error) {
      setActionMessage(t.actionError);
      console.error("Error rejecting funding request:", error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (actionMessage.includes("❌")) {
          onClose();
        }
      }, 2000);
    }
  };

  const handleViewProfile = () => {
    window.open(`/Page27`, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-100 text-gray-800 p-6 rounded-lg w-full max-w-lg mx-4 shadow-lg relative border max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-800 text-xl"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">
          {t.requestDetails}
        </h2>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-right">
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-800 font-bold">
                {request.idea_name || "-"}
              </span>
              <strong>{t.ideaName}:</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-800 font-bold">
                {request.innovator_name || "-"}
              </span>
              <strong>{t.innovatorName}:</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-800 font-bold">
                {request.requiredamount ? request.requiredamount.toString() : "-"}
              </span>
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
        
        <div className="space-y-4 mt-4">
          <div className="text-right">
            <label className="block text-sm text-gray-700 mb-1">{t.ideaName}</label>
            <input
              type="text"
              readOnly
              value={request.idea_name || "-"}
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800"
            />
          </div>

          <div className="text-right">
            <label className="block text-sm text-gray-700 mb-1">{t.innovatorName}</label>
            <input
              type="text"
              readOnly
              value={request.innovator_name || "-"}
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800"
            />
          </div>

          <div className="text-right">
            <label className="block text-sm text-gray-700 mb-1">{t.category}</label>
            <input
              type="text"
              readOnly
              value={request.category || "-"}
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800"
            />
          </div>

          <div className="text-right">
            <label className="block text-sm text-gray-700 mb-1">{t.description}</label>
            <textarea
              readOnly
              rows="3"
              value={request.description || t.noDescription}
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 resize-none"
            />
          </div>

          <div className="text-right">
            <label className="block text-sm text-gray-700 mb-1">{t.problems}</label>
            <textarea
              readOnly
              rows="2"
              value={request.problem || "-"}
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 resize-none"
            />
          </div>

          <div className="text-right">
            <label className="block text-sm text-gray-700 mb-1">{t.attachments}</label>
            <input
              type="text"
              readOnly
              value={request.attachments ? request.attachments : t.noAttachments}
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>
        </div>

        <div className="mt-6 text-right">
          <strong>{t.comments}</strong>
          <textarea
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-white text-gray-800 text-right"
            rows="3"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder={t.addComment}
          ></textarea>
        </div>

        {actionMessage && (
          <div className="mt-4 text-center text-green-600 font-semibold">
            {actionMessage}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleReject}
            disabled={isLoading}
            className={`px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {t.reject}
          </button>
          <button
            onClick={handleAccept}
            disabled={isLoading}
            className={`px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Page3Page() {
  const [language, setLanguage] = useState("ar");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [visibleCards, setVisibleCards] = useState(4);
  const [ideas, setIdeas] = useState([]);
  const [showNoMoreMessage, setShowNoMoreMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFundingRequests = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:4000/api/funding_requests_with_details"
      );
      const data = response.data;
      if (data && Array.isArray(data)) {
        setIdeas(data);
        setError(null);
      } else {
        setError("Invalid data format");
      }
    } catch (error) {
      setError("Error fetching data");
      console.error("❌ Error Fetching Data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFundingRequests();
  }, []);
  
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
    setIdeas((prev) =>
      prev.map((request) =>
        request.fundingrequestid === requestId
          ? { ...request, status: "Approved" }
          : request
      )
    );
  };

  const handleReject = (requestId) => {
    setIdeas((prev) =>
      prev.map((request) =>
        request.fundingrequestid === requestId
          ? { ...request, status: "Rejected" }
          : request
      )
    );
    setIsModalOpen(false);
  };

  const filteredIdeas = ideas;

  return (
    <>
      <Helmet>
        <title>{translations[language].title}</title>
      </Helmet>

      <Header />

      <div className="w-full bg-w_background">
        <div className="mb-[42px]">
          <div className="flex">
            <Sidebar20 />
            <div className="flex flex-1 flex-col items-center px-14 md:px-5">
              <Text
                size="m3_display_small"
                as="p"
                className="text-center text-[36px] font-bold text-gray-800 mt-10 mb-8"
              >
                {translations[language].title}
              </Text>

              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center py-8">{error}</div>
              ) : (
                <>
                  <div className="mt-10 flex flex-wrap justify-center gap-8 w-full max-w-5xl">
                    {filteredIdeas.slice(0, visibleCards).map((request) => (
                      <Card
                        key={request.fundingrequestid}
                        language={language}
                        request={request}
                        onClick={() => {
                          setSelectedRequest(request);
                          setIsModalOpen(true);
                        }}
                      />
                    ))}
                  </div>

                  {filteredIdeas.length === 0 && (
                    <div className="text-gray-600 text-center py-8">
                      {translations[language].noMoreOffers}
                    </div>
                  )}

                  {filteredIdeas.length > visibleCards && (
                    <div className="mt-8 mb-6">
                      <button
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        onClick={loadMore}
                      >
                        {translations[language].loadMore}
                      </button>
                    </div>
                  )}

                  {showNoMoreMessage && (
                    <div className="text-gray-500 mt-4">
                      {translations[language].noMoreOffers}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedRequest && (
        <FundingDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          language={language}
          request={selectedRequest}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}
    </>
  );
}