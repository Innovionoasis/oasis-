import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../../components/Header";
import Sidebar3 from "../../components/Sidebar3";
import { Check, X, FileText, Pen } from 'lucide-react';
import { Globe, Search, Bell, User } from 'lucide-react';

const InnovatorSignContract = () => {
  const [contracts, setContracts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [innovatorName, setInnovatorName] = useState('');
  const [signatureData, setSignatureData] = useState('');
  const [message, setMessage] = useState('');
  const [canvasRef, setCanvasRef] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/contract');
        const pendingContracts = res.data.filter(c => c.status === 'Pending Innovator Signature');
        setContracts(pendingContracts);
      } catch (err) {
        console.error('Error fetching contracts', err);
      }
    };

    fetchContracts();
  }, []);

  const initializeCanvas = (canvas) => {
    if (!canvas) return;
    setCanvasRef(canvas);
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0f172a';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
  };

  const startDrawing = (e) => {
    const ctx = canvasRef.getContext('2d');
    const rect = canvasRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.getContext('2d');
    const rect = canvasRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
    if (canvasRef) {
      setSignatureData(canvasRef.toDataURL());
    }
  };

  const clearSignature = () => {
    const ctx = canvasRef.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
    setSignatureData('');
  };

  const handleSubmit = async (e, contractId) => {
    e.preventDefault();
    
    if (!signatureData) {
      setMessage("يرجى تقديم توقيعك الرقمي");
      return;
    }
    
    try {
      const res = await axios.put(`http://localhost:4000/api/contract/${contractId}`, {
        signed_by_innovator: true,
        innovatorname: innovatorName,
        innovatorsignature: signatureData,
        status: "موافق عليه",
      });
      
      setMessage("✅ تم توقيع العقد بنجاح!");
      setContracts(prev => prev.filter(c => c.contractid !== contractId));
      setSelectedId(null);
    } catch (err) {
      console.error("❌ حدث خطأ أثناء توقيع العقد:", err);
      setMessage("فشل في توقيع العقد. يرجى المحاولة مرة أخرى.");
    }
  };

  const handleReject = async (contractId) => {
    try {
      await axios.put(`http://localhost:4000/api/contract/${contractId}`, {
        status: "مرفوض",
      });
      setMessage("❌ تم رفض العقد بنجاح.");
      setContracts(prev => prev.filter(c => c.contractid !== contractId));
    } catch (err) {
      console.error("❌ حدث خطأ أثناء رفض العقد:", err);
      setMessage("فشل في رفض العقد. يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar3 />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <FileText className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">العقود التي تنتظر توقيعك</h2>
              </div>
              
              {message && (
                <div className={`p-4 mb-6 rounded ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {message}
                </div>
              )}

              {contracts.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-500">لا توجد عقود تنتظر توقيعك.</p>
                </div>
              )}

              {contracts.map(contract => (
                <div key={contract.contractid} className="border border-gray-200 p-6 mb-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">المستثمر</p>
                      <p className="font-medium text-gray-800">{contract.investorname}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">الفكرة</p>
                      <p className="font-medium text-gray-800">{contract.ideaname}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">مبلغ التمويل</p>
                      <p className="font-medium text-gray-800">${parseFloat(contract.fundingamount).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">مدة التنفيذ</p>
                      <p className="font-medium text-gray-800">{contract.implementationperiod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">تاريخ التوقيع</p>
                      <p className="font-medium text-gray-800">{new Date(contract.signeddate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">تاريخ انتهاء الصلاحية</p>
                      <p className="font-medium text-gray-800">{new Date(contract.expirationdate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <div className={`h-2.5 w-2.5 rounded-full mr-2 ${contract.status === 'Pending Innovator Signature' ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
                    <p className="text-sm font-medium text-gray-600">الحالة: {contract.status}</p>
                  </div>

                  {selectedId === contract.contractid ? (
                    <form onSubmit={(e) => handleSubmit(e, contract.contractid)} className="mt-6 border-t border-gray-200 pt-6">
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">اسمك الكامل</label>
                        <input 
                          type="text" 
                          placeholder="أدخل اسمك الكامل" 
                          value={innovatorName} 
                          onChange={(e) => setInnovatorName(e.target.value)} 
                          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                          required 
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">التوقيع الرقمي</label>
                        <div className="border border-gray-300 rounded-md p-1 bg-white">
                          <canvas 
                            ref={initializeCanvas}
                            width={500}
                            height={150}
                            className="w-full border border-gray-200 rounded cursor-crosshair touch-none"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={endDrawing}
                            onMouseLeave={endDrawing}
                          />
                        </div>
                        <div className="flex justify-end mt-2">
                          <button 
                            type="button" 
                            onClick={clearSignature}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            مسح التوقيع
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mt-6">
                        <button 
                          type="submit" 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md flex items-center transition-colors"
                        >
                          <Check className="h-5 w-5 mr-2" />
                          توقيع العقد
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleReject(contract.contractid)}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-md flex items-center transition-colors"
                        >
                          <X className="h-5 w-5 mr-2" />
                          رفض العقد
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setSelectedId(null)}
                          className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-2.5 rounded-md flex items-center transition-colors"
                        >
                          إلغاء
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button 
                      onClick={() => setSelectedId(contract.contractid)}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md flex items-center transition-colors"
                    >
                      <Pen className="h-5 w-5 mr-2" />
                      توقيع هذا العقد
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnovatorSignContract;