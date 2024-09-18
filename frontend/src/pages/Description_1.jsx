import {
  Dialog,
  DialogBody,
  DialogHeader,
  Popover,
  PopoverContent,
  PopoverHandler,
  Tooltip,
} from "@material-tailwind/react";
import React, { Suspense, useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose, IoCloseCircle } from "react-icons/io5";
import { CiMemoPad } from "react-icons/ci";
import { SlOptionsVertical } from "react-icons/sl";
import { CgSoftwareUpload } from "react-icons/cg";
import { BiSolidShow } from "react-icons/bi";

import pdf from "../documents/IEEE_paper.pdf";
import pdf_1 from "../documents/d2 1.pdf";
import toast, { Toaster } from "react-hot-toast";

// const PDFViewer = React.lazy(() => import("../components/PDFViewer"));

const Description_1 = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state;

  // console.log(date);

  const [isOpen, setIsOpen] = useState(false); // state fpr sidebar for previous session
  const [openPDF, setOpenPDF] = useState(false); // State for opening pdf
  const [currentDate, setCurrentDate] = useState("");
  const [check, isCheck] = useState(false);

  console.log("Data came to description", data);
  // console.log(date);
  // console.log(typeof data.data);

  const openLandingPage = () => {
    navigate("/");
  };
  const openUploadFile = () => {
    navigate("/file_upload");
  };

  // Function for handling sidebar functionality
  const handleSideBar = () => {
    setIsOpen(!isOpen);
  };

  // Functionality for opening pdf...
  const openingPDF = () => {
    setOpenPDF(!openPDF);
  };

  const closingPDF = () => {
    setOpenPDF(!openPDF);
  };

  useEffect(() => {
    const date = new Date();
    const curr_day = date.getDate();
    const curr_month = date.getMonth() + 1;
    const curr_year = date.getFullYear();
    setCurrentDate(`${curr_day}/${curr_month}/${curr_year}`);
  }, []);

  const handleCheckBox = () => {};

  return (
    <section className="h-screen pb-10">
      <Toaster />
      {/* Navigation */}
      <Popover
        placement="bottom-end"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0, y: -25 },
        }}
      >
        <Tooltip content="Options" placement="left">
          <PopoverHandler>
            <button className="absolute px-2 py-2 bg-white rounded-full text-blue-gray-700 top-16 right-5">
              <SlOptionsVertical />
            </button>
          </PopoverHandler>
        </Tooltip>
        <PopoverContent>
          <div>
            <button
              className="flex items-center px-3 py-2 mt-2.5 rounded-full gap-x-3 text-[#3a3a3a] hover:bg-blue-gray-100 hover:rounded-md cursor-pointer w-full"
              onClick={openUploadFile}
            >
              <CgSoftwareUpload className="text-lg text-[#3a3a3a]" />
              <span className="mt-0.5 text-[15px]">Reupload</span>
            </button>

            <hr className="border-[1px] w-full my-1.5" />

            <button
              className="flex items-center px-3 py-2 mt-2 rounded-full gap-x-3 text-[#3a3a3a] hover:bg-blue-gray-100 hover:rounded-md cursor-pointer w-full"
              onClick={openLandingPage}
            >
              <MdOutlineLogout className="text-lg text-[#3a3a3a]" />
              <span className="mt-0.5 text-[15px]">Logout</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Description Data */}
      <div className="flex h-screen overflow-x-hidden">
        {/* Sidebar */}
        <div
          className={`bg-dark-blue fixed top-2 ${
            isOpen ? "w-[17%]" : "w-[4%]"
          } duration-150 sticky `}
        >
          {isOpen ? (
            <Tooltip content="Material Tailwind" placement="top-end">
              <IoClose
                onClick={handleSideBar}
                className="my-3 ml-2 text-3xl font-bold text-white cursor-pointer"
              />
            </Tooltip>
          ) : (
            <div className="flex flex-col justify-between h-[91%]">
              <Tooltip content="Open sidebar" placement="right">
                <RxHamburgerMenu
                  onClick={handleSideBar}
                  className="m-3 text-3xl font-extrabold text-white cursor-pointer"
                />
              </Tooltip>

              <FaUserCircle
                className="mx-3 text-3xl font-extrabold text-white cursor-pointer"
                onClick={handleSideBar}
              />
            </div>
          )}

          {isOpen ? (
            <div className="">
              {/* Previous Session */}
              <div className="">
                <h2 className="ml-2 text-lg font-bold text-white ">
                  Previous Session
                </h2>
                <ul className="flex flex-col h-[70vh] mt-2 overflow-y-auto text-white gap-y-1 mx-2">
                  <li className="flex items-center gap-x-2 px-2 py-1.5 hover:cursor-pointer rounded-sm w-[96%] hover:bg-[#ffffff49]">
                    <CiMemoPad className="text-2xl" />{" "}
                    <p className="truncate">Previous Data</p>
                  </li>
                  <li className="flex items-center gap-x-2 px-2 py-1.5 hover:cursor-pointer rounded-sm w-[96%] hover:bg-[#ffffff49]">
                    <CiMemoPad className="text-2xl" />{" "}
                    <p className="truncate">Previous Data</p>
                  </li>
                  <li className="flex items-center gap-x-2 px-2 py-1.5 hover:cursor-pointer rounded-sm w-[96%] hover:bg-[#ffffff49]">
                    <CiMemoPad className="text-2xl" />{" "}
                    <p className="truncate">Previous Data</p>
                  </li>
                </ul>
              </div>

              {/* User info */}
              <div className="flex items-center p-2.5 mt-4 shadow-[#ffffff6f] shadow-md mx-2 bg-white rounded-md text-dark-blue gap-x-2">
                <FaUserCircle className="text-2xl" />
                <p className="truncate">Test@gmail.com</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Data Description */}
        <div className="flex flex-col w-full p-4 overflow-y-auto">
          <h1 className="text-lg text-dark-blue">
            Extracted Data from <span className="font-bold">Test_1.pdf</span>{" "}
            file
          </h1>

          {/* Data description */}
          <div className="w-[97%] p-3 mx-2 mt-6 bg-white rounded">
            <h2 className="text-xl font-extrabold">Description</h2>
            <form className="flex flex-col w-full mt-3 gap-y-3">
              {/* Row 1 */}
              <div className="flex justify-center">
                <div className="flex items-center w-[50%] gap-x-10  justify-start">
                  <label className="font-semibold">Name of Petitioner: </label>
                  <input
                    type="text"
                    className="text-dark-grey focus:outline-none border-[1.3px] border-gray-300 rounded px-2 py-1 w-[65%]"
                    value={data.map((item) => item["petioner_name"])}
                    disabled
                  />
                </div>
                <div className="flex items-center w-[50%] gap-x-10   justify-center">
                  <label className="font-semibold">Name of Respondent:</label>
                  <input
                    type="text"
                    className="text-dark-grey focus:outline-none border-[1.3px] border-gray-300 rounded px-2 py-1 w-[65%]"
                    value={data.map((item) => item["respondent_name"])}
                    disabled
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex justify-center">
                <div className="flex items-center w-[50%] gap-x-[9.2%]  justify-start">
                  <label className="font-semibold">Type of Petition:</label>
                  <input
                    type="text"
                    className="text-dark-grey focus:outline-none border-[1.3px] border-gray-300 rounded px-2 py-1 w-[65%]"
                    value={data.map(
                      (item) =>
                        item["type of petition"].charAt(0).toUpperCase() +
                        item["type of petition"].slice(1)
                    )}
                    disabled
                  />
                </div>
                <div className="flex items-center w-[50%] gap-x-10 justify-center">
                  <label className="mr-2 font-semibold">
                    Category of Petition:
                  </label>
                  <input
                    type="text"
                    className="text-dark-grey focus:outline-none border-[1.3px] border-gray-300 rounded px-2 py-1 w-[65%]"
                    value={data.map(
                      (item) =>
                        item["category"].charAt(0).toUpperCase() +
                        item["category"].slice(1)
                    )}
                    disabled
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Table Data */}
          <div className="flex flex-col w-full p-4 overflow-y-auto">
            {/* Description */}
            <div className="w-[99.4%] h-full p-3 mt-6 -ml-2 bg-white rounded">
              <h2 className="text-xl font-bold">Table of Defected Data</h2>

              <div className="h-[90%] overflow-y-auto mt-3">
                <table className="w-full">
                  <thead className="sticky z-10 bg-white -top-1">
                    <tr>
                      <th className="border-[1px] w-[4%] text-start text-sm p-1">
                        Sr. No.
                      </th>
                      <th className="border-[1px] w-[4%] text-start text-sm p-1">
                        Prepare Date
                      </th>
                      <th className="border-[1px] w-[4%] text-start text-sm p-1">
                        Remove Date
                      </th>
                      <th className="border-[1px] w-[10%] text-sm p-1">
                        Defect Description
                      </th>
                      <th className="border-[1px] w-[45%] text-sm text-start px-1">
                        Defect Remark
                      </th>
                      <th className="border-[1px] text-sm w-[6%] px-1">
                        Approved
                      </th>
                      {/* <th className="border-[1px] text-sm w-[4%] px-1">
                        See Defect
                      </th> */}
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((defectItem, index) => {
                      const defects = Object.keys(defectItem).filter(
                        (key) =>
                          Array.isArray(defectItem[key]) &&
                          defectItem[key].length > 0
                      );

                      return defects.map((defectType, defectIndex) => (
                        <tr key={`${index}-${defectType}`}>
                          <td className="border-[1px] p-1 text-center">
                            {defectIndex + 1}.
                          </td>
                          <td className="border-[1px] p-1 text-center">
                            {currentDate}
                          </td>
                          <td className="border-[1px] p-1 text-center">
                            10/09/2024
                          </td>
                          <td className="border-[1px] p-1 text-center">
                            {defectType === "language_defect"
                              ? "Other_language_defect"
                              : defectType === "General_Defect"
                              ? "Other_General_Defect"
                              : defectType === "Scan_Defect"
                              ? "Other_Scan_Defect"
                              : defectType === "Stamp_Defect"
                              ? "Other_Stamp Defect"
                              : defectType === "Alias_defect"
                              ? "Other_Alias defect"
                              : defectType === "Underline_Defect"
                              ? "Other_Underline Defect"
                              : defectType.replace(" ", "_")}
                          </td>
                          <td className="border-[1px] p-1">
                            {Array.isArray(defectItem[defectType]) ? (
                              <>
                                {defectType === "Stamp_Defect"
                                  ? defectItem[defectType]
                                      .slice(0, 1)
                                      .map((item, idx) => (
                                        <>
                                          <span key={idx} className="">
                                            {` Kindly Upload the corrected scaned copy of / Stamp mark overlapping with text / Illigitimate scan ${item.split(
                                              ".png"
                                            )}`}
                                          </span>
                                          {item.length < 1 ? null : (
                                            <Tooltip
                                              content={defectItem[defectType]
                                                .join(", ")
                                                .split(".png")}
                                            >
                                              <a className="underline cursor-pointer">
                                                ...
                                              </a>
                                            </Tooltip>
                                          )}
                                        </>
                                      ))
                                  : defectType === "Scan_Defect"
                                  ? defectItem[defectType]
                                      .slice(0, 1)
                                      .map((item, idx) => (
                                        <>
                                          <span key={idx} className="">
                                            {` Kindly Upload the corrected scaned copy of / Stamp mark overlapping with text / Illigitimate scan ${item.split(
                                              ".png"
                                            )}`}
                                          </span>

                                          {item.length < 1 ? null : (
                                            <Tooltip
                                              content={defectItem[defectType]
                                                .join(", ")
                                                .split(".png")}
                                            >
                                              <a className="underline cursor-pointer">
                                                ...
                                              </a>
                                            </Tooltip>
                                          )}
                                        </>
                                      ))
                                  : defectType === "Underline_Defect"
                                  ? defectItem[defectType]
                                      .slice(0, 1)
                                      .map((item, idx) => (
                                        <>
                                          <span key={idx} className="">
                                            {` Remove lines from ${item.split(
                                              ".png"
                                            )}`}
                                          </span>

                                          {item.length < 1 && (
                                            <Tooltip
                                              content={defectItem[defectType]
                                                .join(", ")
                                                .split(".png")}
                                            >
                                              <a className="underline cursor-pointer">
                                                ...
                                              </a>
                                            </Tooltip>
                                          )}
                                        </>
                                      ))
                                  : defectType === "language_defect"
                                  ? defectItem[defectType]
                                      .slice(0, 1)
                                      .map((item, idx) => (
                                        <>
                                          <span key={idx} className="">
                                            {` Make sure translated copy of vurnicular doc has been uploaded ${item.split(
                                              ".png"
                                            )}`}
                                          </span>

                                          {item.length < 1 && (
                                            <Tooltip
                                              content={defectItem[defectType]
                                                .join(", ")
                                                .split(".png")}
                                            >
                                              <a className="underline cursor-pointer">
                                                ...
                                              </a>
                                            </Tooltip>
                                          )}
                                        </>
                                      ))
                                  : defectType === "Alias_defect"
                                  ? defectItem[defectType]
                                      .slice(0, 1)
                                      .map((item, idx) => (
                                        <>
                                          <span key={idx} className="">
                                            {` Alias found for 'Names' has to mentioned on page ${item.split(
                                              ".txt"
                                            )}`}
                                          </span>

                                          {item.length < 1 ? null : (
                                            <Tooltip
                                              content={defectItem[defectType]
                                                .join(", ")
                                                .split(".txt")}
                                            >
                                              <a className="underline cursor-pointer">
                                                ...
                                              </a>
                                            </Tooltip>
                                          )}
                                        </>
                                      ))
                                  : defectType === "General_Defect"
                                  ? defectItem[defectType]
                                      .slice(0, 1)
                                      .map((item, idx) => (
                                        <>
                                          <span key={idx} className="">
                                            {` Kindly check multiple response / was found kindly check and reupload ${item.split(
                                              ".txt"
                                            )} the corrected doc.`}
                                          </span>

                                          {item.length <= 1 ? null : (
                                            <Tooltip
                                              content={defectItem[defectType]
                                                .join(", ")
                                                .split(".txt")}
                                            >
                                              <a className="underline cursor-pointer">
                                                ...
                                              </a>
                                            </Tooltip>
                                          )}
                                        </>
                                      ))
                                  : defectItem[defectType]
                                      .slice(0, 3)
                                      .map((item, idx) => (
                                        <span
                                          key={idx}
                                          className="font-semibold"
                                        >
                                          {` ${item}`}
                                        </span>
                                      ))}
                              </>
                            ) : null}
                            {/* {
                              defectItem === 'Scan Defect' ? (
                                defectItem.Scan_Defect 

                                defectItem[defectType]
                                      .slice(0, 3)
                                      .map((item, idx) => (
                                        <span
                                          key={idx}
                                          className="font-semibold"
                                        >
                                          {` ${item}`}
                                        </span>
                                      ))}
                              )
                            } */}

                            {/* Display defect details for General_Defect */}
                          </td>
                          <td className="border-[1px] p-1 text-center">
                            <input type="checkbox" onChange={handleCheckBox} />
                          </td>
                          {/* <td className="text-xl text-dark-blue border-[1px] p-1 px-4">
                            <BiSolidShow />
                          </td> */}
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* {openPDF ? (
            <div className="w-[97%] mt-6 p-3 pb-5 px-5 mb-12 ml-2 bg-white rounded-md">
              <div className="flex items-center justify-between">
                <h2 className="mb-3 text-xl font-bold">Detailed Defects</h2>
                <Tooltip content={"Close"} placement="left">
                  <h2 className="text-2xl cursor-pointer" onClick={closingPDF}>
                    <IoCloseCircle className="duration-100 hover:text-red-400" />
                  </h2>
                </Tooltip>
              </div>
              <Suspense
                fallback={
                  <h2 className="animate-pulse">
                    PDF is loading please wait...
                  </h2>
                }
              >
                <PDFViewer pdfUrl={pdf_1} />
              </Suspense>
            </div>
          ) : null} */}
          </div>

          {/* {openPDF ? (
            <div className="w-[97%] mt-6 p-3 pb-5 px-5 mb-12 ml-2 bg-white rounded-md">
              <div className="flex items-center justify-between">
                <h2 className="mb-3 text-xl font-bold">Detailed Defects</h2>
                <Tooltip content={"Close"} placement="left">
                  <h2 className="text-2xl cursor-pointer" onClick={closingPDF}>
                    <IoCloseCircle className="duration-100 hover:text-red-400" />
                  </h2>
                </Tooltip>
              </div>
              <Suspense
                fallback={
                  <h2 className="animate-pulse">
                    PDF is loading please wait...
                  </h2>
                }
              >
                <PDFViewer pdfUrl={pdf_1} />
              </Suspense>
            </div>
          ) : null} */}
        </div>
      </div>
    </section>
  );
};

export default Description_1;
