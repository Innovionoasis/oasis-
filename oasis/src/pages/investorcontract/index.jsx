import React, { useState, useRef, useEffect } from 'react';
import { Globe, Search, Bell, FileCheck, DollarSign, Calendar, AlertCircle, Briefcase, FileText } from "lucide-react";
import axios from 'axios';
import Sidebar20 from "../../components/Sidebar20";
import Header from "../../components/Header";

const InvestorContract = () => {
  const signatureCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [signatureData, setSignatureData] = useState('');
  const [formattedAmount, setFormattedAmount] = useState('');
  const [step, setStep] = useState(1);
  
  const [form, setForm] = useState({
    investorname: '',
    ideaname: '',
    implementationperiod: '',
    fundingamount: '',
    signeddate: '',
    expirationdate: '',
    additionalTerms: ''
  });

  useEffect(() => {
    if (form.fundingamount) {
      const numericValue = parseFloat(form.fundingamount);
      if (!isNaN(numericValue)) {
        const formattedValue = numericValue.toLocaleString('ar-SA');
        setFormattedAmount(`${formattedValue} ريال سعودي`);
      } else {
        setFormattedAmount('');
      }
    } else {
      setFormattedAmount('');
    }
  }, [form.fundingamount]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const startDrawing = (e) => {
    const canvas = signatureCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = signatureCanvasRef.current;
      setSignatureData(canvas.toDataURL());
      setIsDrawing(false);
    }
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signatureData) {
      setErrorMessage('يرجى توقيع العقد');
      return;
    }

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    const contractData = {
      ...form,
      status: 'Pending Innovator Signature',
      terms: form.additionalTerms || 'سيتم الاتفاق عليها من قبل الطرفين',
      innovatorname: '',
      innovatorsignature: '',
      investorsignature: signatureData
    };

    try {
      const res = await axios.post('http://localhost:4000/api/contract', contractData);
      setSuccessMessage('✅ تم إرسال العقد بنجاح وبانتظار موافقة المبتكر!');
      setForm({
        investorname: '',
        ideaname: '',
        implementationperiod: '',
        fundingamount: '',
        signeddate: '',
        expirationdate: '',
        additionalTerms: ''
      });
      clearSignature();
      setStep(1);
    } catch (err) {
      console.error('❌ خطأ في إرسال العقد:', err);
      setErrorMessage('فشل في إرسال العقد. يرجى المحاولة مرة أخرى لاحقًا.');
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderProgressBar = () => {
    return (
      <div className="w-full mb-6" dir="rtl">
        <div className="flex justify-between mb-2">
          <div className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>التفاصيل الأساسية</div>
          <div className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>شروط العقد</div>
          <div className={`text-sm font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>المراجعة والتوقيع</div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
          <div 
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
            style={{ width: `${(step / 3) * 100}%` }}>
          </div>
        </div>
      </div>
    );
  };

  const renderFormStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4" dir="rtl">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-medium text-blue-800 flex items-center">
                <Briefcase size={20} className="ml-2" />
                معلومات العقد الأساسية
              </h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">اسم المستثمر</label>
              <input 
                type="text" 
                name="investorname" 
                placeholder="الاسم القانوني الكامل" 
                value={form.investorname} 
                onChange={handleChange} 
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">اسم المشروع</label>
              <input 
                type="text" 
                name="ideaname" 
                placeholder="اسم الفكرة أو المشروع" 
                value={form.ideaname} 
                onChange={handleChange} 
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="ml-1" size={16} />
                  فترة التنفيذ
                </label>
                <input 
                  type="text" 
                  name="implementationperiod" 
                  placeholder="مثال: 6 أشهر" 
                  value={form.implementationperiod} 
                  onChange={handleChange} 
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <DollarSign className="ml-1" size={16} />
                  مبلغ التمويل
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="fundingamount" 
                    placeholder="المبلغ" 
                    value={form.fundingamount} 
                    onChange={handleChange} 
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    required 
                  />
                  {formattedAmount && (
                    <div className="text-sm text-gray-600 mt-1 italic text-right">
                      {formattedAmount}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">تاريخ البدء</label>
                <input 
                  type="date" 
                  name="signeddate" 
                  value={form.signeddate} 
                  onChange={handleChange} 
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">تاريخ الانتهاء</label>
                <input 
                  type="date" 
                  name="expirationdate" 
                  value={form.expirationdate} 
                  onChange={handleChange} 
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4" dir="rtl">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-medium text-blue-800 flex items-center">
                <FileText size={20} className="ml-2" />
                شروط العقد
              </h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">الشروط والأحكام الإضافية</label>
              <textarea 
                name="additionalTerms" 
                placeholder="أدخل أي شروط إضافية أو شروط خاصة" 
                value={form.additionalTerms} 
                onChange={handleChange} 
                className="w-full p-2 mt-1 border border-gray-300 rounded-md h-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4" dir="rtl">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-medium text-blue-800 flex items-center">
                <FileCheck size={20} className="ml-2" />
                مراجعة وتوقيع العقد
              </h3>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-3">ملخص العقد</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">المستثمر:</span>
                  <span className="font-medium">{form.investorname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">المشروع:</span>
                  <span className="font-medium">{form.ideaname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">فترة التنفيذ:</span>
                  <span className="font-medium">{form.implementationperiod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">مبلغ التمويل:</span>
                  <span className="font-medium">{formattedAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">المدة:</span>
                  <span className="font-medium">{form.signeddate} إلى {form.expirationdate}</span>
                </div>
              </div>
              
              {form.additionalTerms && (
                <div className="mt-4">
                  <h5 className="font-medium mb-2">الشروط الإضافية:</h5>
                  <p className="text-sm bg-white p-2 border border-gray-200 rounded">{form.additionalTerms}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">التوقيع الرقمي</label>
              <p className="text-xs text-gray-500 mb-2">ارسم توقيعك أدناه لإكمال العقد</p>
              <div className="border border-gray-300 rounded-md p-1 bg-gray-50">
                <canvas 
                  ref={signatureCanvasRef}
                  width="538"
                  height="150"
                  className="w-full border border-gray-200 bg-white"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                ></canvas>
                <div className="flex justify-start mt-2">
                  <button 
                    type="button" 
                    onClick={clearSignature}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    مسح التوقيع
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex items-center mb-4">
                <input id="terms" type="checkbox" required className="h-4 w-4 text-blue-600 border-gray-300 rounded ml-2" />
                <label htmlFor="terms" className="block text-sm text-gray-700">
                  أؤكد أن جميع المعلومات المقدمة دقيقة وأوافق على الشروط والأحكام
                </label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar20 />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-[#f5f0e1] text-gray-800 p-6"> 
              <h2 className="text-2xl font-bold flex items-center" dir="rtl">
                <FileCheck className="ml-2" />
                إنشاء عقد استثمار
              </h2>
              <p className="text-gray-700 mt-1" dir="rtl">تأمين التمويل للأفكار المبتكرة</p> 
            </div>

            {successMessage && (
              <div className="bg-green-50 border-r-4 border-green-500 p-4 m-4" dir="rtl">
                <p className="text-green-700">{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-50 border-r-4 border-red-500 p-4 m-4" dir="rtl">
                <p className="text-red-700 flex items-center">
                  <AlertCircle className="ml-2" size={16} />
                  {errorMessage}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {renderProgressBar()}
              
              {renderFormStep()}

              <div className="flex justify-between pt-4 border-t border-gray-200" dir="rtl">
                {step > 1 ? (
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    السابق
                  </button>
                ) : (
                  <div></div>
                )}
                
                {step < 3 ? (
                  <button 
                    type="button" 
                    onClick={nextStep}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    التالي
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    إرسال العقد
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
);
};

export default InvestorContract;