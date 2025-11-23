"use client";

import { SERVER_PORT, SYSTEM_IP } from "@remotely/utils/constants";
import { generateHash } from "@remotely/utils/helpers";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import useExpoStore from "~/store/useExpoStore";

export default function PasscodeInput() {
  const [values, setValues] = useState(Array(6).fill(""));
  const refs = useRef<HTMLInputElement[]>([]);
  const [passcodeHash, setPasscodeHash] = useState(0);

  const { toggleClientVerified } = useExpoStore();

  const handleChange = (i: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(0, 1);
    const updated = [...values];
    updated[i] = digit;
    setValues(updated);

    if (digit && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (
    i: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !values[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const verifyPasscode = () => {
    const code = values.join("");
    const codeHash = generateHash(code);

    if (passcodeHash != 0) {
      if (codeHash === passcodeHash) {
        toast.success("Client verified!");
        toggleClientVerified();
      } else {
        toast.error("Passcode is incorrect!");
        setValues(Array(6).fill(""));
        refs.current[0]?.focus();
      }
    } else toast.error("Failed to get passcode from server!");
  };

  const getPasscodeHash = async () => {
    const codeResp = await fetch(`http://${SYSTEM_IP}:${SERVER_PORT}/code`);
    const { code } = await codeResp.json();
    setPasscodeHash(code);
  };

  useEffect(() => {
    getPasscodeHash();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <p className="text-sm text-gray-600 dark:text-gray-300 text-center px-3">
        Please enter the passcode showing on the server CLI to access the
        explorer.
      </p>

      <div className="flex items-center justify-center gap-3">
        {values.map((val, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el!;
            }}
            type="text"
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            autoFocus={i === 0}
            className="
              w-12 h-14 rounded-2xl
              text-center text-2xl font-semibold tracking-wide
              bg-white dark:bg-gray-900
              text-black dark:text-white
              border border-gray-300 dark:border-gray-700
              shadow-sm
              focus:outline-none focus:ring-2 focus:ring-gray-400
              transition-all duration-150
            "
          />
        ))}
      </div>

      <button
        onClick={verifyPasscode}
        className="
          px-6 py-2.5 mt-2
          rounded-2xl
          bg-black text-white
          dark:bg-white dark:text-black
          font-semibold
          shadow-md
          transition-all duration-150
          hover:scale-[1.03]
          active:scale-[0.98]
        "
      >
        Verify
      </button>
    </div>
  );
}
