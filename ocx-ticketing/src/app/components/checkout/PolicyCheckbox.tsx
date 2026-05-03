"use client";

type PolicyCheckboxProps = {
  agreedToPolicies: boolean;
  onAgreementChange: (agreed: boolean) => void;
};

export default function PolicyCheckbox({
  agreedToPolicies,
  onAgreementChange,
}: PolicyCheckboxProps) {
  return (
    <div className="text-[#FAFAFA]">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          className="mt-0.5 size-5 shrink-0 rounded border-[#262626] bg-[#0A0A0A] text-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A] focus:ring-offset-0 focus:ring-offset-transparent"
          checked={agreedToPolicies}
          onChange={(e) => onAgreementChange(e.target.checked)}
        />
        <span className="text-[15px] leading-relaxed text-[#A1A1A1]">
          Tôi đồng ý với{" "}
          <a
            href="https://docs.google.com/document/u/0/d/1DAxkBCzqJTuX5Q9ROy1r5hYWMLvHpoj7AfCXG6PNF6o/mobilebasic"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#FF6B1A] underline underline-offset-2 hover:text-[#FF8534]"
            onClick={(e) => e.stopPropagation()}
          >
            các chính sách của Ban tổ chức
          </a>
        </span>
      </label>
    </div>
  );
}
