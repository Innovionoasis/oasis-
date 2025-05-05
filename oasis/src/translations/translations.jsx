import ReviewRequestsPage from "pages/ReviewRequestsPage/ReviewRequestsPage";

const common = {
    search: { ar: "بحث", en: "Search" },
    language: { ar: "العربية", en: "English" },
    loadMore: { ar: "عرض المزيد", en: "Load More" },
    details: { ar: "عرض التفاصيل", en: "View Details" },
    ideaDetails: { ar: "تفاصيل الفكرة", en: "Idea Details" },
    close: { ar: "إغلاق", en: "Close" },
    new: { ar: "جديدة", en: "New" },
    underReview: { ar: "قيد المراجعة", en: "Under Review" },
    accept: { ar: "قبول", en: "Accept" },
    reject: { ar: "رفض", en: "Reject" },
    accepted: { ar: "مقبول", en: "Accepted" },
    pending: { ar: "معلق", en: "Pending" },
    attachments: { ar: "المرفقات", en: "Attachments" },
    comments: { ar: "التعليقات", en: "Comments" },
    All: { ar: " الكل", en: "Show All" },
    loading: { ar: "⏳ جاري تحميل البيانات...", en: "⏳ Loading data..." },
    innovatorName: { ar: "اسم المبتكر", en: "Innovator Name" },
    ideaName: { ar: "اسم الفكرة", en: "Idea Name" },
    viewProfile: { ar: "عرض الملف الشخصي", en: "View Profile" },
    catogry: { ar: " مجال الفكرة", en: "catogry" },
    description: { ar: "وصف الفكرة", en: "Idea Description" },
    problemsSolved: { ar: "المشاكل التي تحلها", en: "Problems Solved" },
    reason: { ar: "سبب الطلب", en: "Request Reason" },
    downloadFile: { ar: "📄 تحميل الملف", en: "📄 Download File" },
    acceptSuccess: { ar: "✔️ تم قبول الفكرة بنجاح", en: "✔️ Idea accepted successfully" },
  rejectSuccess: { ar: "❌ تم رفض الفكرة", en: "❌ Idea rejected" },
  updateError: { ar: "⚠️ حدث خطأ أثناء تحديث الحالة", en: "⚠️ Error updating status" },
  requestError: { ar: "⚠️ حدث خطأ أثناء إرسال الطلب", en: "⚠️ Error submitting request" },
  retry: { ar: "إعادة المحاولة", en: "Retry" },
  notSpecified: { ar: "غير محدد", en: "Not specified" },
  fetchError: { ar: "هناك خطأ في جلب البيانات", en: "Error fetching data" },
  loadFailMessage: { ar: "فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.", en: "Failed to load data. Please try again." },
  follow: { ar: "متابعة", en: "Follow" },
  date: { ar: "التاريخ", en: "Date" },
  noInnovators: { ar: "لا يوجد مبتكرين تحت إشرافك حاليًا", en: "No innovators under your supervision currently" },
  sendMessage: { ar: "إرسال رسالة", en: "Send Message" },
    requestid: { ar: "رقم الطلب", en: "Request ID" },
    ideaTitle: { ar: "عنوان الفكرة", en: "Idea Title" },
    status: { ar: "الحالة", en: "Status" },
    reviewTitle: { ar: "مراجعة طلبات الإشراف المرسلة", en: "Review Submitted Mentorship Requests" },
    rejected: { ar: "مرفوض", en: "Rejected" },
    toggleLang: { ar: "English", en: "العربية" },
    pageTitle: { ar: "مراجعة الطلبات", en: "Review Requests" },
    errorAccepting: { ar: "❌ خطأ في قبول الطلب:", en: "❌ Error accepting request:" },
    errorRejecting: { ar: "❌ خطأ في رفض الطلب:", en: "❌ Error rejecting request:" },
    acceptMessage: { ar: "تم قبول الطلب بنجاح", en: "Request accepted successfully" },
    rejectMessage: { ar: "تم رفض الطلب بنجاح", en: "Request rejected successfully" },

    //بيج 13
    reasonLabel: { ar: "لماذا ترغب في الإشراف؟", en: "Why do you want to supervise?" },
    reasonPlaceholder: { ar: "اكتب سبب رغبتك في الإشراف...", en: "Write your reason for wanting to supervise...", },
    submitRequest: {ar: "تقديم طلب إشراف", en: "Submit Supervision Request"},
    requestSent: { ar: "تم إرسال الطلب بنجاح", en: "Request sent successfully" },
    requestFailed: { ar: "فشل إرسال الطلب", en: "Request sending failed" },
    submitFail: {ar: "فشل إرسال الطلب، حاول مرة أخرى",en: "Failed to send request, please try again"},
/// investor
 fundingAmount: { ar: "مبلغ التمويل المطلوب", en: "Requested Funding Amount" },
 fundingRequestDetails: { ar: "تفاصيل طلب التمويل", en: "Funding Request Details" },
 actionError: { ar: "حدث خطأ أثناء تنفيذ الإجراء", en: "Error while performing action" },
 acceptSuccess: { ar: "✔️ تم قبول طلب التمويل بنجاح", en: "✔️ Funding request accepted successfully" },
 rejectSuccess: { ar: "❌ تم رفض طلب التمويل بنجاح", en: "❌ Funding request rejected successfully" },
  offeredAmount: { ar: "المبلغ المعروض", en: "Offered Amount" },
  submitRequest: { ar: "تقديم طلب", en: "Submit Request" },
  previousRequestUpdates: { ar: "تحديثات حالة الطلبات السابقة", en: "Previous Requests Status Updates" },
  Nopreviousfundingrequests: {ar:" لا توجد طلبات تمويل سابقة" ,en: "No previous funding requests"},
  enterAmount: { ar: "أدخل المبلغ", en: "Enter the amount" },
  






contractManagementLabel: { ar: "إدارة العقود", en: "Contract Management" },
  mentorshipRequestLabel: { ar: "طلب الإرشاد", en: "Mentorship Request" },
  ideasLabel: { ar: "الأفكار", en: "Ideas" },
  fundingRequestLabel: { ar: "طلب التمويل", en: "Funding Request" },
  smartEvaluationLabel: { ar: "تقييم ذكي", en: "Smart Evaluation" },
  viewFundingRequestsLabel: { ar: "عرض طلبات التمويل", en: "View Funding Requests" },
  viewMentorshipRequestsLabel: { ar: "عرض طلبات الإرشاد", en: "View Mentorship Requests" },




};




  const pages = {
    Innovator: {
      title: { ar: " خدمات تحقق أحلامك ", en: " Services that turn your dreams into reality "  },
    },


    page1:{
      title: { ar: "كل فكرة تستحق ان تكون واقع  ", en: "Every idea deserves to become a reality" },
      
      cards: [
        {
          title: { ar: "استثمر في الفكرة التي تثير اهتمامك", en: "Invest in the idea that sparks your interest" },
          subtitle: { ar: "اطلع على الأفكار وقدم الدعم لها", en: "Explore ideas and provide support" },
        },
        {
          title: { ar: " طلبات التمويل", en: " Funding Requests" },
          subtitle: { ar: "اطلع على طلبات المبتكرين لتكون ممولًا لهم ", en: " Review innovators’ requests to become their sponsor" },
        },
      ]
    },
    page3:{
      title:{ ar: "عرض طلبات التمويل الجديدة", en: "View New Funding Requests" },
    },
  

    page9: {
      title: { ar: "عرض طلبات الإشراف الجديدة", en: "New Requests for Supervision" },
    },
    page5: {
      title: { ar: "المبتكرين تحت إشرافك", en: "Innovators Under Your Supervision" },
      pageTitle: { 
        ar: "المبتكرين تحت الإشراف - الرعاية وتوجيه المواهب الإبداعية", 
        en: "Mentorship Innovators - Supervise and Guide Creative Talent" 
      },
      metaDescription: { 
        ar: "تواصل مع المبتكرين تحت إشرافك. تتبع تقدمهم، قدم ملاحظات، وتابع رحلتهم في مجال الابتكار.", 
        en: "Engage with innovators under your supervision. Track their progress, provide feedback, and follow their journey in the field of innovation." 
      },
    },
    ReviewRequestsPage :{
      title: { ar: "مراجعة طلبات الإشراف المرسلة", en: "Review Submitted Mentorship Requests" },
    },
    Page13: {
      title: { ar: "الأفكار الجديدة", en: "New Ideas", },
      subTitle: { ar: "أفكار ملهمة تحتاج التوجيه للنمو", en: "Inspiring ideas that need guidance to grow" },
    },
    page14:{
      title :{ ar: "تقديم طلب التمويل", en: "Submit Funding Request" },
    },

    MentorPage: {
      title: { ar: "توجيهك يصنع التميز", en: "Your Guidance Makes a Difference" },
      metaDescription: {
        ar: "توجيهك يصنع الفرق. إشرف على المبتكرين، راجع الطلبات الجديدة، واستعرض الأفكار الملهمة للإشراف عليها.",
        en: "Your guidance makes the difference. Supervise innovators, review new requests, and browse inspiring ideas to oversee and contribute to the excellence of innovation.",
      },
      cards: [
        {
          title: { ar: "المبتكرين", en: "Innovators" },
          subtitle: { ar: "المبتكرين تحت إشرافك", en: "Innovators under your supervision" },
        },
        {
          title: { ar: "الطلبات", en: "Requests" },
          subtitle: { ar: "الطلبات الجديدة", en: "New Requests" },
        },
        {
          title: { ar: "تصفح الأفكار الجديدة", en: "Browse New Ideas" },
          subtitle: { ar: "اطلع على المزيد من الأفكار الملهمة للإشراف عليها", en: "Explore more inspiring ideas to supervise" },
        },
        {
          title: { ar: "طلباتي" , en: "My Requests" },
          subtitle: { ar: "طلبات الإشراف المرسلة", en: "Mentorship Requests That Have Been Sent" },
        },
      ],
    },
  
  
  
  };
  
  const translations = { common, pages };
  export default translations;
  