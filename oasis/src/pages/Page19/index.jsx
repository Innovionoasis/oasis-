import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import Sidebar3 from "../../components/Sidebar3";
import Header from "../../components/Header";
import axios from 'axios'; 

const FundingRequestPage = () => {
  const [selectedFileType, setSelectedFileType] = useState('الكل');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIdea, setCurrentIdea] = useState(null);
  const [ideaTitle, setIdeaTitle] = useState("");
  const [investors, setInvestors] = useState([]);
  const [innovators, setInnovators] = useState([]);
  const [selectedIdeaTitle, setSelectedIdeaTitle] = useState('');

  const [fundingRequestForm, setFundingRequestForm] = useState({
    investorid: "",
    innovator_name: "",
    innovatorid: null,
    requiredamount: "",
    reason: ""
  });

  const [ideas, setIdeas] = useState([]);

  const [previousRequests, setPreviousRequests] = useState([]);

  
  useEffect(() => {
    axios.get("http://localhost:4000/api/investor")
    .then(res => setInvestors(res.data))
    .catch(err => console.error("Error fetching investors:", err));
  }, []);
  
  useEffect(() => {
    axios.get("http://localhost:4000/api/innovator")
    .then(res => setInnovators(res.data))
    .catch(err => console.error("Error fetching innovators:", err));
  }, []);

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
          fundingStatus: "متاح للتمويل",
          canSubmitFundingRequest: true,
          attachments: item.attachments || []
        }));
        
        console.log("Formatted ideas:", formattedIdeas);
        setIdeas(formattedIdeas);
      })
      .catch(err => console.error('Error fetching approved ideas:', err));
  };

const fetchPreviousFundingRequests = async () => {
  try {
    const res = await axios.get("http://localhost:4000/api/fundingrequest");
    const ideasRes = await axios.get("http://localhost:4000/approvedideas");
     
    const currentIdeas = ideasRes.data.map(item => ({
      ideaid: item.ideaid,
      title: item.title
    }));
    
    const formattedRequests = res.data.map(request => {
      const investorObj = investors.find(inv => inv.investorid === request.investorid);
      const investorName = investorObj ? `${investorObj.f_name} ${investorObj.l_name}` : 'غير معروف';
      
      const innovatorObj = innovators.find(i => i.innovatorid === request.innovatorid);
      const innovatorName = innovatorObj ? `${innovatorObj.f_name} ${innovatorObj.l_name}` : 'غير معروف';
      
      const ideaObj = currentIdeas.find(idea => idea.ideaid === request.ideaid);
      const ideaTitle = ideaObj ? ideaObj.title : 'غير معروف';
      
      return {
        fundingrequest_id: request.fundingrequest_id,
        investor_name: investorName,
        innovator_name: innovatorName,
        title: ideaTitle,
        requiredamount: request.requiredamount,
        reason: request.reason,
        status: request.status || 'قيد المراجعة'
      };
    });
    
    setPreviousRequests(formattedRequests);
  } catch (error) {
    console.error("❌ فشل في تحميل طلبات التمويل السابقة:", error);
  }
};

useEffect(() => {
  fetchApprovedIdeas();
  fetchPreviousFundingRequests();

  const handleStorageChange = () => {
    fetchApprovedIdeas();
    fetchPreviousFundingRequests();
  };

  window.addEventListener('storage', handleStorageChange);
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}, [investors, innovators]); 
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

  const openFundingRequestModal = (idea) => {
    console.log("Selected idea object:", idea);
  
    const ideaId = idea.ideaid;
    console.log("Using ideaid:", ideaId);
  
    setCurrentIdea(idea);
    setIdeaTitle(idea.title || idea.ideaName || "");
  
    setFundingRequestForm(prev => ({
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
  
      setFundingRequestForm(prev => ({
        ...prev,
        innovator_name: value,
        innovatorid: matched?.innovatorid || null
      }));
    }
    else if (name === "investorid") {
      setFundingRequestForm(prev => ({
        ...prev,
        investorid: value
      }));
    }
    else {
      setFundingRequestForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const submitFundingRequest = async () => {
    const { investorid, innovatorid, requiredamount, reason } = fundingRequestForm;
    
    const ideaid = fundingRequestForm.ideaid || currentIdea?.ideaid;

    const submissiondate = new Date().toISOString().split('T')[0]; 
    
    if (!investorid || !innovatorid || !requiredamount || !reason || !ideaid) {
      alert("يرجى تعبئة جميع الحقول");
      return;
    }
  
    const requestData = {
      investorid,
      innovatorid,
      requiredamount,
      reason,
      ideaid,
      submissiondate,
      status: "قيد المراجعة"
    };
    
    console.log("🚀 Sending funding request data:", requestData);
    
    try {
      const res = await axios.post("http://localhost:4000/fundingrequest", requestData);

      if (res.status === 200 || res.status === 201) {
        alert("✅ تم إرسال طلب التمويل بنجاح!");
        const selectedInvestor = investors.find(investor => investor.investorid === investorid);
        const investorName = selectedInvestor ? `${selectedInvestor.f_name} ${selectedInvestor.l_name}` : "غير معروف";
        
        const selectedInnovator = innovators.find(innovator => innovator.innovatorid === innovatorid);
        const innovatorName = selectedInnovator ? `${selectedInnovator.f_name} ${selectedInnovator.l_name}` : "غير معروف";
        
        const newRequest = {
          fundingrequest_id: res.data.fundingrequest_id || `temp-${Date.now()}`,
          investor_name: investorName,
          innovator_name: innovatorName,
          title: ideaTitle,
          requiredamount: requiredamount,
          reason: reason,
          status: 'قيد المراجعة'
        };
        
        setPreviousRequests(prevRequests => [newRequest, ...prevRequests]);
  
        setIsModalOpen(false);
        setFundingRequestForm({
          investorid: "",
          innovator_name: "",
          innovatorid: null,
          requiredamount: "",
          reason: ""
        });
        setCurrentIdea(null);
        
        fetchPreviousFundingRequests();
      } else {
        alert(`❌ فشل في إرسال الطلب: ${res.data.error || 'خطأ غير معروف'}`);
      }
    } catch (error) {
      console.error("❌ خطأ في إرسال طلب التمويل:", error);
      const errorMessage = error.response?.data?.error || error.message || "حدث خطأ أثناء الإرسال";
      alert(errorMessage);
    }
  };
      
  return (
    <>  
      <Helmet>
        <title>Innovation Oasis - طلب تمويل</title>
      </Helmet>
      <div className="min-h-screen bg-gray-100 font-sans" dir="rtl">
        <Header />
        <div className="flex flex-row-reverse"> 
          <Sidebar3 />

          <div className="flex-1 p-6">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
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
                                onClick={() => openFundingRequestModal(idea)}
                                disabled={!idea.canSubmitFundingRequest}
                                className={`
                                  px-4 py-2 rounded-md transition 
                                  ${idea.canSubmitFundingRequest 
                                    ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  }
                                `}
                              >
                                طلب تمويل
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
                                  ${idea.canSubmitFundingRequest 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                  }
                                `}
                              >
                                {idea.fundingStatus || "متاح للتمويل"}
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
                            لا توجد أفكار متاحة للتمويل حاليًا. يرجى تقديم فكرة جديدة أولاً.
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
                  <h1 className="text-2xl font-bold mb-6 text-gray-800">حالة طلبات التمويل السابقة</h1>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المستثمر</th>
                          <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبتكر</th>
                          <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم الفكرة</th>
                          <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ المطلوب</th>
                          <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سبب الطلب</th>
                          <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {previousRequests.map((row, index) => (
                          <tr key={row.fundingrequest_id || `request-${index}`} className="hover:bg-gray-50 transition">
                            <td className="p-3 text-gray-600">{row.investor_name}</td>
                            <td className="p-3 text-gray-600">{row.innovator_name}</td>
                            <td className="p-3 text-gray-600">{row.title || '—'}</td>
                            <td className="p-3 text-gray-600">{row.requiredamount} ريال</td>
                            <td className="p-3 text-gray-600">{row.reason}</td>
                            <td className="p-3">
                              {row.status === 'مقبول' || row.status === 'Approved' ? (
                                <span className="text-green-500">✓ تمت الموافقة</span>
                              ) : row.status === 'مرفوض' || row.status === 'Rejected' ? (
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
              <h2 className="text-2xl font-bold w-full text-center">نموذج طلب تمويل</h2>
            </div>

            <div className="mt-6">
              <div className="mb-4">
                <label className="block mb-2 text-right">اختيار مستثمر</label>
                <select
                  name="investorid"
                  value={fundingRequestForm.investorid}
                  onChange={handleFormChange}
                  className="w-full border rounded p-2 text-right"
                >
                  <option value="">اختر مستثمر</option>
                  {investors.map((investor) => (
                    <option key={investor.investorid} value={investor.investorid}>
                      {investor.f_name} {investor.l_name} - {investor.specialization || ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">اسم المستخدم:</label>
                <input
                  type="text"
                  name="innovator_name"
                  value={fundingRequestForm.innovator_name}
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

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">المبلغ المطلوب (ريال):</label>
                <input
                  type="number"
                  name="requiredamount"
                  value={fundingRequestForm.requiredamount}
                  onChange={handleFormChange}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-200 transition"
                  placeholder="أدخل المبلغ المطلوب"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">سبب طلب التمويل:</label>
                <textarea
                  name="reason"
                  placeholder="اذكر سبب طلب التمويل"
                  value={fundingRequestForm.reason}
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
                  onClick={submitFundingRequest}
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

export default FundingRequestPage;