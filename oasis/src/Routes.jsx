import React, { useState, useEffect } from "react";
import { useRoutes, Navigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { db } from './auth/firebase.config';

// Páginas principales
import Home from "pages/Home";
import NotFound from "pages/NotFound";
import Page from "pages/Page";
import Page1 from "pages/Page1";
import Mentor from "pages/Mentor";
import Registration from "pages/Registration";
import Innovator from "pages/Innovator";
import Rev from "pages/Rev";
import HomePage from "pages/HomePage";
import Page3 from "pages/Page3";
import BotAI from "pages/BotAI";
import Page4 from "pages/Page4";
import Page5 from "pages/Page5";
import VerifyEmailReminder from "./pages/Registration/VerifyEmailReminder";
import OTPVerification from "./pages/Registration/OTPVerification";
import Page9 from "pages/Page9";
import Login from "pages/Login";
import Recoverpassword from "pages/Recoverpassword";
import ActionHandler from "./pages/ActionHandler";
import Page11 from "pages/Page11";
import Page12 from "pages/Page12";
import Page13 from "pages/Page13";
import Page14 from "pages/Page14";
import RecoverpasswordOne from "./pages/Recoverpassword/RecoverpasswordOne";
import Page16 from "pages/Page16";
import Page17 from "pages/Page17";
import Page18 from "pages/Page18";
import Chat from "pages/Chat";
import Page19 from "pages/Page19";
import Page21 from "pages/Page21";
import Page22 from "pages/Page22";
import Page23 from "pages/Page23";
import Page24 from "pages/Page24";
import Page25 from "pages/Page25";
import Page27 from "pages/Page27";
import FrameOne from "pages/FrameOne";
import Page29 from "pages/Page29";
import InvestorContract from "pages/investorcontract";
import InnovatorProfile from "pages/innovatorprofile";
import ReviewRequestsPage from "pages/ReviewRequestsPage/ReviewRequestsPage";
import Page30 from "pages/Page30";
import Mentorprofile from "pages/mentorprofile";

const auth = getAuth();

const AuthRoute = ({ children, publicOnly = false, allowedRoles = [], skipRedirect = false }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        const isEmailVerified = currentUser.emailVerified;
        console.log(`AuthRoute - البريد الإلكتروني مفعل: ${isEmailVerified}`);
        
        if (!isEmailVerified) {
          console.log(`AuthRoute: البريد غير مفعل`);
          setUserRole(null);
          setLoading(false);
          return;
        }
        
        let foundRole = null;
        
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            foundRole = userData.role_name || userData.currentroles;
            console.log(`AuthRoute: دور المستخدم من Firestore: ${foundRole}`);
          }
        } catch (error) {
          console.error(`AuthRoute: خطأ في جلب بيانات المستخدم: ${error.message}`);
        }
        
        if (!foundRole) {
          foundRole = localStorage.getItem('userRole') || 
                      sessionStorage.getItem('userRole') || 
                      'Innovator';
          console.log(`AuthRoute: دور المستخدم من التخزين المحلي: ${foundRole}`);
        }
        
        setUserRole(foundRole);
      } else {
        setUser(null);
        setUserRole(null);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-2xl font-bold">جاري التحميل...</div>
      </div>
    );
  }
  
  if (skipRedirect) {
    return children;
  }

  if (publicOnly) {
    return children;
  }
  
  if (!user || !user.emailVerified) {
    const message = !user 
      ? "يرجى تسجيل الدخول للوصول إلى هذه الصفحة" 
      : "يرجى تفعيل بريدك الإلكتروني أولاً";
    
    const redirectPath = !user ? "/login" : "/verify-email-reminder";
    
    return (
      <Navigate 
        to={redirectPath}
        state={{ from: location, message: message }} 
        replace 
      />
    );
  }

if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
  const arabicToEnglish = {
    'مبتكر': 'Innovator',
    'مشرف': 'Mentor',
    'محكم': 'Reviewer',
    'مستثمر': 'Investor'
  };
  
  const englishRole = arabicToEnglish[userRole];
  
  if (!englishRole || !allowedRoles.includes(englishRole)) {
    console.log(`AuthRoute: الدور غير مصرح به ${userRole}, المطلوب: ${allowedRoles.join(',')}`);
    
    return (
      <Navigate 
        to="/unauthorized" 
        state={{ 
          message: `غير مصرح لك بالوصول إلى هذه الصفحة`,
          userType: userRole,
          requiredRoles: allowedRoles
        }} 
        replace 
      />
    );
  }
}

  console.log(`AuthRoute: تم منح الوصول للمستخدم ذو الدور ${userRole}`);
  return children;
};

function getTargetPathByUserType(userType) {
  switch(userType) {
    case "مبتكر":
      return "/innovator";
    case "مشرف":
      return "/mentor"; 
    case "محكم":
      return "/rev";
    default:
      return "/";
  }
}

const UnauthorizedPage = () => {
  const location = useLocation();
  const message = location.state?.message || "غير مصرح لك بالوصول إلى هذه الصفحة";

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h1 className="text-2xl font-bold text-red-600 mb-4">غير مصرح</h1>
        <p className="text-gray-700 mb-6">{message}</p>
        <button 
          onClick={() => window.history.back()} 
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          العودة
        </button>
      </div>
    </div>
  );
};

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "*", element: <NotFound /> },
    {
      path: "verify-email-reminder", 
      element: <VerifyEmailReminder />
    },
    { 
      path: "otpverification", 
      element: <OTPVerification />
    },
    {
      path: "ReviewRequestsPage",
      element: <ReviewRequestsPage />,
    },
    {
      path: "innovatorprofile",
      element: <InnovatorProfile />
    },
    {
      path: "mentorprofile",
      element: <Mentorprofile />
    },
    {
      path: "mentor",
      element: <Mentor />,
    },
    {
      path: "registration",
      element: <Registration />,
    },
    {
      path: "innovator",
      element: <Innovator />,
    },
    {
      path: "rev",
      element: <Rev />,
    },
    {
      path: "HomePage",
      element: <HomePage />,
    },
    { path: "__/auth/action", element: <ActionHandler /> },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "recoverpassword",
      element: <Recoverpassword />,
    },
    { 
      path: "reset-password", 
      element: <RecoverpasswordOne />
    },
    {
      path: "investorcontract", 
      element: <InvestorContract /> 
    },
   
    { path: "unauthorized", element: <UnauthorizedPage /> },
    { path: "page", element: <AuthRoute><Page /></AuthRoute> },
    { path: "page1", element: <Page1 /> },
    { path: "page3", element: <AuthRoute><Page3 /></AuthRoute> },
    { path: "botai", element: <AuthRoute><BotAI /></AuthRoute> },
    { path: "page4", element: <AuthRoute><Page4 /></AuthRoute> },
    { path: "page5", element: <AuthRoute><Page5 /></AuthRoute> },
    { path: "page9", element: <AuthRoute><Page9 /></AuthRoute> },
    { path: "page11", element: <Page11 /> },
    { path: "page12", element: <AuthRoute><Page12 /></AuthRoute> },
    { path: "page13", element: <AuthRoute><Page13 /></AuthRoute> },
    { path: "page14", element: <AuthRoute><Page14 /></AuthRoute> },
    { path: "page16", element: <AuthRoute><Page16 /></AuthRoute> },
    { path: "page17", element: <AuthRoute><Page17 /></AuthRoute> },
    { path: "page18", element: <Page18 /> },
    { path: "chat", element: <AuthRoute><Chat /></AuthRoute> },
    { path: "page19", element: <AuthRoute><Page19 /></AuthRoute> },
    { path: "page21", element: <AuthRoute><Page21 /></AuthRoute> },
    { path: "page22", element: <AuthRoute><Page22 /></AuthRoute> },
    { path: "page23", element: <AuthRoute><Page23 /></AuthRoute> },
    { path: "page24", element: <AuthRoute><Page24 /></AuthRoute> },
    { path: "page25", element: <AuthRoute><Page25 /></AuthRoute> },
    { path: "page27", element: <AuthRoute><Page27 /></AuthRoute> },
    { path: "frameone", element: <AuthRoute><FrameOne /></AuthRoute> },
    { path: "page29", element: <AuthRoute><Page29 /></AuthRoute> },
    { path: "page30", element: <AuthRoute><Page30 /></AuthRoute> },
  ]);

  return element;
};

export default ProjectRoutes;