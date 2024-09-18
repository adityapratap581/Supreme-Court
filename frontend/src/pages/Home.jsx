import React, { useState } from "react";
import Header from "../components/Header";
import bg_img from "../assets/home_bg_img.svg";
import footer_logo from "../assets/footer_logo.svg";
import LoginForm from "../components/LoginForm";

const Home = () => {
  return (
    <section className="overflow-hidden sm:items-centers sm:flex sm:gap-y-[2%] sm:flex-col md:flex lg:flex xl:flex sm:overscroll-y-auto md:overflow-y-hidden lg:overflow-y-hidden xl:overflow-y-hidden lg:mt-0 md:mt-10 sm:mt-24 mt-20 ">
      <img
        src={bg_img}
        alt="bg_img"
        className="inline mx-auto sm:mx-auto sm:mt-3 mt-3 sm:w-[90%] w-full sm:inline md:hidden lg:hidden "
      />

      {/* Content */}
      <div className="mt-0 sm:flex sm:flex-col sm:mt-4 flex justify-center gap-x-[18%] items-center  px-8  md:flex md:items-center md:flex-row lg:flex-row md:justify-center md:gap-x-[10%] md:mt-16 md:px-5 lg:flex lg:items-center lg:justify-center lg:gap-x-[15%] lg:mt-20 lg:px-6">
        <div className="mt-10">
          <h2 className="lg:text-5xl md:text-4xl sm:text-3xl text-3xl text-dark-blue font-normal lg:leading-[120%] md:leadinng-[100%] sm:leading-[130%]">
            Simplifying Legal Data Extraction <br className="hidden md:inline lg:inline"/> with{" "}
            <span className="font-bold">JuriAssist</span>
          </h2>
          <p className="lg:mt-5 md:mt-4 sm:mt-3 mt-3 text-xl font-semibold text-dark-blue lg:leading-[120%] md:leading-[130%] sm:leading-[140%] leading-[140%]">
            AI-powered tool for efficient and accurate legal data-extraction,
            <br className="hidden md:inline lg:inline"/> error-detection, and correction.
          </p>

          <LoginForm />
        </div>

        {/* img */}
        <img
          src={bg_img}
          alt="bg_img"
          className="w-[36%] sm:hidden hidden md:inline lg:inline xl:inline"
        />
      </div>

      {/* Footer */}
      <div className=" flex justify-center lg:mt-[12%] md:mt-[13%] sm:mt-[20%] mt-[14%]">
        <img src={footer_logo} className="lg:w-[14%] md:w-[20%] sm:w-[30%] w-[40%]" />
      </div>
    </section>
  );
};

export default Home;
