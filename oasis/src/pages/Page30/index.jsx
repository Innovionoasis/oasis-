import { Helmet } from "react-helmet";
import { Heading, Button, Text } from "../../components";
import Sidebar20 from "../../components/Sidebar20";
import React, { Suspense, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { X } from 'lucide-react';
import styled from 'styled-components';
import axios from 'axios';

const StyledWrapper = styled.div`
  button {
    font-family: inherit;
    font-size: 20px;
    background: royalblue;
    color: white;
    padding: 0.7em 1em;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.2s;
    cursor: pointer;
  }

  button span {
    display: block;
    transition: all 0.3s ease-in-out;
  }

  button svg {
    display: block;
    margin-left: 8px;
    transform-origin: center center;
    transition: transform 0.3s ease-in-out;
  }

  button:hover .svg-wrapper {
    animation: fly-1 0.6s ease-in-out infinite alternate;
  }

  button:hover svg {
    transform: translateX(0.5em) rotate(45deg) scale(1.1);
  }

  button:hover span {
    transform: translateX(0);
  }

  button:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(65, 105, 225, 0.3);
  }

  button:active {
    transform: scale(0.95);
  }

  @keyframes fly-1 {
    from {
      transform: translateY(0.1em);
    }

    to {
      transform: translateY(-0.1em);
    }
  }
`;

function Rowtitle({ title, description, details, problems, innovator_name, onClick, onFundingClick }) {
  return (
    <div className="w-[300px] h-[220px] flex flex-col items-end rounded-lg border border-solid border-blue-100 px-4 py-3 shadow-md mb-4" 
      style={{
        background: 'linear-gradient(135deg, #e6f2ff 0%, #f5f0e6 100%)',
        boxShadow: '0 4px 15px rgba(70, 130, 180, 0.1)'
      }}>
      <Heading
        size="heading"
        as="h4"
        className="mt-1.5 text-[22px] font-semibold tracking-[-0.48px] !text-gray-900 md:text-[20px]"
      >
        {title}
      </Heading>
      <Text
        size="body_base"
        as="p"
        className="text-right w-full text-[14px] font-normal leading-[140%] !text-gray-600_07"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      
      <div className="w-full flex justify-between mt-12 mb-2">
        <Button
          shape="round"
          className="rounded-lg border border-solid border-blue-200 px-[4px]"
          style={{
            background: 'linear-gradient(to right, #f0f8ff, #f5f0e6)',
            color: '#4169E1'
          }}
          onClick={onClick}
        >
          التفاصيل
        </Button>
        <Button
          shape="round"
          className="rounded-lg border border-solid border-blue-200 px-[4px]"
          style={{
            background: 'linear-gradient(to right, #e6f2ff, #f0f8ff)',
            color: '#4169E1'
          }}
          onClick={() => onFundingClick()}
        >
          قدم طلب تمويل
        </Button>
      </div>
    </div>
  );
}

export default function Page13Page() {
  const [searchBarValue13, setSearchBarValue13] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [ideasList, setIdeasList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const parseAttachments = (attachmentsStr) => {
    if (!attachmentsStr || attachmentsStr === '[null]' || attachmentsStr === 'null') {
      return [];
    }
    
    try {
      const strValue = typeof attachmentsStr === 'string' ? attachmentsStr : String(attachmentsStr);
      
      if (strValue.startsWith('[') || strValue.startsWith('{')) {
        const parsed = JSON.parse(strValue);
        if (parsed === null || (Array.isArray(parsed) && parsed.every(item => item === null))) {
          return [];
        }
        return parsed;
      }
      
      if (strValue.startsWith('http')) {
        return [{ 
          name: strValue.split('/').pop() || 'ملف مرفق', 
          url: strValue 
        }];
      }
      
      return [];
    } catch (e) {
      console.error("❌ خطأ في معالجة المرفقات:", e);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        console.log("🔍 جاري طلب البيانات من API...");
        const response = await axios.get('http://localhost:4000/approvedideas');
        console.log("✅ تم استلام البيانات من API:", response.status);
        
        if (!response.data) {
          console.error("❌ لا توجد بيانات في الاستجابة");
          setIdeasList([]);
          setIsLoading(false);
          return;
        }
        
        if (!Array.isArray(response.data)) {
          console.error("❌ البيانات المستلمة ليست مصفوفة:", response.data);
          setIdeasList([]);
          setIsLoading(false);
          return;
        }
        
        console.log("📋 عدد الأفكار المستلمة:", response.data.length);
        
        const transformedData = response.data.map(item => ({
          ideaid: item.ideaid,
          title: item.title || "فكرة بدون عنوان",
          description: item.description || "",
          category: item.category || "",
          innovator_name: item.innovator_name || "غير معروف",
          problems: item.problem || "", 
          attachments: parseAttachments(item.attachments),
          innovatorid: item.innovatorid
        }));
        
        console.log("🚀 الأفكار بعد التحويل:", transformedData.length);
        setIdeasList(transformedData);
      } catch (error) {
        console.error("❌ هناك خطأ في جلب الأفكار:", error);
        if (error.response) {
          console.error("❌ حالة الخطأ:", error.response.status);
          console.error("❌ نص الخطأ:", error.response.data);
        } else if (error.request) {
          console.error("❌ لم يتم استلام استجابة من السيرفر");
        } else {
          console.error("❌ خطأ في إعداد الطلب:", error.message);
        }
        setIdeasList([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handlePopupOpen = (idea) => {
    setSelectedRow(idea);
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setSelectedRow(null);
    setIsPopupOpen(false);
  };

  const handleChatNavigate = () => {
    handlePopupClose();
    setTimeout(() => {
      const chatData = {
        recipientName: selectedRow?.title,
        initialMessage: `مرحباً، أود التحدث معك حول "${selectedRow?.title}"`,
        details: selectedRow?.description,
        chatId: `chat_with_${selectedRow?.title}_${Date.now()}`,
      };
      navigate("/chat", { state: chatData, replace: true });
    }, 100);
  };

  const handleFundingRequest = (idea) => {
    try {
      console.log("⚡ تم النقر على زر طلب التمويل", idea);
      
      const fundingData = {
        ideaId: idea.ideaid,
        ideaTitle: idea.title,
        innovatorName: idea.innovator_name || "غير معروف",
        innovatorId: idea.innovatorid,
        rating: 0 
      };
      
      console.log("💰 بيانات الفكرة للتمويل:", fundingData);
      
      navigate("/Page14", { 
        state: fundingData
      });
      
      console.log("✅ تم إرسال طلب الانتقال إلى صفحة التمويل");
      
    } catch (error) {
      console.error("❌ خطأ في الانتقال إلى صفحة التمويل:", error);
      alert("حدث خطأ في الانتقال إلى صفحة طلب التمويل. يرجى المحاولة مرة أخرى.");
    }
  };

  return ( 
    <>
      <Helmet>
        <title>Rated Ideas - Innovation Oasis</title>
        <meta
          name="description"
          content="Discover inspiring ideas in fields like agriculture, technology, and education. View rated ideas that need support to grow."
        />
      </Helmet>
      <Header />

      <div className="flex items-start">
        <Sidebar20 />
        <div className="relative h-[1024px] w-full bg-gray-100_8c">
          <div className="absolute left-0 right-0 top-[2%] mx-20 flex-1 md:mx-0">
            <div className="flex items-start md:flex-col">
              <div className="mt-6 flex flex-1 items-start justify-center md:self-stretch md:px-5 sm:flex-col">
                <div className="mb-3.5 flex flex-col items-end gap-0.5">
                  <Heading size="heading11xl" as="h1" className="text-[48px] font-semibold md:text-[44px] sm:text-[38px] text-right">
                    الأفكار المقيمة
                  </Heading>
                  <Heading size="heading4xl" as="h2" className="mr-8 text-[16px] font-semibold md:mr-0 text-right">
                    أفكار ملهمة تحتاج التمويل للنمو{" "}
                  </Heading>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-[180px] left-0 right-0 mx-auto flex-1 px-[26px] sm:px-5">
            {isLoading ? (
              <p className="text-center text-xl text-gray-600">جارٍ تحميل البيانات...</p>
            ) : (
              <div className="ml-[70px] flex flex-wrap gap-6 md:ml-0">
                <Suspense fallback={<div>Loading feed...</div>}>
                  {ideasList.length > 0 ? (
                    ideasList.map((idea) => (
                      <Rowtitle
                        key={idea.ideaid}
                        title={idea.title}
                        description={idea.category}
                        details={idea.description}
                        problems={idea.problems}
                        innovator_name={idea.innovator_name}
                        onClick={() => handlePopupOpen(idea)}
                        onFundingClick={() => handleFundingRequest(idea)}
                      />
                    ))
                  ) : (
                    <p className="text-center text-xl text-gray-600">لا توجد أفكار متاحة في الوقت الحالي</p>
                  )}
                </Suspense>
              </div>
            )}
          </div>
        </div>
      </div>

      {isPopupOpen && selectedRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] overflow-auto py-8">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 p-6 relative border border-blue-100 max-h-[90vh] overflow-y-auto"
            style={{
              background: 'linear-gradient(165deg, #f5f0e6 0%, #e6f2ff 100%)',
              boxShadow: '0 10px 25px rgba(70, 130, 180, 0.15)'
            }}>
            <div className="flex justify-between items-center mb-6">
              <button onClick={handlePopupClose} className="text-gray-600 hover:text-gray-900 absolute top-4 left-4">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold w-full text-center" style={{ color: '#4169E1' }}>
                تفاصيل الفكرة
              </h2>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-right" style={{ color: '#4169E1' }}>عنوان الفكرة</label>
              <input
                type="text"
                value={selectedRow.title}
                readOnly
                className="w-full border rounded p-2 text-right"
                style={{ borderColor: '#b8d0e6', background: 'linear-gradient(to right, #f9f9f9, #f5f0e6)' }}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-right" style={{ color: '#4169E1' }}>اسم المبتكر</label>
              <input
                type="text"
                value={selectedRow.innovator_name || "غير معروف"}
                readOnly
                className="w-full border rounded p-2 text-right"
                style={{ borderColor: '#b8d0e6', background: 'linear-gradient(to right, #f9f9f9, #f5f0e6)' }}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-right" style={{ color: '#4169E1' }}>مجال الفكرة</label>
              <textarea
                value={selectedRow.category || ''}
                readOnly
                className="w-full border rounded p-2 text-right"
                style={{ borderColor: '#b8d0e6', background: 'linear-gradient(to right, #f9f9f9, #f5f0e6)' }}
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-right" style={{ color: '#4169E1' }}>وصف الفكرة</label>
              <textarea
                value={selectedRow.description}
                readOnly
                className="w-full border rounded p-2 h-24 text-right"
                style={{ borderColor: '#b8d0e6', background: 'linear-gradient(to right, #f9f9f9, #f5f0e6)' }}
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-right" style={{ color: '#4169E1' }}>المشاكل التي تحلها</label>
              <textarea
                value={selectedRow.problems || ''}
                readOnly
                className="w-full border rounded p-2 h-24 text-right"
                style={{ borderColor: '#b8d0e6', background: 'linear-gradient(to right, #f9f9f9, #f5f0e6)' }}
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-right" style={{ color: '#4169E1' }}>المرفقات</label>
              <div className="w-full border rounded p-2 text-right" 
                style={{ 
                  borderColor: '#b8d0e6',
                  background: 'linear-gradient(to right, #f0f8ff, #f5f0e6)'
                }}>
                {selectedRow.attachments && selectedRow.attachments.length > 0 ? (
                  <ul>
                    {selectedRow.attachments.map((file, index) => (
                      <li key={index} className="text-blue-600 hover:underline cursor-pointer">
                        <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">لا توجد مرفقات</p>
                )}
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <StyledWrapper className="w-full max-w-xs">
                <button onClick={handleChatNavigate} className="w-full" style={{ background: 'linear-gradient(to right, #4169E1, #7b98cc)' }}>
                  <span>مراسلة</span>
                  <div className="svg-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" />
                    </svg>
                  </div>      
                </button>
              </StyledWrapper>
            </div>
          </div>
        </div>
      )}
        
    </>
  );
}