import { Helmet } from "react-helmet";
import { Heading, Input, Button, Text } from "../../components";
import Header from "../../components/Header";
import Sidebar20 from "components/Sidebar20";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL = 'http://localhost:4000/api';

export default function Page14Page() {
  const location = useLocation();
  const navigate = useNavigate();
  const ideaData = location.state || {};
  
  console.log("البيانات المستلمة من الصفحة السابقة:", ideaData);
  
  const [ideaName, setIdeaName] = useState(ideaData.ideaTitle );
  const [ideaId, setIdeaId] = useState(ideaData.ideaId )
  const [innovator, setInnovator] = useState(ideaData.innovatorName );
  const [inputValue, setInputValue] = useState("");
  const [language, setLanguage] = useState("ar");
  const [fundingRequests, setFundingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const rightAlignedInputStyle = {
    textAlign: 'right',
    direction: 'rtl'
  };

  const lightNavyButtonStyle = {
    backgroundColor: '#4682B4',  
    color: 'white',
    borderRadius: '8px',
    padding: '4px 12px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease'
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    console.log("تحميل البيانات الأولية...");
    console.log("معلومات الفكرة المستلمة:", { ideaId, ideaName, innovator, from: 'location.state' });
    
    loadFundingRequests();
  }, [ideaId]);

  const loadFundingRequests = async () => {
    try {
      console.log("جلب طلبات التمويل...");
      
      const response = await axios.get(`${API_BASE_URL}/fundingoffer_with_ideas`, { timeout: 8000 });
      console.log("تم استلام طلبات التمويل من المسار المخصص:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        let formattedRequests = response.data.map(request => ({
          fundingid: request.fundingid,
          ideaName: request.title || "غير معروف",
          innovator: request.innovator_name || `${request.f_name} ${request.l_name}` || "غير معروف",
          status: getStatusText(request.funding_status),
          date: request.offerdate 
          ? new Date(request.offerdate).toLocaleDateString('en-CA') 
          : "غير محدد",
          dateObj: request.offerdate ? new Date(request.offerdate) : new Date(0),
          moneyoffered: request.moneyoffered || 0
        }));
        
        formattedRequests.sort((a, b) => b.dateObj - a.dateObj);
        
        setFundingRequests(formattedRequests);
        setIsLoading(false);
        return; 
      }
    } catch (error) {
      console.error("خطأ في تحميل طلبات التمويل:", error);
      setError("حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.");
      
      const mockData = [
        { 
          
        },
        { 
          
        },
        { 
         
        }
      ];
      
      mockData.sort((a, b) => b.dateObj - a.dateObj);
      
      setFundingRequests(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusText = (status) => {
    if (!status) return language === "ar" ? "⏳ بانتظار الموافقة" : "⏳ Pending Approval";
    
    status = String(status).toLowerCase();
    if (status === 'accepted' || status === 'مقبول') {
      return language === "ar" ? "✅ مقبول" : "✅ accepted";
    } else if (status === 'rejected' || status === 'مرفوض') {
      return language === "ar" ? "❌ مرفوض" : "❌ Rejected";
    } else {
      return language === "ar" ? "⏳ بانتظار الموافقة" : "⏳ Pending Approval";
    }
  };

  const handleSubmitRequest = async () => {
    if (inputValue.trim() === "") {
      alert(language === "ar" ? "يرجى إدخال مبلغ صحيح" : "Please enter a valid amount");
      return;
    }

    try {
      setIsLoading(true);
      
      const requestData = {
        investorid: 1, 
        innovatorid: parseInt(ideaId), 
        moneyoffered: parseFloat(inputValue),
        status: "Pending",
        offerdate: new Date().toISOString().split('T')[0]
      };

      console.log("إرسال طلب التمويل:", requestData);

      let apiSuccess = false;
      let responseData = null;

      try {
        console.log("بيانات مرسلة:", requestData);  
        const response = await axios.post("/api/fundingoffer", requestData);
        console.log("تم إرسال الطلب بنجاح:", response.data);
        apiSuccess = true;
        responseData = response.data;
      } catch (apiError) {
        console.warn("فشل إرسال الطلب إلى الخادم:", apiError);
      }
      
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      
      const newFundingId = (responseData && responseData.fundingid) ? 
        responseData.fundingid : 
        Date.now(); 
      
      const newRequest = {
        fundingid: newFundingId,
        ideaName: ideaName,
        innovator: innovator,
        status: language === "ar" ? "⏳ بانتظار الموافقة" : "⏳ Pending Approval",
        date: formattedDate,
        dateObj: currentDate,
        moneyoffered: parseFloat(inputValue)
      };
      
      console.log("إضافة طلب جديد إلى القائمة المحلية:", newRequest);
      
      setFundingRequests(prevRequests => [newRequest, ...prevRequests]);
      
      setInputValue("");
      
      if (apiSuccess) {
        setTimeout(() => {
          loadFundingRequests();
        }, 1000);
      } else {
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error("خطأ في معالجة الطلب:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{language === "ar" ? "طلب التمويل - واحة الابتكار" : "Funding Request - Innovation Oasis"}</title>
        <meta name="description" content={language === "ar" ? "قم بتقديم طلب التمويل وتابع حالة طلباتك السابقة." : "Submit a funding request and track the status of your previous applications."} />
      </Helmet>

      <div className="w-full bg-gray-50_01">
        <Header className="mr-3 md:mr-0" />

        <div className="flex items-start">
          <Sidebar20 />
          <div className="mt-[84px] flex flex-1 justify-center px-14 md:px-5">
            <div className="flex w-[94%] flex-col items-center gap-[20px] md:w-full sm:gap-[33px]">
              
              <Heading size="heading9xl" as="h1" className="text-[32px] font-semibold md:text-[28px] sm:text-[30px]">
                {language === "ar" ? "تقديم طلب التمويل" : "Submit Funding Request"}
              </Heading>

              <div className="w-[30%] flex flex-col gap-[10px] self-center rounded-[15px] border border-solid border-indigo-50 bg-white-a700_01 p-[15px] md:w-[80%] sm:w-full">
                <div className="w-full mb-1">
                  <div className="flex justify-end mb-1">
                    <Text className="text-[10px] font-medium">
                      {language === "ar" ? " اسم الفكرة" : "Idea Name:"}
                    </Text>
                  </div>
                  <Input 
                    color="gray_50_02" 
                    size="sm" 
                    shape="round" 
                    value={ideaName} 
                    onChange={(e) => setIdeaName(e.target.value)}
                    className="self-stretch rounded-[8px] border border-solid border-black-900 px-2 py-1 text-right text-xs" 
                    style={rightAlignedInputStyle}
                    readOnly
                  />
                </div>

                <div className="w-full mb-1">
                  <div className="flex justify-end mb-1">
                    <Text className="text-[10px] font-medium">
                      {language === "ar" ? "اسم المبتكر" : "Innovator Name:"}
                    </Text>
                  </div>
                  <Input 
                    color="gray_50_02" 
                    size="sm" 
                    shape="round" 
                    value={innovator} 
                    onChange={(e) => setInnovator(e.target.value)}
                    className="self-stretch rounded-[8px] border border-solid border-black-900 px-2 py-1 text-right text-xs" 
                    style={rightAlignedInputStyle}
                    readOnly
                  />
                </div>

                <div className="w-full mb-1">
                  <div className="flex justify-end mb-1">
                    <Text className="text-[10px] font-medium">
                      {language === "ar" ? "المبلغ المعروض" : "Offered Amount:"}
                    </Text>
                  </div>
                  <Input 
                    color="gray_50_02" 
                    size="sm" 
                    shape="round" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    className="self-stretch rounded-[8px] border border-solid border-black-900 px-2 py-1 text-right text-xs" 
                    type="number"
                    style={rightAlignedInputStyle}
                    placeholder="أدخل المبلغ"
                  />
                </div>
                
                <div className="flex justify-center mt-2">
                  <Button 
                    size="md" 
                    shape="round" 
                    style={lightNavyButtonStyle}
                    onClick={handleSubmitRequest}
                  >
                    {language === "ar" ? "تقديم طلب" : "Submit Request"}
                  </Button>
                </div>
              </div>

              <Heading size="heading4xl" as="h2" className="mt-[35px] text-[18px] font-semibold">
                {language === "ar" ? ":تحديثات حالة الطلبات السابقة" : "Previous Request Updates"}
              </Heading>

              <div className="w-full mt-5 px-5">
                {error && (
                  <div className="text-yellow-600 bg-yellow-50 p-2 mb-3 rounded text-center text-sm">
                    {error}
                  </div>
                )}
                
                {isLoading ? (
                  <div className="text-center p-4">
                    <Text className="text-gray-600">{language === "ar" ? "جارٍ تحميل البيانات..." : "Loading data..."}</Text>
                  </div>
                ) : (
                  <table className="w-full border-collapse border border-gray-300" dir="rtl">
                    <thead>
                      <tr className="bg-[#D0CABB] text-white">
                        <th className="border border-gray-300 px-4 py-2 text-right">{language === "ar" ? "اسم المبتكر" : "Innovator"}</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">{language === "ar" ? "اسم الفكرة" : "Idea Name"}</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">{language === "ar" ? "المبلغ المعروض" : "Offered Amount"}</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">{language === "ar" ? "حالة الطلب" : "Request Status"}</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">{language === "ar" ? "التاريخ" : "Date"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fundingRequests.length > 0 ? (
                        fundingRequests.map((request, index) => (
                          <tr key={`funding-${request.fundingid || index}`} className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-4 py-2 text-right">{request.innovator}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">{request.ideaName}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">{new Intl.NumberFormat('ar-SA').format(request.moneyoffered)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">{request.status}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">{request.date}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                            {language === "ar" ? "لا توجد طلبات تمويل سابقة" : "No previous funding requests"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}