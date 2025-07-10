"use client";
import { useState } from "react";

type UserInfo = {
  fullName: string;
  email: string;
  phone: string;
};

type UserInfoFormProps = {
  userInfo: UserInfo;
  onUserInfoChange: (field: string, value: string) => void;
};

export default function UserInfoForm({ userInfo, onUserInfoChange }: UserInfoFormProps) {
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: ""
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
      default:
        return "";
    }
  };

  const handleChange = (field: string, value: string) => {
    onUserInfoChange(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: validateField(field, value)
    }));
  };

  return (
    <div className="bg-zinc-900/30 rounded-xl p-6 shadow-lg backdrop-blur-sm text-white">
      <h2 className="text-xl font-bold mb-4">Thông tin người nhận vé</h2>
      <div className="space-y-4">
        {/* Full Name */}
        <div className="relative">
          <input
            type="text"
            placeholder="Họ và tên"
            className={`w-full p-3 pl-10 rounded-lg bg-zinc-800 border ${
              errors.fullName ? 'border-red-500' : 'border-zinc-700'
            } focus:ring-2 focus:ring-[#c53e00] focus:border-transparent text-white`}
            value={userInfo.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white">✏️</button>
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>
        {/* Email */}
        <div className="relative">
          <input
            type="email"
            placeholder="Email"
            className={`w-full p-3 pl-10 rounded-lg bg-zinc-800 border ${
              errors.email ? 'border-red-500' : 'border-zinc-700'
            } focus:ring-2 focus:ring-[#c53e00] focus:border-transparent text-white`}
            value={userInfo.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 0a2 2 0 00-2-2H7a2 2 0 00-2 2m0 0v8a2 2 0 002 2h10a2 2 0 002-2V8m-2 0l-7 4.5L5 8"></path></svg>
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white">✏️</button>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        {/* Phone */}
        <div className="relative">
          <input
            type="tel"
            placeholder="Số điện thoại"
            className={`w-full p-3 pl-10 rounded-lg bg-zinc-800 border ${
              errors.phone ? 'border-red-500' : 'border-zinc-700'
            } focus:ring-2 focus:ring-[#c53e00] focus:border-transparent text-white`}
            value={userInfo.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white">✏️</button>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>
    </div>
  );
} 