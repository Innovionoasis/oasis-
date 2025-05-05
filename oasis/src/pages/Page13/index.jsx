import { Helmet } from "react-helmet";
import { Heading, Button, Text } from "../../components";
import Sidebar2 from "../../components/Sidebar2";
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
    padding-left: 0.9em;
    display: flex;
    align-items: center;
    border: none;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.2s;
    cursor: pointer;
  }

  button span {
    display: block;
    margin-left: 0.3em;
    transition: all 0.3s ease-in-out;
  }

  button svg {
    display: block;
    transform-origin: center center;
    transition: transform 0.3s ease-in-out;
  }

  button:hover .svg-wrapper {
    animation: fly-1 0.6s ease-in-out infinite alternate;
  }

  button:hover svg {
    transform: translateX(1.2em) rotate(45deg) scale(1.1);
  }

  button:hover span {
    transform: translateX(5em);
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

function Rowtitle({ innovatorName,title, description, details, problems, attachments, onClick , comment}) {
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
      <div className="w-full flex justify-start">
        <Button
          shape="round"
          className="mt-[18px] min-w-[72px] rounded-lg border border-solid border-blue-200 px-[4px]"
          style={{
            background: 'linear-gradient(to right, #f0f8ff, #f5f0e6)',
            color: '#4169E1'
          }}
          onClick={onClick}
        >
          التفاصيل
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
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [comment, setComment] = useState('');
  const [innovator, setInnovator] = useState("null");
  const [mentor, setMentor] = useState("null");
  const [actionMessage, setActionMessage] = useState("");
  const [status, setStatus] = useState("معلق");
  const [idea, setIdea] = useState("null");
  const [requestId, setRequestId] = useState("null");
  const [requestDate, setRequestDate] = useState("null");
  const [mentorName, setMentorName] = useState("null");
  const [innovatorName, setInnovatorName] = useState("null");
  const [ideaTitle, setIdeaTitle] = useState("null");
  const [ideaDescription, setIdeaDescription] = useState("null");
  const [ideaCategory, setIdeaCategory] = useState("null");
  const [ideaProblems, setIdeaProblems] = useState("null");
  const [ideaAttachments, setIdeaAttachments] = useState("null");
  const [ideaId, setIdeaId] = useState("null");
  const [mentorId, setMentorId] = useState("null");
  const [innovatorId, setInnovatorId] = useState("null");

  useEffect(() => {
    setIsLoading(true); 
    axios.get('http://localhost:4000/approvedideas')
      .then(response => {
        console.log("✅ Data received:", response.data);
        setIdeasList(response.data);  
        setIsLoading(false);  
      })
      .catch(error => {
        console.error("❌ هناك خطأ:", error);
        setIsLoading(false);  
      });
  }, []);
  
  const handlePopupOpen = (idea) => {
    setComment('');  
    setSuccessMessage(''); 
    setSubmissionMessage(''); 
    setIsSuccess(null); 
    setSelectedRow(idea); 
    setIsPopupOpen(true); 
  };

  const handlePopupClose = () => {
    setSelectedRow(null);  
    setIsPopupOpen(false);
    setComment('');  
    setSubmissionMessage('');  
    setIsSuccess(null); 
  };

  
  
  const handleSupervisionRequest = () => {
    handleRequestSupervision();
    handlePopupClose();
    navigate("/review-requests");
  };
  
  const handleRequestSupervision = async () => {
    const body = {
      innovatorid: selectedRow.innovatorid,
      mentorid: selectedRow.mentor_id,
      requestdate: new Date().toISOString().split("T")[0],
      status: "معلق",
      ideaid: selectedRow.ideaid,
      comment: comment,    };
  
    console.log("Request body to send:", body);
  
    try {
      const response = await fetch("http://localhost:4000/mentorshiprequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      if (response.ok) {
        console.log("تم إرسال الطلب بنجاح");
      } else {
        console.error("فشل إرسال الطلب");
      }
    } catch (error) {
      console.error("حدث خطأ أثناء إرسال الطلب:", error);
    }
  };
  
  
  
  return ( 
    <>
      <Helmet>
        <title>Rated Ideas - Innovation Oasis</title>
        <meta
          name="description"
          content="Discover inspiring ideas in fields like agriculture, technology, and education. View new and rated ideas that need support to grow."
        />
      </Helmet>
      <Header />
      <div className="flex items-start">
        <Sidebar2 />

        <div className="relative h-[1024px] w-full bg-gray-100_8c">
          <div className="absolute left-0 right-0 top-[2%] mx-20 flex-1 md:mx-0">
            <div className="flex items-start md:flex-col">
              <div className="mt-6 flex flex-1 items-start justify-center md:self-stretch md:px-5 sm:flex-col">
                <div className="mb-3.5 flex flex-col items-end gap-0.5">
                  <Heading size="heading11xl" as="h1" className="text-[48px] font-semibold md:text-[44px] sm:text-[38px] text-right">
                    الأفكار الجديدة
                  </Heading>
                  <Heading size="heading4xl" as="h2" className="mr-8 text-[16px] font-semibold md:mr-0 text-right">
                    أفكار ملهمة تحتاج التوجيه للنمو{" "}
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
                    ideasList.map((review) => (
                      <Rowtitle
                      innovatorName={`${review.f_name} ${review.l_name}`}
                      key={review.ideaid}
                      title={review.title}
                      description={review.category}
                      details={review.description}
                      problems={review.problem}
                      onClick={() => handlePopupOpen(review)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm mx-4 p-6 relative border border-blue-100"
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
  <label className="block mb-2 text-right" style={{ color: '#4169E1' }}>اسم المبتكر</label>
  <input 
    type="text"
    value={selectedRow?.innovator_name || ''}
    readOnly
    className="w-full border rounded p-2 text-right"
    style={{ borderColor: '#b8d0e6', background: 'linear-gradient(to right, #f9f9f9, #f5f0e6)' }}
  />
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
              <label className="block mb-2 text-right" style={{ color: '#4169E1' }}>مجال الفكرة</label>
               <input 
                type="text"
                value={selectedRow.category || ''}
                readOnly
                className="w-full border rounded p-2 text-right"
                style={{ borderColor: '#b8d0e6', background: 'linear-gradient(to right, #f9f9f9, #f5f0e6)' }}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-right" style={{ color: '#4169E1' }}>وصف الفكرة</label>
              <input 
                type="text"
                value={selectedRow.description}
                readOnly
                className="w-full border rounded p-2 text-right"
                style={{ borderColor: '#b8d0e6', background: 'linear-gradient(to right, #f9f9f9, #f5f0e6)' }}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-right" style={{ color: '#4169E1' }}>المشاكل التي تحلها</label>
              <input 
                type="text"
                value={selectedRow.problem || ''}
                readOnly
                className="w-full border rounded p-2 text-right"
                style={{ borderColor: '#b8d0e6', background: 'linear-gradient(to right, #f9f9f9, #f5f0e6)' }}
              />
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

            <div className="mb-4">
  <label className="block mb-2 text-right" style={{ color: '#4169E1' }}> لماذا ترغب في الإشراف؟</label>
  <textarea
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    placeholder="اكتب سبب رغبتك في الإشراف..."
    className="w-full border rounded p-2 h-24 text-right"
    style={{
      borderColor: '#b8d0e6',
      background: 'linear-gradient(to right, #f9f9f9, #f5f0e6)'
    }}
        ></textarea>
    </div>
         
    <div className="mb-4">
              <StyledWrapper>
                <button onClick={handleRequestSupervision} className="w-full" style={{ background: 'linear-gradient(to right, #4169E1, #7b98cc)' }}>
                <div className="svg-wrapper-1">
                <div className="svg-wrapper">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" />
                  </svg>
                    </div>
                 </div>
                    <span>تقديم طلب إشراف</span>
                     </button>

                     {submissionMessage && (
                     <div
                     className={`mt-4 text-center text-sm font-bold ${
                     isSuccess ? "text-green-600" : "text-red-600"
                    }`}
                    >
                   {submissionMessage}
                 </div>
                  )}
              </StyledWrapper>
             </div>
          </div>
        </div>
      )}
    </>
    
  );
}
