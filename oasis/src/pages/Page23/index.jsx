import { Helmet } from "react-helmet";
import { Heading, Button } from "../../components";
import Header from "../../components/Header";
import Sidebar3 from "../../components/Sidebar3";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, Globe, X } from "lucide-react";
import axios from 'axios';

export default function ContractsPage() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [visibleContracts, setVisibleContracts] = useState(3);
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("ar");
  const [selectedContract, setSelectedContract] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get('http://localhost:4000/api/contract')
      .then(response => {
        console.log("✅ Contracts data received:", response.data);
        setContracts(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("❌ Error fetching contracts:", error);
        setError(error.message || 'حدث خطأ أثناء جلب البيانات');
        setIsLoading(false);
      });
  }, []);

  const handleLanguageToggle = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const handleViewContract = (contractId) => {
    const contract = contracts.find(c => c.contractid === contractId);
    if (contract) {
      setSelectedContract(contract);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedContract(null);
  };

  const handleLoadMore = () => {
    setVisibleContracts(prev => prev + 3);
  };

  const getContractStatus = (status) => {
    if (!status) return "غير محدد";
    switch (status.toLowerCase()) {
      case "active":
      case "approved":
      case "completed":
        return "مكتمل";
      case "pending":
      case "in_review":
        return "بانتظار التوقيع";
      case "rejected":
      case "declined":
        return "مرفوض";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-700";
    switch (status.toLowerCase()) {
      case "active":
      case "approved":
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
      case "in_review":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
      case "declined":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <Helmet>
        <title>{language === "ar" ? "إدارة العقود - واحة الابتكار" : "Contracts Management - Innovation Oasis"}</title>
      </Helmet>

      <div className="w-full bg-gray-50_01">
        <Header className="mr-3 md:mr-0" />


        <div className="flex items-start">
          <Sidebar3 />
          <div className="mt-[84px] flex flex-1 flex-col items-center px-14 md:px-5">

            <Heading size="heading9xl" as="h1" className="text-[32px] font-semibold text-center">
              {language === "ar" ? "إدارة العقود" : "Contracts Management"}
            </Heading>

            {isLoading ? (
              <div className="w-full text-center mt-8">
                <p className="text-xl text-gray-600">{language === "ar" ? "جارٍ تحميل البيانات..." : "Loading data..."}</p>
              </div>
            ) : error ? (
              <div className="w-full text-center mt-8">
                <p className="text-xl text-red-600">{error}</p>
                <Button 
                  size="md" 
                  shape="round"
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition cursor-pointer"
                >
                  {language === "ar" ? "إعادة المحاولة" : "Try Again"}
                </Button>
              </div>
            ) : (
              <>
                {contracts.length > 0 ? (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {contracts.slice(0, visibleContracts).map((contract) => (
                      <div 
                        key={contract.contractid} 
                        className={`bg-white shadow-lg border border-gray-300 p-6 rounded-lg flex flex-col text-right transition-all duration-300 
                          ${hoveredCard === contract.contractid ? 'scale-105 shadow-xl' : ''}`}
                        onMouseEnter={() => setHoveredCard(contract.contractid)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <h2 className="text-xl font-semibold text-gray-800 self-end">{contract.ideaname}</h2>
                        <p className="text-gray-600 mt-1 self-end">{language === "ar" ? "المستثمر: " : "Investor: "} {contract.investor_name}</p>
                        <div className="flex flex-col items-end mt-2">
                          <p className="text-gray-600">{language === "ar" ? "قيمة التمويل: " : "Funding: "} {contract.fundingamount} ريال</p>
                          <p className={`mt-1 px-3 py-1 rounded-full text-sm ${getStatusColor(contract.status)}`}>
                            {getContractStatus(contract.status)}
                          </p>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <Button 
                            size="sm" 
                            shape="round" 
                            className="text-gray-700 border border-gray-300 px-3 py-1 rounded-md text-sm hover:bg-gray-100 transition cursor-pointer"
                            onClick={() => handleViewContract(contract.contractid)}
                          >
                            {language === "ar" ? "عرض العقد" : "View Contract"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full text-center mt-8">
                    <p className="text-xl text-gray-600">{language === "ar" ? "لا توجد عقود متاحة في الوقت الحالي" : "No contracts available at the moment"}</p>
                  </div>
                )}

                {visibleContracts < contracts.length && (
                  <Button 
                    size="xl" 
                    shape="round" 
                    onClick={handleLoadMore}
                    className="mt-6 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition cursor-pointer"
                  >
                    {language === "ar" ? "عرض المزيد" : "Load More"}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showModal && selectedContract && (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto opacity-100" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center border-b px-6 py-4">
        <h3 className="text-xl font-bold text-gray-800">
          {language === "ar" ? "تفاصيل العقد" : "Contract Details"}
        </h3>
        <button 
          onClick={closeModal}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="px-6 py-4">
        <div className="mb-4 pb-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-700">
            {language === "ar" ? "معلومات أساسية" : "Basic Information"}
          </h4>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">
                {language === "ar" ? "اسم المشروع" : "Project Name"}
              </p>
              <p className="font-medium">{selectedContract.ideaname}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {language === "ar" ? "رقم العقد" : "Contract ID"}
              </p>
              <p className="font-medium">#{selectedContract.contractid}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {language === "ar" ? "اسم المستثمر" : "Investor Name"}
              </p>
              <p className="font-medium">{selectedContract.investor_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {language === "ar" ? "قيمة التمويل" : "Funding Amount"}
              </p>
              <p className="font-medium">{selectedContract.fundingamount} ريال</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {language === "ar" ? "الحالة" : "Status"}
              </p>
              <p className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(selectedContract.status)}`}>
                {getContractStatus(selectedContract.status)}
              </p>
            </div>
            {selectedContract.start_date && (
              <div>
                <p className="text-sm text-gray-500">
                  {language === "ar" ? "تاريخ البدء" : "Start Date"}
                </p>
                <p className="font-medium">{new Date(selectedContract.start_date).toLocaleDateString()}</p>
              </div>
            )}
            {selectedContract.end_date && (
              <div>
                <p className="text-sm text-gray-500">
                  {language === "ar" ? "تاريخ الانتهاء" : "End Date"}
                </p>
                <p className="font-medium">{new Date(selectedContract.end_date).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>

        {selectedContract.terms && (
          <div className="mb-4 pb-4 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-700">
              {language === "ar" ? "شروط العقد" : "Contract Terms"}
            </h4>
            <p className="mt-2 text-gray-600 whitespace-pre-line">{selectedContract.terms}</p>
          </div>
        )}

        {selectedContract.notes && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-700">
              {language === "ar" ? "ملاحظات" : "Notes"}
            </h4>
            <p className="mt-2 text-gray-600">{selectedContract.notes}</p>
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
        <Button 
          size="md" 
          shape="round"
          onClick={closeModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          {language === "ar" ? "إغلاق" : "Close"}
        </Button>
      </div>
    </div>
  </div>
)}

    </>
  );
}