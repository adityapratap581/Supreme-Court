import React, { useState, useEffect, useRef } from "react";
import { Document, Page } from "react-pdf";

const PDFViewer = ({ pdfUrl }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const pdfContainerRef = useRef(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    console.log(numPages);
  };

  // Scroll Event Listener to detect page changes
  const handleScroll = () => {
    if (pdfContainerRef.current) {
      const container = pdfContainerRef.current;
      const currentScrollTop = container.scrollTop;
      const pageHeight = container.scrollHeight / numPages;

      // Calculate the current page based on scroll position
      const currentPage = Math.ceil((currentScrollTop + 1) / pageHeight);
      setPageNumber(currentPage);
    }
  };

  useEffect(() => {
    const container = pdfContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [numPages]);

  return (
    <section>
      {/* {pdfLoding ? (
        <div>
          <h1 className="animate-pulse">Loading Please wait...</h1>
        </div>
      ) : (
        <div className="flex justify-start gap-x-3">
          <div>
            
            <div className="text-center bg-[#c1c1c1] w-full">
              <p>
                Page {pageNumber} of {numPages}
              </p>
            </div>
            
            <div className="p-3 bg-pink-300 w-fit">
              <div
                ref={pdfContainerRef}
                // style={{ overflowY: 'scroll', height: '10px' }}
                className={`h-[550px] overflow-y-scroll ${
                  pdfLoding ? "opacity-0" : "opacity-100"
                }`}
              >
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  className="h-[100%]"
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  ))}
                </Document>
              </div>
            </div>
          </div>
          
          <div className="">
            <h2>Table Defect</h2>
          </div>
        </div>
      )} */}

      <div className="flex justify-start gap-x-3">
        {/* PDF */}
        <div>
          {/* Page Number */}
          <div className="w-full text-center">
            <p>
              Page {pageNumber} of {numPages}
            </p>
          </div>

          {/* PDF */}
          <div className="p-3 border-[2px] border-gray-600 rounded-md w-fit">
            <div
              ref={pdfContainerRef}
              // style={{ overflowY: 'scroll', height: '10px' }}
              className={`h-[550px] overflow-y-scroll `}
            >
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                className="h-[100%]"
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                ))}
              </Document>
            </div>
          </div>
        </div>

        {/* Error Table*/}
        <div className="">
          <h2>Table Defect</h2>
        </div>
      </div>
    </section>
  );
};

// {/* <div className="flex justify-start gap-x-3">
//   {/* PDF */}
//   <div>
//     {/* Page Number */}
//     <div className="text-center bg-[#c1c1c1] w-full">
//       <p>
//         Page {pageNumber} of {numPages}
//       </p>
//     </div>

//     {/* PDF */}
//     <div className="p-3 bg-pink-300 w-fit">
//       <div
//         ref={pdfContainerRef}
//         // style={{ overflowY: 'scroll', height: '10px' }}
//         className={`h-[550px] overflow-y-scroll ${
//           pdfLoding ? "opacity-0" : "opacity-100"
//         }`}
//       >
//         <Document
//           file={pdfUrl}
//           onLoadSuccess={onDocumentLoadSuccess}
//           className="h-[100%]"
//         >
//           {Array.from(new Array(numPages), (el, index) => (
//             <Page
//               key={`page_${index + 1}`}
//               pageNumber={index + 1}
//               renderTextLayer={false}
//               renderAnnotationLayer={false}
//             />
//           ))}
//         </Document>
//       </div>
//     </div>
//   </div>

//   {/* Error Table*/}
//   <div className="">
//     <h2>Table Defect</h2>
//   </div>
// </div>; */}

export default PDFViewer;
