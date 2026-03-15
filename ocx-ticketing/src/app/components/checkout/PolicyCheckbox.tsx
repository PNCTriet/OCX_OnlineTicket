"use client";

type PolicyCheckboxProps = {
  agreedToPolicies: boolean;
  onAgreementChange: (agreed: boolean) => void;
};

export default function PolicyCheckbox({ agreedToPolicies, onAgreementChange }: PolicyCheckboxProps) {
  return (
    <div className="rounded-xl p-3 text-white">
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-[#c53e00] rounded focus:ring-[#c53e00] bg-zinc-700 border-zinc-600"
          checked={agreedToPolicies}
          onChange={(e) => onAgreementChange(e.target.checked)}
        />
        <span>
          Tôi đồng ý với{" "}
          <a
            href="https://docs.google.com/document/u/0/d/1DAxkBCzqJTuX5Q9ROy1r5hYWMLvHpoj7AfCXG6PNF6o/mobilebasic"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#c53e00] focus:outline-none focus:ring-2 focus:ring-[#c53e00] focus:ring-offset-1 focus:ring-offset-transparent rounded"
            onClick={(e) => e.stopPropagation()}
          >
            các chính sách của Ban tổ chức
          </a>
        </span>
      </label>
    </div>
  );
} 