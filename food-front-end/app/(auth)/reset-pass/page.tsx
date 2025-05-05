"use client";

import { Step6 } from "../components/step6";
import { useRouter } from "next/navigation";

export default function Home() {
  const blah = {
    name: "Create new password",
    down: "Set a new password with a combination of letters and numbers for better security.",
  };
  return (
    <div className="flex pb-[110px] w-full h-full justify-center items-center ">
      <div className="flex flex-col justify-center items-start gap-6 p-10">
        <Step6 name={blah.name} down={blah.down} />
      </div>
    </div>
  );
}
