import React, { useRef, useState } from "react";
import upload_bg_img from "../assets/file_upload_bg.svg";
import analyze_bg_img from "../assets/analyze_bg_img.svg";
import Header from "../components/Header";
import upload from "../assets/upload_to_the_cloud.png";
import toast, { Toaster } from "react-hot-toast";
import { LiaFileUploadSolid } from "react-icons/lia";
import { IoCloseCircle } from "react-icons/io5";
import { Vortex } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import footer_logo from "../assets/footer_logo.svg";
import {
  Popover,
  PopoverContent,
  PopoverHandler,
} from "@material-tailwind/react";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import axios from "axios";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(null);
  const inputFile = useRef();
  const navigate = useNavigate();
  const API = `http://192.168.0.110:8000`;

  // Function to perform selection of file
  const handleClick = () => {
    inputFile.current.click();
  };

  function getCurrentDate() {
    const date = new Date();
    const curr_day = date.getDate();
    const curr_month = date.getMonth() + 1;
    const curr_year = date.getFullYear();
    const main_date = `${curr_day}/${curr_month}/${curr_year}`;
    return main_date;
  }

  // Function for validation of pdf files only
  const handleFileChange = (e) => {
    const isFile = e.target.files[0];
    if (isFile) {
      const fileType = isFile.name.split(".").pop().toLowerCase();
      if (fileType === "pdf") {
        const date = getCurrentDate();
        setSelectedFile(isFile);
        console.log(date);
      } else {
        setSelectedFile(null);
        toast.error(`Please select an 'PDF' file only`, {
          duration: 2000,
        });
      }
    }
  };

  // console.log(selectedFile);
  const openLandingPage = () => {
    navigate("/");
  };

  // Function to clear the selected file
  const clearSelectedFile = () => {
    inputFile.current.value = "";
    setSelectedFile(null);
  };

  // Function to perform anlyze task
  const analyzeFile = async () => {
    setLoading(true)
    try {
      setLoading(true);
      const formDate = new FormData();
      formDate.append("file", selectedFile);
      const response = await axios.post(`${API}/upload_PDF`, formDate);

      const date = getCurrentDate();
      console.log('Date is from Analyze function', date)
      setCurrentDate(date);
      const res_data = response.data
      console.log(response);
      

      if (res_data) {
        setTimeout(() => {
          toast.success("Data arrived");
          setLoading(false);
          navigate("/description", { state: { data: res_data}});
        }, 6000);
      } else {
        setLoading(false);
        toast.error("Error while analyzing file");
      }
    } catch (error) {
      console.log(error);
    }

    // setTimeout(() => {
    //   setLoading(false);
    //   navigate('/description')
    // }, 6000)
  };

  console.log("The current Date is ", currentDate);
  return (
    <section className="h-full">
      <Toaster />

      {/* User Details */}
      <Popover
        placement="bottom-end"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0, y: -25 },
        }}
      >
        <PopoverHandler>
          <button className="px-2.5 bg-white rounded-full text-blue-gray-700 absolute top-20 right-10 py-2.5">
            <FaUserCircle />
          </button>
        </PopoverHandler>
        <PopoverContent>
          <div>
            <button
              className="flex items-center px-3 py-2 mt-2.5 rounded-full gap-x-3 text-[#3a3a3a] hover:bg-blue-gray-100 hover:rounded-md cursor-pointer w-full"
              onClick={openLandingPage}
            >
              <MdOutlineLogout className="text-lg text-[#3a3a3a]" />
              <span className="mt-0.5 text-[15px]">Logout</span>
            </button>

            <hr className="border-[1px] w-full mt-2" />

            <button
              className="flex items-center px-3 py-2 mt-2.5 rounded-full gap-x-3 text-[#3a3a3a] hover:bg-blue-gray-100 hover:rounded-md cursor-pointer w-full"
              onClick={openLandingPage}
            >
              <MdOutlineLogout className="text-lg text-[#3a3a3a]" />
              <span className="mt-0.5 text-[15px]">Logout</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Content */}
      <div className="flex items-center justify-evenly gap-x-[10%] mx-6 mt-20 ">
        <img
          src={selectedFile ? analyze_bg_img : upload_bg_img}
          alt=""
          className="w-[30%]"
        />

        {/* File Operation part */}
        <div className="flex flex-col justify-center mt-8 bg-white rounded-md shadow-md">
          <h2 className="mt-4 text-3xl font-semibold text-center">
            {selectedFile ? "Analyze File" : "Upload File"}
          </h2>
          <hr className="border-[1px] my-4 w-full" />
          <input
            type="file"
            ref={inputFile}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {/* Upload file part */}
          {!selectedFile && (
            <div
              className="flex flex-col items-center px-28 py-10 border-dashed border-[2px] border-dark-blue rounded-md mx-8 mb-6 w-fit h-fit bg-light-neon-blue hover:cursor-pointer text-center"
              onClick={handleClick}
            >
              <img src={upload} alt="" className="w-[43%]" />
              <h1 className="text-2xl font-bold text-dark-blue">
                Click here to upload file
              </h1>
              {/* <h2 className="mt-3 text-lg">We support (20 MB per file): PDF</h2> */}
            </div>
          )}

          {/* Analyze file part */}
          {selectedFile && (
            <div className="flex flex-col px-10 mb-6 w-fit h-fit ">
              <h1 className="text-base font-bold text-dark-blue">
                We simplify the extraction of key legal data for precise
                analysis.
              </h1>
              <p className="mt-2 mb-7">
                Our aim is to refine and organize legal information,
                facilitating efficient <br /> case scrutiny and defect removal.
              </p>

              <div className="flex items-center p-2 mx-auto mt-3 rounded-md shadow gap-x-20 bg-light-grey w-fit text-dark-blue shadow-[#8d8d8d]">
                <div className="flex items-center gap-x-3">
                  <LiaFileUploadSolid className="text-3xl font-semibold" />
                  <h2 className="pr-3 text-base font-medium">
                    {selectedFile.name}
                  </h2>
                </div>
                <IoCloseCircle
                  onClick={clearSelectedFile}
                  className="text-2xl hover:cursor-pointer"
                  title="Remove File"
                />
              </div>

              <button
                className="px-5 py-1.5 bg-dark-blue text-white mt-10 rounded font-semibold w-fit mx-auto"
                onClick={analyzeFile}
              >
                Analyze
              </button>
            </div>

            
          )}

          

          {/* Loading animation */}
          {loading && (
            <div className="fullloader">
              <div className="absolute md:left-[47%] lg:left-[46%] flex flex-col w-full h-full md:top-[38%] lg:top-[36%] md:-mb-3 ">
                <Vortex
                  visible={true}
                  height="150"
                  width="150"
                  ariaLabel="vortex-loading"
                  wrapperStyle={{}}
                  wrapperClass="vortex-wrapper"
                  colors={[
                    "#2D2C82",
                    "#FF540B",
                    "#2D2C82",
                    "#FF540B",
                    "#2D2C82",
                    "#FF540B",
                  ]}
                />
                <h2 className="absolute md:top-[14%] lg:top-[19%] md:left-[-1%] lg:left-[1%]  md:text-[40px] lg:text-[25px] font-semibold text-dark-blue animate-pulse">
                  Analyzing...
                </h2>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <img src={footer_logo} alt="" className="w-[14%] mt-[6.5%] " />
      </div>
    </section>
  );
};

export default FileUpload;
