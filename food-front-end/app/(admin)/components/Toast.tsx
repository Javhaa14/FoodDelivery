"use client";

import React, { useEffect } from "react";

interface UndoToastProps {
  show: boolean;
  message1: string;
  message2: string;
  duration?: number;
  onUndo: () => void;
  onTimeout: () => void;
}

export const UndoToast: React.FC<UndoToastProps> = ({
  show,
  message1,
  message2,
  duration = 5000,
  onUndo,
  onTimeout,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onTimeout();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onTimeout]);

  return (
    <div
      className={`fixed w-fit left-[40%] top-[10px] p-4 rounded-xl shadow-lg bg-[#18181b] text-white flex items-center z-30 gap-4 
        transition-all transform duration-200 ease-out ${
          show
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-10"
        }`}>
      <div className="flex flex-col">
        <span className="font-bold">{message1}</span>
        <span>{message2}</span>
      </div>
      <button
        onClick={onUndo}
        className="cursor-pointer flex h-[32px] px-3 justify-center items-center gap-[10px] rounded-md border-[1px] border-[#E4E4E7] hover:bg-white hover:text-black transition-all ease-in-out">
        Undo
      </button>
    </div>
  );
};
