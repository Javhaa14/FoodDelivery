"use client";
import { Categories } from "./components/Categories";

export default function Home() {
  return (
    <div className="w-screen h-fit flex flex-col justify-center items-center">
      <img src="del.jpg" className="w-screen pt-[70px]" />
      <Categories />
    </div>
  );
}
