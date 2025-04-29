"use client";
import { useState } from "react";
import { Categories } from "./components/Categories";

export default function Home() {
  return (
    <div className="w-[1440px] h-fit flex flex-col justify-center items-center">
      <img src="del.jpg" className="w-[1600px] pt-[70px]" />
      <Categories />
    </div>
  );
}
