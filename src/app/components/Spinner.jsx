import React from "react";
import Image from "next/image";
import loader from "./spinner.gif";

const Spinner = () => {
  return (
    <div className="w-full h-screen flex items-start mt-40 justify-center">
      <div className="w-[10rem] h-[10rem] rounded-full border-[1.5em] border-l-[1.5em] border-l-gray-900 animate-spin">

      </div>
    </div>
  );
};

export default Spinner;