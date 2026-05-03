"use client";

import { useState } from "react";
import { CHECKOUT_PROMO_ENABLED } from "@/lib/flags";

type UserInfo = {
  fullName: string;
  email: string;
  phone: string;
  facebook: string;
  refcode: string;
};

type CheckoutFormProps = {
  userInfo: UserInfo;
  onUserInfoChange: (field: string, value: string) => void;
  validationErrors?: {
    phone?: string;
    name?: string;
    facebook?: string;
    refcode?: string;
  };
};

/**
 * V2 buyer-details form. Props and validation behavior match
 * `app/components/checkout/UserInfoForm` for Phase 2 swap without touching handlers.
 */
export default function CheckoutForm({
  userInfo,
  onUserInfoChange,
  validationErrors,
}: CheckoutFormProps) {
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    facebook: "",
    refcode: "",
  });

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "fullName":
        return value.trim() === "" ? "Vui lòng nhập họ và tên" : "";
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? "Email không hợp lệ" : "";
      }
      case "phone": {
        const phoneRegex = /^\d{10,}$/;
        return !phoneRegex.test(value) ? "Số điện thoại phải có ít nhất 10 chữ số" : "";
      }
      case "facebook":
        if (value.trim() === "") return "Vui lòng nhập link Facebook";
        {
          const facebookRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/.+/;
          return !facebookRegex.test(value) ? "Link Facebook không hợp lệ" : "";
        }
      case "refcode":
        if (value.trim() === "") return "";
        if (!value.startsWith("#ocx")) return "Mã giới thiệu không hợp lệ";
        if (value.length !== 11) return "Mã giới thiệu không hợp lệ";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (field: string, value: string) => {
    if (field !== "phone" && field !== "facebook" && field !== "refcode") return;

    onUserInfoChange(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  };

  const displayErrors = {
    phone: validationErrors?.phone || errors.phone,
    name: validationErrors?.name || errors.fullName,
    facebook: validationErrors?.facebook || errors.facebook,
    refcode: validationErrors?.refcode || errors.refcode,
  };

  const inputBase =
    "w-full rounded-lg border bg-[#141414] px-3 py-2.5 text-[15px] text-[#FAFAFA] transition-colors placeholder:text-[#737373] focus:border-[#FF6B1A] focus:outline-none focus:ring-2 focus:ring-[#FF6B1A]/40";
  const inputDisabled =
    "cursor-not-allowed border-[#262626] bg-[#141414] text-[#A1A1A1]";
  const inputEditable = "border-[#262626]";

  return (
    <div className="rounded-xl border border-[#262626] bg-[#141414] p-6">
      <h2 className="mb-4 text-lg font-semibold text-[#FAFAFA]">
        Thông tin người nhận vé
      </h2>
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[#A1A1A1]">Họ và tên</label>
          <input
            type="text"
            placeholder="Họ và tên"
            className={`${inputBase} ${inputDisabled}`}
            value={userInfo.fullName}
            disabled
            readOnly
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[#A1A1A1]">Email</label>
          <input
            type="email"
            placeholder="Email"
            className={`${inputBase} ${inputDisabled}`}
            value={userInfo.email}
            disabled
            readOnly
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[#A1A1A1]">
            Số điện thoại
          </label>
          <input
            type="tel"
            placeholder="Số điện thoại"
            className={`${inputBase} ${inputEditable} ${
              displayErrors.phone ? "border-[#F87171]" : ""
            }`}
            value={userInfo.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          {displayErrors.phone && (
            <p className="text-[13px] text-[#F87171]">{displayErrors.phone}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[#A1A1A1]">
            Link Facebook
          </label>
          <input
            type="url"
            placeholder="Link Facebook"
            className={`${inputBase} ${inputEditable} ${
              displayErrors.facebook ? "border-[#F87171]" : ""
            }`}
            value={userInfo.facebook}
            onChange={(e) => handleChange("facebook", e.target.value)}
          />
          {displayErrors.facebook && (
            <p className="text-[13px] text-[#F87171]">{displayErrors.facebook}</p>
          )}
        </div>

        {CHECKOUT_PROMO_ENABLED && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[#A1A1A1]">
              Mã giới thiệu (không bắt buộc)
            </label>
            <input
              type="text"
              placeholder="Mã giới thiệu (không bắt buộc)"
              maxLength={11}
              className={`${inputBase} ${inputEditable} ${
                displayErrors.refcode ? "border-[#F87171]" : ""
              }`}
              value={userInfo.refcode}
              onChange={(e) => handleChange("refcode", e.target.value)}
            />
            {displayErrors.refcode && (
              <p className="text-[13px] text-[#F87171]">{displayErrors.refcode}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
