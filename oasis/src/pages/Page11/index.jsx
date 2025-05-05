import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Globe, ChevronDown, Paperclip, X, Bell, Search, Send, Layers } from 'lucide-react';
import Sidebar3 from "../../components/Sidebar3";
import { Link } from 'react-router-dom';
import { Img, Heading } from "../../components";
import axios from 'axios';

export function CustomHeader({ ...props }) {
  return (
    <header {...props} className="relative w-full bg-gray-50_01">
      <div className="relative h-[98px] w-full">
        <Heading
          size="text7xl"
          as="p"
          className="absolute bottom-[27px] left-[14%] m-auto text-[22.47px] font-medium !text-blue_gray-800"
        >
        </Heading>
        
        <Img
          src="images/img_rectangle_6717.png"
          alt="Image"
          className="absolute bottom-0 right-px m-auto h-[30px] w-[90%] rounded-tl-md rounded-tr-md object-contain"
        />
        
        <div className="absolute left-0 top-0 m-auto h-[92px] w-[10%] content-center md:h-auto">
          <Img
            src="images/img_img_4360_1.png"
            alt="Img4360one"
            className="h-[92px] w-full flex-1 rounded-[32px] object-cover"
          />
          <Heading
            size="headingxl"
            as="p"
            className="absolute bottom-[0.50px] left-10 m-auto text-[13px] font-bold !text-blue_gray-500_02"
          >
            Innovation Oasis
          </Heading>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 flex items-center gap-4 p-5">
        <div className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group cursor-pointer">
          <Globe size={18} className="group-hover:rotate-12 transition-transform" />
          <span>English</span>
        </div>
        
        
      </div>
    </header>
  );
}

function NewIdeaForm({ onSubmit, isLoading }) {
  const [ideaData, setIdeaData] = useState({
    ideaTitle: "",
    ideaDescription: "",
    submissionDate: new Date().toISOString().split('T')[0],
    ideaStatus: "قيد النظر",
    ideaCategory: "",
    customCategoryText: "",
    problemStatement: "",
    wasShared: true,
    attachmentsList: []
  });
  
  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputElement = useRef(null);
  const categoryOptions = ['الريادة', 'التقنية', 'التعليم', 'عرض المبادرات', 'أخرى'];

  const updateIdeaData = (e) => {
    const { name, value, type, checked } = e.target;
    setIdeaData({
      ...ideaData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files);
    setAttachedFiles([...attachedFiles, ...files]);
  };

  const deleteFile = (index) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const submitIdeaForm = async (e) => {
    e.preventDefault();
    
    const finalCategory = ideaData.ideaCategory === 'أخرى' ? ideaData.customCategoryText : ideaData.ideaCategory;
    
    const submissionData = {
      title: ideaData.ideaTitle,
      description: ideaData.ideaDescription,
      problem: ideaData.problemStatement,
      category: finalCategory,
      shared: ideaData.wasShared ? 'نعم' : 'لا',
      status: 'قيد النظر',
      files: attachedFiles
    };
    
    await onSubmit(submissionData);
    
    setIdeaData({
      ideaTitle: "",
      ideaDescription: "",
      submissionDate: new Date().toISOString().split('T')[0],
      ideaStatus: "قيد النظر",
      ideaCategory: "",
      customCategoryText: "",
      problemStatement: "",
      wasShared: true,
      attachmentsList: []
    });
    setAttachedFiles([]);
  };

  return (
    <form onSubmit={submitIdeaForm} dir="rtl" className="space-y-6">
      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2 text-right after:content-['*'] after:text-red-500 after:mr-1">
          عنوان الفكرة
        </label>
        <input
          type="text"
          name="ideaTitle"
          value={ideaData.ideaTitle}
          onChange={updateIdeaData}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all duration-300 ease-in-out placeholder-gray-400"
          placeholder="أدخل عنوان فكرتك بشكل مختصر ومميز"
          maxLength="30"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2 text-right after:content-['*'] after:text-red-500 after:mr-1">
          وصف الفكرة
        </label>
        <textarea
          name="ideaDescription"
          value={ideaData.ideaDescription}
          onChange={updateIdeaData}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-200 transition-all duration-300 ease-in-out placeholder-gray-400 resize-y"
          placeholder="اشرح فكرتك بتفصيل، ما هي الابتكار والقيمة المضافة؟"
          maxLength="100"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2 text-right after:content-['*'] after:text-red-500 after:mr-1">
          المشاكل التي تحلها هذه الفكرة
        </label>
        <textarea
          name="problemStatement"
          value={ideaData.problemStatement}
          onChange={updateIdeaData}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-200 transition-all duration-300 ease-in-out placeholder-gray-400 resize-y"
          placeholder="حدد المشكلة الرئيسية التي ستساعد فكرتك في حلها"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2 text-right after:content-['*'] after:text-red-500 after:mr-1">
          هل قمت بمشاركة هذه الفكرة من قبل؟
        </label>
        <div className="flex items-center justify-start space-x-4 space-x-reverse">
          <div className="flex items-center">
            <input
              type="radio"
              id="not-shared"
              name="wasShared"
              checked={!ideaData.wasShared}
              onChange={() => setIdeaData({...ideaData, wasShared: false})}
              className="ml-2 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="not-shared" className="text-sm text-gray-700">لا</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="was-shared"
              name="wasShared"
              checked={ideaData.wasShared}
              onChange={() => setIdeaData({...ideaData, wasShared: true})}
              className="ml-2 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="was-shared" className="text-sm text-gray-700">نعم</label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2 text-right after:content-['*'] after:text-red-500 after:mr-1">
          مجال الفكرة
        </label>
        <select 
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all duration-300 ease-in-out bg-white" 
          name="ideaCategory"
          value={ideaData.ideaCategory} 
          onChange={updateIdeaData}
          required
        >
          <option value="">اختر مجال الفكرة</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {ideaData.ideaCategory === 'أخرى' && (
          <input
            type="text"
            name="customCategoryText"
            value={ideaData.customCategoryText}
            onChange={updateIdeaData}
            className="w-full px-4 py-2.5 mt-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all duration-300 ease-in-out"
            placeholder="أدخل مجال الفكرة"
            required
          />
        )}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2 text-right">
          المرفقات (اختياري)
        </label>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => fileInputElement.current?.click()}
            className="flex items-center px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-300 group"
          >
            <Paperclip size={18} className="ml-2 text-blue-500 group-hover:rotate-12 transition-transform" />
            إضافة مرفقات
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          يمكنك إرفاق مستندات داعمة بصيغ (DOCX)، (Word)، أو (PDF)
        </p>        
        <input
          type="file"
          ref={fileInputElement}
          onChange={handleFileSelection}
          className="hidden"
          multiple
        />

        {attachedFiles.length > 0 && (
          <ul className="mt-3 space-y-1">
            {attachedFiles.map((file, index) => (
              <li key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                <span>{file.name}</span>
                <button type="button" onClick={() => deleteFile(index)} className="text-red-500 hover:text-red-700">
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <button 
        type="submit" 
        className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 ease-in-out transform hover:scale-[1.01] shadow-lg hover:shadow-xl flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <span>جاري الإرسال...</span>
        ) : (
          <>
            <Send size={20} className="ml-3 transition-transform group-hover:rotate-12" />
            إرسال الفكرة
          </>
        )}
      </button>
    </form>
  );
}

function IdeasSubmissionPage() {
  const [isNewIdeaOpen, setIsNewIdeaOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showIdeaDetails, setShowIdeaDetails] = useState(false);
  
  const [submittedIdeasList, setSubmittedIdeasList] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const API_BASE_URL = 'http://localhost:4000';
  const API_IDEAS_URL = 'http://localhost:4000/api/idea';

  useEffect(() => {
    axios.defaults.baseURL = API_BASE_URL;
  }, []);

  useEffect(() => {
    fetchAllIdeas();
  }, []);

  const fetchAllIdeas = async () => {
    try {
      setIsProcessing(true);
      const response = await axios.get('/api/idea');
      
      const ideas = response.data.map(item => ({
        _id: item.ideaid,
        title: item.title,
        description: item.description,
        problem: item.problem,
        category: item.category,
        shared: item.shared === 'نعم',
        status: item.status || 'قيد النظر',
        statusColor: 'text-amber-500',
        date: item.submissiondate || new Date().toLocaleDateString('ar-SA'),
        attachments: parseAttachments(item.attachments)
      }));
  
      setSubmittedIdeasList(ideas);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      setErrorMsg('حدث خطأ أثناء جلب الأفكار');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const parseAttachments = (attachments) => {
    if (!attachments) return [];
    
    try {
      return typeof attachments === 'string' ? 
        JSON.parse(attachments) : 
        attachments;
    } catch {
      return [];
    }
  };

  const uploadFiles = async (files) => {
    try {
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('files', file);
      });
      
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.fileUrls || [];
    } catch (error) {
      console.error('Error uploading files:', error);
      throw new Error('فشل في رفع الملفات');
    }
  };

  const handleIdeaSubmission = async (submissionData) => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
      const innovatorId = localStorage.getItem('userId') || '';
      const userRole = localStorage.getItem('userRole') || 'innovator';
      const email = localStorage.getItem('userEmail') || '';

      const ideaData = {
        title: submissionData.title,
        description: submissionData.description,
        problem: submissionData.problem,
        category: submissionData.category,
        shared: submissionData.shared,
        status: "قيد النظر",
        submissiondate: new Date().toISOString().split('T')[0],
        
        innovatorid: innovatorId,
        email: email,
        role: userRole
      };

      console.log("Sending idea data:", ideaData);

      const response = await axios.post('/api/idea', ideaData);
      
      if (response.data) {
        const newIdeaId = response.data.ideaid || response.data._id;
        
        const newIdea = {
          _id: newIdeaId,
          title: submissionData.title,
          description: submissionData.description,
          problem: submissionData.problem,
          category: submissionData.category,
          shared: submissionData.shared,
          status: "قيد النظر",
          statusColor: "text-amber-500",
          date: new Date().toLocaleDateString('ar-SA')
        };
        
        setSubmittedIdeasList(prev => [newIdea, ...prev]);
        setIsNewIdeaOpen(false);
        setIsTrackingOpen(true);
        
        setErrorMsg('تم تقديم الفكرة بنجاح!');
      }
    } catch (error) {
      console.error('Error submitting idea:', error);
      
      if (error.response && error.response.data) {
        setErrorMsg(`خطأ: ${error.response.data.error || error.response.statusText}`);
        console.log("Error details:", error.response.data);
      } else {
        setErrorMsg('حدث خطأ أثناء إرسال الفكرة، يرجى المحاولة مرة أخرى');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const openIdeaDetails = async (ideaId) => {
    if (!ideaId) return;
    
    const stringId = String(ideaId);
    setSelectedIdea(stringId);
    
    const localIdea = submittedIdeasList.find(idea => 
      String(idea._id) === stringId || 
      String(idea.innovatorid) === stringId
    );
    
    if (localIdea) {
      setShowIdeaDetails(true);
      return;
    }
    
    try {
      setIsProcessing(true);
      
      let ideaData = null;
      
      try {
        const response = await axios.get(`/api/idea/${stringId}`);
        ideaData = response.data;
      } catch (err) {
        try {
          const response = await axios.get(`${API_IDEAS_URL}/${stringId}`);
          
          ideaData = {
            _id: response.data._id || response.data.innovatorid,
            title: response.data.title,
            description: response.data.description,
            problem: response.data.problem,
            category: response.data.category,
            shared: response.data.shared ? 'نعم' : 'لا',
            status: response.data.status || 'قيد النظر',
            statusColor: 'text-amber-500',
            date: response.data.submissiondate || new Date().toLocaleDateString('ar-SA'),
            attachments: response.data.attachments ? 
              (typeof response.data.attachments === 'string' ? JSON.parse(response.data.attachments) : response.data.attachments)
              : []
          };
        } catch (innerErr) {
          throw new Error(`فشل جلب الفكرة من جميع واجهات API`);
        }
      }
      
      if (ideaData) {
        const existingIdeaIndex = submittedIdeasList.findIndex(idea => 
          String(idea._id) === String(ideaData._id) || 
          String(idea.innovatorid) === String(ideaData._id)
        );
        
        if (existingIdeaIndex >= 0) {
          const updatedIdeas = [...submittedIdeasList];
          updatedIdeas[existingIdeaIndex] = ideaData;
          setSubmittedIdeasList(updatedIdeas);
        }
        
        setShowIdeaDetails(true);
      }
      
      setIsProcessing(false);
    } catch (error) {
      console.error('Error fetching idea details:', error);
      setErrorMsg(`حدث خطأ أثناء جلب تفاصيل الفكرة: ${error.message}`);
      setIsProcessing(false);
    }
  };

  const IdeaDetailsModal = () => {
    const idea = submittedIdeasList.find(i => 
      String(i._id) === String(selectedIdea) || 
      String(i.innovatorid) === String(selectedIdea)
    );

    if (!idea) {
      return (
        <div className="text-center py-8">
          {isProcessing ? (
            <p className="text-gray-500">جاري تحميل البيانات...</p>
          ) : (
            <p className="text-red-500 font-medium">لم يتم العثور على بيانات الفكرة</p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4 text-right">
        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">عنوان الفكرة:</span>
            <span className="text-blue-900 font-semibold">{idea.title}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">تاريخ الإرسال:</span>
            <span>{new Date(idea.date).toLocaleDateString('ar-EG')}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">المجال:</span>
            <span>{idea.category}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">الحالة الحالية:</span>
            <span className={`font-bold ${idea.statusColor}`}>{idea.status}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
          <span className="font-medium text-gray-700 block mb-2">وصف الفكرة:</span>
          <p className="text-gray-800 bg-white p-3 rounded border border-gray-200">{idea.description}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
          <span className="font-medium text-gray-700 block mb-2">المشاكل التي تحلها:</span>
          <p className="text-gray-800 bg-white p-3 rounded border border-gray-200">{idea.problem}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">تمت مشاركتها من قبل:</span>
            <span>{idea.shared === 'نعم' || idea.shared === true ? 'نعم' : 'لا'}</span>
          </div>
        </div>
        
        {idea.attachments && idea.attachments.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
            <span className="font-medium text-gray-700 block mb-2">المرفقات:</span>
            <ul className="bg-white p-3 rounded border border-gray-200">
              {idea.attachments
                .filter(file => file && (file.url || file.name))
                .map((file, index) => (
                  <li key={`attachment-${index}`} className="flex items-center text-sm py-2 border-b last:border-0">
                    {file.url ? (
                      <a
                        href={file.url.startsWith('http') ? file.url : `${API_BASE_URL}${file.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Paperclip size={14} className="mr-2" />
                        {file.name || `مرفق ${index + 1}`}
                      </a>
                    ) : (
                      <span className="flex items-center text-gray-500">
                        <Paperclip size={14} className="mr-2" />
                        {file.name || `مرفق ${index + 1}`} (غير متاح)
                      </span>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        )}
        
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowIdeaDetails(false)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            إغلاق
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Innovation Oasis - تقديم الأفكار</title>
      </Helmet>

      <div className="min-h-screen bg-gray-100 font-sans" dir="ltr">
        <CustomHeader />
        <div className="flex">
          <Sidebar3 />
          <main className="flex-1">
            {errorMsg && (
              <div className={`mx-4 mt-4 ${errorMsg.includes('بنجاح') ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'} px-4 py-3 rounded`} role="alert">
                <span className="block sm:inline">{errorMsg}</span>
              </div>
            )}

            <div className="flex justify-between gap-x-6 mt-12" dir="rtl">
              <div className="w-1/2 bg-white rounded-lg shadow-sm overflow-hidden">
                <div
                  className="bg-gray-100 px-4 py-10 flex justify-center items-center cursor-pointer"
                  onClick={() => setIsNewIdeaOpen(!isNewIdeaOpen)}
                >
                  <h2 className="font-semibold text-gray-800 text-2xl md:text-3xl">إرسال فكرة جديدة</h2>
                  <ChevronDown size={20} className={`transition-transform ${isNewIdeaOpen ? 'rotate-180' : ''}`} />
                </div>

                {isNewIdeaOpen && (
                  <div className="p-4 bg-white">
                    <h3 className="text-center font-bold mb-6 text-xl text-blue-800 border-b pb-3">نموذج تعبئة المعلومات</h3>
                    <NewIdeaForm onSubmit={handleIdeaSubmission} isLoading={isProcessing} />
                  </div>
                )}
              </div>

              <div className="w-1/2 bg-gray rounded-lg shadow-sm overflow-hidden">
                <div
                  className="bg-gray-100 px-4 py-10 flex justify-center items-center cursor-pointer"
                  onClick={() => setIsTrackingOpen(!isTrackingOpen)}
                >
                  <h2 className="font-semibold text-gray-800 text-2xl md:text-3xl">متابعة الأفكار</h2>
                  <ChevronDown size={20} className={`transition-transform ${isTrackingOpen ? 'rotate-180' : ''}`} />
                </div>

                {isTrackingOpen && (
                  <div className="p-4">
                    {isProcessing && !errorMsg ? (
                      <div className="text-center py-12">
                        <p>جاري تحميل البيانات...</p>
                      </div>
                    ) : submittedIdeasList.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <p className="text-lg">لا توجد أفكار مرسلة حتى الآن</p>
                        <p className="text-sm mt-2">قم بإرسال فكرة جديدة لتظهر هنا</p>
                      </div>
                    ) : (
                      <ul className="space-y-4">
                        {submittedIdeasList.map((idea, index) => (
                          <li key={`idea-${idea._id || index}`} className="border-b pb-4 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">{idea.title}</h3>
                                <div className="flex items-center mt-1">
                                  <span className={`${idea.statusColor} font-medium`}>حالة الفكرة: {idea.status}</span>
                                </div>
                                <div className="text-gray-600 text-sm mt-1">{idea.date}</div>
                              </div>
                              <button
                                onClick={() => {
                                  const idToUse = idea._id || idea.innovatorid;
                                  openIdeaDetails(idToUse);
                                }}
                                className="px-4 py-1.5 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center group"
                              >
                                <Layers size={14} className="ml-2 text-gray-500 group-hover:rotate-6 transition-transform" />
                                <span className="group-hover:text-blue-600 transition-colors">عرض التفاصيل</span>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>

            {showIdeaDetails && selectedIdea && (
              <div
                className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                style={{ backdropFilter: 'blur(5px)' }}
              >
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-2xl relative border-2 border-gray-300">
                  <button
                    onClick={() => setShowIdeaDetails(false)}
                    className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all"
                  >
                    <X size={20} />
                  </button>

                  <h2 className="text-2xl font-bold mb-4 text-center border-b pb-3 text-blue-800">تفاصيل الفكرة</h2>

                  <IdeaDetailsModal />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default IdeasSubmissionPage;