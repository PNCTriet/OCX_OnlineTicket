"use client";
import { useState } from "react";

type UserInfo = {
  fullName: string;
  email: string;
  phone: string;
  facebook: string;
};

type UserInfoFormProps = {
  userInfo: UserInfo;
  onUserInfoChange: (field: string, value: string) => void;
  validationErrors?: {
    phone?: string;
    name?: string;
    facebook?: string;
  };
};

export default function UserInfoForm({ userInfo, onUserInfoChange, validationErrors }: UserInfoFormProps) {
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    facebook: ""
  });

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "fullName":
        return value.trim() === "" ? "Vui lòng nhập họ và tên" : "";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? "Email không hợp lệ" : "";
      case "phone":
        const phoneRegex = /^\d{10,}$/;
        return !phoneRegex.test(value) ? "Số điện thoại phải có ít nhất 10 chữ số" : "";
      case "facebook":
        // Facebook URL validation (required field)
        if (value.trim() === "") return "Vui lòng nhập link Facebook";
        const facebookRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/.+/;
        return !facebookRegex.test(value) ? "Link Facebook không hợp lệ" : "";
      default:
        return "";
    }
  };

  const handleChange = (field: string, value: string) => {
    // Only allow editing phone and facebook
    if (field !== "phone" && field !== "facebook") return;
    
    onUserInfoChange(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: validateField(field, value)
    }));
  };

  // Use validation errors from parent if provided, otherwise use local errors
  const displayErrors = {
    phone: validationErrors?.phone || errors.phone,
    name: validationErrors?.name || errors.fullName,
    facebook: validationErrors?.facebook || errors.facebook
  };

  return (
    <div className="bg-zinc-900/30 rounded-xl p-6 shadow-lg backdrop-blur-sm text-white">
      <h2 className="text-xl font-bold mb-4">Thông tin người nhận vé</h2>
      <div className="space-y-4">
        {/* Full Name - Disabled */}
        <div className="relative">
          <input
            type="text"
            placeholder="Họ và tên"
            className="w-full p-3 pl-10 pr-10 rounded-lg bg-zinc-700 border border-zinc-600 text-zinc-300 cursor-not-allowed"
            value={userInfo.fullName}
            disabled
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          </div>
          <p className="text-zinc-400 text-xs mt-1">Tên được lấy từ tài khoản Google</p>
        </div>
        
        {/* Email - Disabled */}
        <div className="relative">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 pl-10 pr-10 rounded-lg bg-zinc-700 border border-zinc-600 text-zinc-300 cursor-not-allowed"
            value={userInfo.email}
            disabled
          />
          <p className="text-zinc-400 text-xs mt-1">Email được lấy từ tài khoản Google</p>
        </div>
        
        {/* Phone - Editable */}
        <div className="relative">
          <input
            type="tel"
            placeholder="Số điện thoại"
            className={`w-full p-3 pl-10 pr-10 rounded-lg bg-zinc-800 border ${
              displayErrors.phone ? 'border-red-500' : 'border-zinc-700'
            } focus:ring-2 focus:ring-[#c53e00] focus:border-transparent text-white`}
            value={userInfo.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          {displayErrors.phone && (
            <p className="text-red-500 text-sm mt-1">{displayErrors.phone}</p>
          )}
          <p className="text-zinc-400 text-xs mt-1">Vui lòng nhập số điện thoại để nhận thông báo</p>
        </div>

        {/* Facebook - Editable */}
        <div className="relative">
          <input
            type="url"
            placeholder="Link Facebook"
            className={`w-full p-3 pl-10 pr-10 rounded-lg bg-zinc-800 border ${
              displayErrors.facebook ? 'border-red-500' : 'border-zinc-700'
            } focus:ring-2 focus:ring-[#c53e00] focus:border-transparent text-white`}
            value={userInfo.facebook}
            onChange={(e) => handleChange("facebook", e.target.value)}
          />
          {displayErrors.facebook && (
            <p className="text-red-500 text-sm mt-1">{displayErrors.facebook}</p>
          )}
          <p className="text-zinc-400 text-xs mt-1">Vui lòng nhập link Facebook để nhận thông báo</p>
        </div>
      </div>
    </div>
  );
} 