import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from "react-helmet";
import Header from "../../components/Header";
import Sidebar2 from "../../components/Sidebar2";
import translations from "../../translations/translations";

const lang = localStorage.getItem("lang") || "ar";  

export default function ReviewRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/mentorrequested');
                
                const requestsWithDefaultStatus = response.data.rows.map(request => ({
                    ...request,
                    status: request.status || (lang === 'ar' ? 'معلق' : 'pending') 
                }));
                setRequests(requestsWithDefaultStatus);
            } catch (error) {
                console.error("خطأ في جلب البيانات:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const handleAcceptRequest = async (requestId) => {
        try {
            await axios.put(`http://localhost:4000/api/mentorshiprequest/${requestId}`, {
                status: lang === 'ar' ? 'مقبول' : 'accepted'
            });

            setRequests(prevRequests => prevRequests.map(req =>
                req.mentorshiprequestid === requestId
                    ? { ...req, status: lang === 'ar' ? 'مقبول' : 'accepted' }
                    : req
            ));
            alert(lang === 'ar' ? "تم قبول الطلب بنجاح" : "Request accepted successfully");
        } catch (error) {
            console.error("❌ خطأ في قبول الطلب:", error);
            alert(lang === 'ar' ? "حدث خطأ أثناء محاولة قبول الطلب" : "Error accepting request");
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            await axios.put(`http://localhost:4000/api/mentorshiprequest/${requestId}`, {
                status: lang === 'ar' ? 'مرفوض' : 'rejected'
            });

            setRequests(prevRequests => prevRequests.map(req =>
                req.mentorshiprequestid === requestId
                    ? { ...req, status: lang === 'ar' ? 'مرفوض' : 'rejected' }
                    : req
            ));
            alert(lang === 'ar' ? "تم رفض الطلب بنجاح" : "Request rejected successfully");
        } catch (error) {
            console.error("❌ خطأ في رفض الطلب:", error);
            alert(lang === 'ar' ? "حدث خطأ أثناء محاولة رفض الطلب" : "Error rejecting request");
        }
    };
    
    const getStatusColorClass = (status) => {
        if (status === 'مقبول' || status === 'accepted') {
            return 'bg-green-100 text-green-800';
        } else if (status === 'مرفوض' || status === 'rejected') {
            return 'bg-red-100 text-red-800';
        } else { 
            return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Helmet>
                <title>{lang === 'ar' ? 'مراجعة الطلبات' : 'Review Requests'}</title>
            </Helmet>
            <Header />
            <div className="flex">
                <div className="sticky top-0 z-10">
                    <Sidebar2 />
                </div>

                <div className="flex-1 p-4">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
                        {translations.pages.ReviewRequestsPage.title[lang]} 
                    </h1>

                    {isLoading ? (
                        <p className="text-center text-gray-600">
                            {lang === 'ar' ? 'جارٍ تحميل الطلبات...' : 'Loading requests...'}
                        </p>
                    ) : (
                        <div className="overflow-x-auto shadow-md rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 bg-white">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-black-500 uppercase tracking-wider">
                                            {translations.common.requestid[lang]}
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-black-500 uppercase tracking-wider">
                                            {translations.common.innovatorName[lang]}
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-black-500 uppercase tracking-wider">
                                            {translations.common.ideaTitle[lang]}
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-black-500 uppercase tracking-wider">
                                            {translations.common.date[lang]}
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-black-500 uppercase tracking-wider">
                                            {translations.common.status[lang]}
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-black-500 uppercase tracking-wider">
                                            {lang === 'ar' ? 'الإجراءات' : 'Actions'}
                                        </th>
                                    </tr>
                                </thead>
                                
                                <tbody className="divide-y divide-gray-200">
                                    {requests.map(request => (
                                        <tr key={request.mentorshiprequestid} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                {request.mentorshiprequestid}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                {request.innovator_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                {request.idea_title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                {new Date(request.requestdate).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColorClass(request.status)}`}>
                                                    {(request.status === 'معلق' && lang === 'en') ? 'pending' : request.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}