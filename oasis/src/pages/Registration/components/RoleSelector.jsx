import React from "react";

export default function RoleSelector({
 selectedRole,
 availableRoles = [],
 isDropdownOpen,
 setIsDropdownOpen,
 onSelect,
 error,
 formSubmitted
}) {
 const hasRoles = Array.isArray(availableRoles) && availableRoles.length > 0;

 const handleRoleSelect = (role) => {
   try {
     localStorage.setItem('userRole', role.name);
     localStorage.setItem('userRolePath', role.path);
   } catch (error) {
     console.error("خطأ في تخزين معلومات الدور:", error);
   }

   onSelect(role);
 };

 return (
   <div className="relative w-full">
     <button
       type="button"
       className={`reg-dropdown-toggle ${error && formSubmitted ? 'reg-input-error' : ''}`}
       onClick={() => setIsDropdownOpen(!isDropdownOpen)}
     >
       <svg 
         className={`w-4 h-4 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
         fill="none" 
         viewBox="0 0 24 24" 
         stroke="black"
       >
         <path 
           strokeLinecap="round" 
           strokeLinejoin="round" 
           strokeWidth={2} 
           d="M19 9l-7 7-7-7" 
         />
       </svg>
       <span className="flex-grow text-right">{selectedRole ? selectedRole.name : "دور المستخدم *"}</span>
     </button>

     {error && formSubmitted && (
       <div className="reg-error-message">
         <div className="alert">
           <svg 
             stroke="currentColor" 
             viewBox="0 0 24 24" 
             fill="none" 
             xmlns="http://www.w3.org/2000/svg"
           >
             <path
               d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
               strokeWidth="2"
               strokeLinejoin="round"
               strokeLinecap="round"
             ></path>
           </svg>
           <p>{error}</p>
         </div>
       </div>
     )}

     {isDropdownOpen && (
       <div className="reg-dropdown-menu absolute right-0 left-0 mt-1 z-50">
         {hasRoles ? (
           availableRoles.map((role) => (
             <React.Fragment key={role.id || role.name}>
               <div
                 className="reg-dropdown-item"
                 onClick={() => handleRoleSelect(role)}
               >
                 <div className="reg-role-item">
                   <span className="reg-role-name">{role.name}</span>
                   <span className="reg-role-description">{role.description}</span>
                 </div>
               </div>
               {role !== availableRoles[availableRoles.length - 1] && (
                 <div className="border-t border-gray-100"></div>
               )}
             </React.Fragment>
           ))
         ) : (
           <div className="reg-dropdown-item">
             <div className="reg-role-item">
               <span className="reg-role-name">لا توجد أدوار متاحة</span>
             </div>
           </div>
         )}
       </div>
     )}
   </div>
 );
}
