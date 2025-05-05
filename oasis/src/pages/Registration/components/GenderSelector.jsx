import React from "react";

export default function GenderSelector({ gender, onChange }) {
  return (
    <div className="reg-gender-container" style={{justifyContent: 'flex-end'}}>
      <span className="text-sm text-[#333] ml-2">الجنس:</span>
      <div className="reg-gender-option">
        <span className="text-sm text-[#333] ml-1">ذكر</span>
        <div 
          className={`reg-gender-radio ${gender === 'ذكر' ? 'selected' : ''}`}
          onClick={() => onChange('ذكر')}
        />
      </div>
      <div className="reg-gender-option">
        <span className="text-sm text-[#333] ml-1">أنثى</span>
        <div 
          className={`reg-gender-radio ${gender === 'انثى' ? 'selected' : ''}`}
          onClick={() => onChange('انثى')}
        />
      </div>
    </div>
  );
}