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
import { MdDataArray, MdOutlineLogout } from "react-icons/md";
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

const Description = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state;

  // console.log(date);

  const [isOpen, setIsOpen] = useState(false); // state fpr sidebar for previous session
  const [openPDF, setOpenPDF] = useState(false); // State for opening pdf
  const [currentDate, setCurrentDate] = useState("");
  const [approvedDefects, setApprovedDefects] = useState({}); // State to keep track of approved defects
  const [markDate, setMarkDate] = useState({});

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

  // Handler for checkbox click
  const handleCheckBox = (index, defectType) => {
    console.log(index);
    const currentDate = new Date().toLocaleDateString(); // Get current date
    setApprovedDefects((prevState) => ({
      ...prevState,
      [`${index}-${defectType}`]: !prevState[`${index}-${defectType}`], // Toggle checkbox state
    }));
    setMarkDate((prevState) => ({
      ...prevState,
      [`${index}-${defectType}`]: !prevState[`${index}-${defectType}`]
        ? currentDate
        : "", // Set or clear the Remove Date
    }));
  };

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
            Extracted Data from{" "}
            <span className="font-bold">
              {data.map((item) => item["filename"])}
            </span>{" "}
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
          <div className="flex flex-col w-full p-4 h-[80%] overflow-hidden">
            {/* Description */}
            <div className="w-[99.4%] max-h-[80%] min-h-fit p-3 mt-6 -ml-2 pb-3 bg-white rounded">
              <h2 className="text-xl font-bold">Table of Defected Data</h2>

              <div className="mt-3 overflow-y-auto h-[90%] ">
                <table className="w-full">
                  <thead className="sticky z-10 bg-white -top-1">
                    <tr>
                      <th className="border-[1px] w-[4%] text-start text-sm p-1 border-[#b3b3b3] rounded-tr-md">
                        Sr. No.
                      </th>
                      <th className="border-[1px] w-[4%] text-start text-sm p-1 border-[#b3b3b3]">
                        Prepare Date
                      </th>
                      <th className="border-[1px] w-[8%] text-start text-sm p-1 border-[#b3b3b3]">
                        Remove Date
                      </th>
                      <th className="border-[1px] w-[10%] text-sm p-1 border-[#b3b3b3]">
                        Defect Description
                      </th>
                      <th className="border-[1px] w-[45%] text-sm text-start px-1 border-[#b3b3b3]">
                        Defect Remark
                      </th>
                      <th className="border-[1px] text-sm w-[6%] px-1 border-[#b3b3b3]">
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
                          defectItem[key].length > 0 &&
                          key !== "names_Defect" &&
                          key !== "page_num"
                      );

                      return defects.map((defectType, defectIndex) => {
                        // Skip rows for defectType 'names_Defect' and 'page_num'
                        if (
                          defectType === "names_Defect" ||
                          defectType === "page_num"
                        ) {
                          return null; // Skip this iteration
                        }

                        return (
                          <tr key={`${index}-${defectType}`}>
                            <td className="border-[1px] p-1 text-center border-[#b3b3b3]">
                              {defectType === "names_Defect" &&
                              defectType === "page_num"
                                ? defectIndex - 2
                                : defectIndex + 1}
                              .
                            </td>
                            <td className="border-[1px] p-1 text-center border-[#b3b3b3]">
                              {currentDate}
                            </td>
                            <td className="border-[1px] p-1 text-center border-[#b3b3b3]">
                              {markDate[`${index}-${defectType}`] || ""}
                            </td>
                            <td className="border-[1px] p-1 text-center border-[#b3b3b3]">
                              {defectType === "language_defect"
                                ? "6.1 Non filing of translation of vernacular documents"
                                : defectType === "General_Defect"
                                ? "Other"
                                : defectType === "Scan_Defect"
                                ? "3.2 Not clear/legible/small font/dim/missing."
                                : defectType === "Stamp_Defect"
                                ? "3.2 Not clear/legible/small font/dim/missing."
                                : defectType === "Alias_defect"
                                ? "Other"
                                : defectType === "Underline_Defect"
                                ? "3.3 Contain underlines/highlights/blanks/torn condition"
                                : defectType.replace(" ", "_")}
                            </td>
                            {/* Conditionally underline the defect remark if the checkbox is checked */}
                            <td
                              className={`border-[1px] p-1 border-[#b3b3b3] ${
                                approvedDefects[`${index}-${defectType}`]
                                  ? "line-through" // Add underline if checkbox is checked
                                  : ""
                              }`}
                            >
                              {Array.isArray(defectItem[defectType]) ? (
                                <>
                                  {defectType === "Stamp_Defect"
                                    ? defectItem[defectType]
                                        .slice(0, 1)
                                        .map((item, idx) => (
                                          <>
                                            <span key={idx}>
                                              {` Kindly Upload the corrected scaned copy of / Stamp mark overlapping with text / Illigitimate Stamp ${item.split(
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
                                              {` Kindly Upload the corrected scaned copy of / Stamp mark overlapping with text / Illigitimate Scan ${item.split(
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
                                              {` Kindly, remove underlines from ${item.split(
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
                                    : defectType === "language_defect"
                                    ? defectItem[defectType]
                                        .slice(0, 1)
                                        .map((item, idx) => (
                                          <>
                                            <span key={idx} className="">
                                              {` Make sure translated copy of vurnicular document has been uploaded`}
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
                                              {` Alias found for ${data.map(
                                                (item) => item["type_alias"]
                                              )} has to mentioned on page ${item.split(
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
                                              {` ${item.split(
                                                ".txt"
                                              )} the corrected document.`}
                                            </span>

                                            {item.length <= 1 && (
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
                            </td>
                            <td className="border-[1px] p-1 text-center border-[#b3b3b3]">
                              <input
                                type="checkbox"
                                onChange={() =>
                                  handleCheckBox(index, defectType)
                                }
                                checked={
                                  !!approvedDefects[`${index}-${defectType}`]
                                } // Check if defect is approved
                              />
                            </td>
                          </tr>
                        );
                      });
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

export default Description;
