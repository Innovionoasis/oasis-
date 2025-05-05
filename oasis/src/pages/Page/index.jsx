import { Helmet } from "react-helmet";
import { Text, Img, Button, Heading, Input } from "../../components";
import Header from "../../components/Header";
import Sidebar1 from "../../components/Sidebar1";
import React, { useState, useEffect } from "react";
import { FaFileAlt, FaPen, FaHandPointer, FaTimes, FaFileContract, FaIdCard, FaUserTie, 
  FaMoneyBillWave, FaCalendarAlt, FaSignature, FaCheckCircle, FaTimesCircle, 
  FaRegLightbulb, FaSearch, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import dayjs from "dayjs";
import { CloseSVG } from "../../components/Input/close";

const ContractModal = ({ modalContent, setModalOpen }) => {
  const sections = [
    {
      title: "معلومات أساسية",
      icon: <FaFileContract className="text-blue-600 text-2xl" />,
      items: [
        { label: "رقم العقد", value: modalContent.contractid },
        { label: "اسم الفكرة", value: modalContent.ideaname },
        { label: "الحالة", value: modalContent.status, 
          badge: modalContent.status === "نشط" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800" }
      ]
    },
    {
      title: "الأطراف المتعاقدة",
      icon: <FaIdCard className="text-purple-600 text-2xl" />,
      items: [
        { label: "اسم المبتكر", value: modalContent.innovatorname },
        { label: "اسم المستثمر", value: modalContent.investorname }
      ]
    },
    {
      title: "التفاصيل المالية والزمنية",
      icon: <FaMoneyBillWave className="text-green-600 text-2xl" />,
      items: [
        { label: "قيمة التمويل", value: `${modalContent.fundingamount} ريال` },
        { label: "مدة التنفيذ", value: modalContent.implementationperiod }
      ]
    },
    {
      title: "المواعيد الهامة",
      icon: <FaCalendarAlt className="text-red-600 text-2xl" />,
      items: [
        { label: "تاريخ التوقيع", value: dayjs(modalContent.signeddate).format('YYYY-MM-DD') },
        { label: "تاريخ الانتهاء", value: dayjs(modalContent.expirationdate).format('YYYY-MM-DD') }
      ]
    },
    {
      title: "الشروط والأحكام",
      icon: <FaUserTie className="text-gray-700 text-2xl" />,
      items: [
        { label: "الشروط", value: modalContent.terms, fullWidth: true },
        { label: "بنود إضافية", value: modalContent.additionalterms, fullWidth: true }
      ]
    },
    {
      title: "التوقيعات",
      icon: <FaSignature className="text-indigo-600 text-2xl" />,
      items: [
        { label: "توقيع المبتكر", value: modalContent.innovatorsignature },
        { label: "توقيع المستثمر", value: modalContent.investorsignature },
        { 
          label: "حالة توقيع المبتكر", 
          value: modalContent.signed_by_innovator ? "تم التوقيع" : "لم يتم التوقيع بعد",
          icon: modalContent.signed_by_innovator ? 
            <FaCheckCircle className="text-green-500 text-lg" /> : 
            <FaTimesCircle className="text-red-500 text-lg" />
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-4/5 max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl border-t-4 border-blue-600">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-xl p-4">
          <h2 className="text-2xl font-bold text-white text-center">تفاصيل العقد #{modalContent.contractid}</h2>
          <p className="text-blue-100 text-center">{modalContent.ideaname}</p>
        </div>
        
        <div className="p-6 space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-3 border-b pb-2">
                {section.icon}
                <h3 className="text-lg font-bold text-gray-800">{section.title}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className={`${item.fullWidth ? "md:col-span-2" : ""}`}>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-600 font-medium">{item.label}:</p>
                      {item.icon && item.icon}
                    </div>
                    <p className={`mt-1 ${item.badge ? item.badge + " inline-block px-2 py-1 rounded-full text-sm" : "text-gray-800"}`}>
                      {item.value || "غير محدد"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t flex justify-center gap-4">
          <button
            onClick={() => setModalOpen(false)}
            className="bg-white border-2 border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100 transition duration-200 font-medium"
          >
            إغلاق
          </button>
          <button
            onClick={() => {
              alert("تم حفظ التغييرات");
              setModalOpen(false);
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition duration-200 font-medium"
          >
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
};

const ContractCard = ({ contract, onView, onSign, onReject }) => {
  const getStatusColor = () => {
    if (!contract.status) return "bg-gray-100";
    return contract.status === "نشط" ? "bg-green-50" : "bg-yellow-50";
  };

  return (
    <div className={`${getStatusColor()} rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-gray-200 flex flex-col`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-full">
            <FaFileAlt className="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">#{contract.contractid}</h3>
            <p className="text-gray-600 text-sm">{dayjs(contract.signeddate).format('YYYY-MM-DD')}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${contract.status === "نشط" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
          {contract.status || "قيد المراجعة"}
        </div>
      </div>
      
      <div className="border-t border-b border-gray-200 py-3 mb-3">
        <div className="flex items-center gap-2 mb-1">
          <FaRegLightbulb className="text-yellow-500" />
          <p className="font-medium text-gray-700">الفكرة:</p>
          <p className="text-gray-800">{contract.ideaname || "غير محدد"}</p>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>المبتكر: {contract.innovatorname}</span>
          <span>المستثمر: {contract.investorname}</span>
        </div>
      </div>
      
      <div className="flex justify-around mt-auto">
        <button 
          onClick={() => onView(contract)}
          className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg transition-colors"
        >
          <FaHandPointer /> عرض
        </button>
        <button 
          onClick={() => onSign(contract.contractid)}
          className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-600 px-3 py-2 rounded-lg transition-colors"
        >
          <FaPen /> توقيع
        </button>
        <button 
          onClick={() => onReject(contract.contractid)}
          className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition-colors"
        >
          <FaTimes /> رفض
        </button>
      </div>
    </div>
  );
};

export default function PagePage() {
  const [searchValue, setSearchValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [contracts, setContracts] = useState([]);
  const [sortField, setSortField] = useState("contractid");
  const [sortDirection, setSortDirection] = useState("asc");
  const [viewMode, setViewMode] = useState("grid"); 

  useEffect(() => {
    fetch("http://localhost:4000/api/contract")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setContracts(data);
        } else {
          console.error("البيانات غير متوقعة:", data);
          setContracts([]);
        }
      })
      .catch((err) => {
        console.error("فشل في جلب العقود", err);
        setContracts([]);
      });
  }, []);
  
  const handleView = (contract) => {
    setModalContent(contract);
    setModalOpen(true);
  };
  
  const handleSign = (id) => {
    alert(`✍️ تم توقيع العقد رقم ${id}`);
  };
  
  const handleRejectContract = (id) => {
    alert(`✅ تم رفض العقد رقم ${id}`);
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const searchLower = searchValue.toLowerCase();
    return (
      (contract.contractid && contract.contractid.toString().includes(searchLower)) ||
      (contract.ideaname && contract.ideaname.toLowerCase().includes(searchLower)) ||
      (contract.innovatorname && contract.innovatorname.toLowerCase().includes(searchLower)) ||
      (contract.investorname && contract.investorname.toLowerCase().includes(searchLower))
    );
  });

  const sortedContracts = [...filteredContracts].sort((a, b) => {
    if (!a[sortField]) return 1;
    if (!b[sortField]) return -1;
    
    const comparison = a[sortField].toString().localeCompare(b[sortField].toString());
    return sortDirection === "asc" ? comparison : -comparison;
  });

  return (
    <>
      <Helmet>
        <title>لوحة التحكم - العقود</title>
        <meta name="description" content="إدارة العقود من مكان واحد" />
      </Helmet>

      <div className="w-full bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar1 />
          <div className="flex-1 p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">إدارة العقود</h1>
                <p className="text-gray-600">استعراض وإدارة جميع العقود من مكان واحد</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="بحث..."
                    value={searchValue}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all w-full"
                  />
                  <FaSearch className="absolute right-3 top-3 text-gray-400" />
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg border ${viewMode === "grid" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg border ${viewMode === "list" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border-r-4 border-blue-500">
                <h3 className="text-gray-500 mb-1">إجمالي العقود</h3>
                <p className="text-2xl font-bold">{contracts.length}</p>
              </div>
            </div>

            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedContracts.length > 0 ? (
                  sortedContracts.map((contract, index) => (
                    <ContractCard 
                      key={index}
                      contract={contract}
                      onView={handleView}
                      onSign={handleSign}
                      onReject={handleRejectContract}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-xl font-medium">لا توجد عقود</p>
                    <p>لم يتم العثور على أي عقود مطابقة لمعايير البحث</p>
                  </div>
                )}
              </div>
            )}

            {viewMode === "list" && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-right">
                  <thead className="bg-gray-100">
                    <tr className="text-gray-700">
                      <th className="p-4 cursor-pointer" onClick={() => handleSort("contractid")}>
                        <div className="flex items-center gap-1">
                          رقم العقد
                          {sortField === "contractid" && (
                            sortDirection === "asc" ? <FaSortAmountUp className="text-blue-600" /> : <FaSortAmountDown className="text-blue-600" />
                          )}
                        </div>
                      </th>
                      <th className="p-4 cursor-pointer" onClick={() => handleSort("ideaname")}>
                        <div className="flex items-center gap-1">
                          اسم الفكرة
                          {sortField === "ideaname" && (
                            sortDirection === "asc" ? <FaSortAmountUp className="text-blue-600" /> : <FaSortAmountDown className="text-blue-600" />
                          )}
                        </div>
                      </th>
                      <th className="p-4">الأطراف</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedContracts.length > 0 ? (
                      sortedContracts.map((contract, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-4">#{contract.contractid}</td>
                          <td className="p-4">{contract.ideaname}</td>
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="text-sm">المبتكر: {contract.innovatorname}</span>
                              <span className="text-sm text-gray-600">المستثمر: {contract.investorname}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${contract.status === "نشط" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                              {contract.status || "قيد المراجعة"}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleView(contract)}
                                className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors"
                                title="عرض"
                              >
                                <FaHandPointer />
                              </button>
                              <button 
                                onClick={() => handleSign(contract.contractid)}
                                className="bg-green-50 hover:bg-green-100 text-green-600 p-2 rounded-lg transition-colors"
                                title="توقيع"
                              >
                                <FaPen />
                              </button>
                              <button 
                                onClick={() => handleRejectContract(contract.contractid)}
                                className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors"
                                title="رفض"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p>لا توجد عقود مطابقة لمعايير البحث</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {modalOpen && modalContent && (
              <ContractModal
                modalContent={modalContent}
                setModalOpen={setModalOpen}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
} 