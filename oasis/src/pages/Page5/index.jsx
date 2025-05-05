import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { X, Check, ArrowRight, Send } from 'lucide-react';
import Header from "../../components/Header";
import Sidebar2 from "../../components/Sidebar2";
import { Link } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';
moment.locale('ar-SA');

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInnovator, setSelectedInnovator] = useState(null);
  const [innovators, setInnovators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelReason, setCancelReason] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');



  const fetchInnovators = () => {
    setLoading(true);
    setError(null);
    axios.get("http://localhost:4000/api/approvedsupervisions")
      .then((response) => {
        setInnovators(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ هناك خطأ في جلب البيانات:", error);
        setError("فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInnovators();
  }, []);
  
  const handleOpenModal = (innovator) => {
    setSelectedInnovator(innovator);
    setIsModalOpen(true);
    setCancelReason('');
  };

  const handleCloseModal = () => {
    setSelectedInnovator(null);
    setIsModalOpen(false);
    setCancelReason('');
  };

  const handleSubmitCancelSupervision = () => {
    if (!cancelReason.trim()) {
      alert("الرجاء إدخال سبب إلغاء الإشراف");
      return;
    }

    axios.post("http://localhost:4000/api/cancel-supervision", {
      innovator_id: selectedInnovator.id,
      reason: cancelReason,
      canceled_at: new Date().toISOString()
    })
      .then(response => {
        console.log('تم إلغاء الإشراف بنجاح:', response.data);
        setSuccessMessage('تم إلغاء الإشراف بنجاح!');
        setTimeout(() => {
          setSuccessMessage('');
          fetchInnovators(); 
          handleCloseModal();
        }, 2000);
      })
      .catch(error => {
        console.error('❌ فشل في إلغاء الإشراف:', error);
        setError("حدث خطأ أثناء إلغاء الإشراف. يرجى المحاولة مرة أخرى.");
      });
  };
  
  const handleSendMessage = (innovatorId) => {
    console.log(`إرسال رسالة للمبتكر رقم ${innovatorId}`);
  };

  return (
    <>
      <Helmet>
        <title>Mentorship Innovators - Supervise and Guide Creative Talent</title>
        <meta
          name="description"
          content="Engage with innovators under your supervision. Track their progress, provide feedback, and follow their journey in the field of innovation."
        />
      </Helmet>
      <div className="w-full bg-gray-50_01">
        <Header />
        <div className="flex items-start">
          <Sidebar2 className="w-16 bg-white shadow-md h-screen" />
          
          <main className="flex-1 p-8">
            <h1 className="mb-12 text-right text-3xl font-semibold">المبتكرين تحت إشرافك</h1>

            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-right">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-right">
                {error}
                <button 
                  className="mr-2 underline"
                  onClick={() => {
                    setError(null);
                    fetchInnovators();
                  }}
                >
                  إعادة المحاولة
                </button>
              </div>
            )}

            {loading ? (
              <div className="text-center p-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2">جاري تحميل البيانات...</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                {innovators.length === 0 ? (
                  <p className="text-center p-8">لا يوجد مبتكرين تحت إشرافك حاليًا</p>
                ) : (
                  <table className="w-full border-collapse text-right">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="w-24 border-b border-r p-4 text-center font-semibold">
                          <div className=" flex flex-col items-center">
                            <div className="">
                              <span className="text-base font-semibold ">متابعة</span>
                              <Check className="h-5 w-9  items-center text-green-500" />
                            </div>
                            
                          </div>
                        </th>
                        <th className="border-b p-4 text-right font-semibold">التاريخ</th>
                        <th className="border-b p-4 text-right font-semibold">مجال الفكرة</th>
                        <th className="border-b p-4 text-right font-semibold">عنوان الفكرة</th>
                        <th className="border-b p-4 text-right font-semibold">اسم المبتكر/ين</th>
                      </tr>
                    </thead>
                    <tbody>
                      {innovators.map((innovator, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="border-r p-4 flex flex-col items-center">
                            <Link 
                              to="/Chat"
                              state={{ innovator: innovator }}
                              className="inline-block rounded p-1 hover:bg-gray-100"
                              title="إرسال رسالة"
                            >
                              <Send className="h-5 w-5 text-green-500" />
                            </Link>
                          </td>
                          <td className="p-4">{innovator.supervision_start_date ? (  <>
                      {new Date(innovator.supervision_start_date).toLocaleDateString('en-US', {
                       year: 'numeric',
                       month: '2-digit',
                       day: '2-digit'
                       })} 
                      <br />
                    {new Date(innovator.supervision_start_date).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                     })} 
                        </>
                   ) : ( 'غير محدد'
                    )} </td>
                          <td className="p-4">{innovator.category}</td>
                          <td className="p-4">{innovator.title}</td>
                          <td className="p-4">{innovator.innovator_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {isModalOpen && selectedInnovator && (
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
            className="bg-white rounded-lg shadow-2xl w-full max-w-sm mx-4 p-6 relative border"
            style={{
              backgroundColor: 'white',
              opacity: 1,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={handleCloseModal}
                className="text-gray-600 hover:text-gray-900 absolute top-4 left-4"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold w-full text-center">طلب إلغاء إشراف</h2>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-right">اسم المبتكر</label>
              <input 
                type="text"
                value={`${selectedInnovator.innovator_name}`}
                readOnly
                className="w-full border rounded p-2 text-right"
                style={{ borderColor: '#b8d0e6', background: 'linear-gradient(to right, #f9f9f9, #f5f0e6)' }}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-right">عنوان الفكرة</label>
              <input 
                type="text"
                value={selectedInnovator.title}
                readOnly
                className="w-full border rounded p-2 text-right"
                style={{ borderColor: '#b8d0e6', background: 'linear-gradient(to right, #f9f9f9, #f5f0e6)' }}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-right">مجال الفكرة</label>
              <input 
                type="text"
                value={selectedInnovator.category}
                readOnly
                className="w-full border rounded p-2 text-right"
                style={{ borderColor: '#b8d0e6', background: 'linear-gradient(to right, #f9f9f9, #f5f0e6)' }}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-right">سبب إلغاء الإشراف</label>
              <textarea
                className="w-full border rounded p-2 h-32 text-right"
                placeholder="اشرح سبب إلغاء الإشراف"
                style={{ borderColor: '#b8d0e6', background: 'linear-gradient(to right, #f9f9f9, #f5f0e6)' }}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="mb-4">
   <label className="block mb-2 text-right">تاريخ بداية الإشراف</label>
   <input 
     type="text"
     value={selectedInnovator.supervision_start_date ? (
      `${new Date(selectedInnovator.supervision_start_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })} - ${new Date(selectedInnovator.supervision_start_date).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })} `
    ) : (
      'غير محدد'
    )}
    readOnly 
    className="w-full border rounded p-2 text-right bg-gray-100"
  />
</div>


            <button 
              onClick={handleSubmitCancelSupervision}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              style={{ background: 'linear-gradient(to right, #4169E1, #7b98cc)' }}
            >
              تقديم طلب إلغاء الإشراف
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;