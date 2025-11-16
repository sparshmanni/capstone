// "use client";
// import Link from "next/link";
// import React from "react";

// const RightPanel = ({ open, onClose }) => {
//   return (
//     <div
//       className={`sidebar-modal right ${open ? "open h-[80vh] " : ""}`}
//       onClick={onClose}
//       aria-hidden={!open}
//     >

//       <div className="sidebar-content flex flex-col justify-end items-end" onClick={(e) => e.stopPropagation()}>
//         <button onClick={onClose} className="flex justify-center  items-center w-[6vw] cursor-pointer p-2 gap-[5px] rounded-[10px] bg-red-600 text-white">
//           <span>Close</span>
//           <lord-icon
//     src="https://cdn.lordicon.com/ebyacdql.json"
//     trigger="loop"
//     colors="primary:#ffffff"
//     >
// </lord-icon>
//         </button>
// <div className="flex flex-col justify-between h-[70vh] my-3">
// <div className="mt-4 grid w-[80%] text-white text-center grid-cols-1 gap-5">
//           <Link
//             className="px-4  
//  bg-[#1447E6] flex justify-center items-center gap-[5px] py-1.5 rounded-xl  "
//             href="/"
//           >
//             <span><lord-icon
//     src="https://cdn.lordicon.com/oeotfwsx.json"
//     trigger="loop"
//     delay="1500"
//     state="in-reveal"
//     colors="primary:#ffffff"
//     >
// </lord-icon></span>
// <span>
//             Home
// </span>
//           </Link>
//           <Link
//             className="px-4 py-1.5 rounded-xl flex justify-center items-center gap-[5px] bg-[#1447E6] shadow"
//             href="/about"
//           >
//             <span><lord-icon
//     src="https://cdn.lordicon.com/cfkiwvcc.json"
//     trigger="loop"
//     delay="1500"
//     colors="primary:#ffffff"
//     >
// </lord-icon></span>
//             <span>
//             About
//             </span>
//           </Link>
//           <Link
//             className="px-4 py-1.5 flex justify-center items-center gap-[5px] rounded-xl bg-[#1447E6] shadow"
//             href="/services"
//           >
//             <span><lord-icon
//     src="https://cdn.lordicon.com/mudwpdhy.json"
//     trigger="loop"
//     delay="1500"
//     state="in-build"
//     colors="primary:#ffffff"
//     >
// </lord-icon></span>
//             <span>
//             Services
//             </span>
//           </Link>
//           <Link
//             className="px-4 flex justify-center items-center gap-[5px] py-1.5 rounded-xl bg-[#1447E6] shadow"
//             href="/profile"
//           >
//             <span>
//               <lord-icon
//     src="https://cdn.lordicon.com/bushiqea.json"
//     trigger="loop"
//     delay="1500"
//     state="morph-select"
//     colors="primary:#ffffff"
//     >
// </lord-icon>
//             </span>
//             <span>
//             Profile
//             </span>
//           </Link>
//           <Link
//             className="px-4 flex justify-center items-center gap-[5px] py-1.5 rounded-xl bg-[#1447E6]  shadow"

//             href="/login"
//           >
//             <span>
//               <lord-icon
//     src="https://cdn.lordicon.com/jarmuava.json"
//     trigger="loop"
//     delay="1500"
//     state="in-reveal"
//     colors="primary:#ffffff"
//     >
// </lord-icon>
//             </span>
//             <span>
//             Logout
//             </span>
//           </Link>
//         </div>

//         {/* Optional: helpful tips */}
//         <div className="mt-auto text-xs opacity-70">
//           Tip: Click “Close” to collapse this panel.
//         </div>
// </div>


//       </div>
//     </div>
//   );
// };

// export default RightPanel;












































































"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const RightPanel = ({ open, onClose }) => {
  // --- State to track login status ---
  // Defaults to false. We will check localStorage in useEffect.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // --- Check for token on component mount ---
  useEffect(() => {
    // This code only runs in the browser
    // Replace "token" with your actual localStorage key if it's different
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []); // The empty array [] means this effect runs only once when the component mounts

  // --- Handle Logout Click ---
  const handleLogout = () => {
    // 1. Remove the token from localStorage
    // Replace "token" with your actual key
    localStorage.removeItem("token");

    // 2. Update the state to show "Login"
    setIsLoggedIn(false);

    // 3. Close the sidebar
    onClose();

    // 4. (Optional) Redirect to the login page
    router.push("/login");
  };

  return (
    <div
      className={`sidebar-modal right ${open ? "open h-[80vh] " : ""}`}
      onClick={onClose}
      aria-hidden={!open}
    >
      <div
        className="sidebar-content flex flex-col justify-end items-end"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="flex justify-center items-center  items-center w-[6vw] cursor-pointer p-2 gap-[5px] rounded-[10px] bg-red-600 text-white"
        >
          <span>Close</span>
          <lord-icon
            src="https://cdn.lordicon.com/ebyacdql.json"
            trigger="loop"
            colors="primary:#ffffff"
          ></lord-icon>
        </button>
        <div className="flex flex-col justify-between h-[70vh] my-3">
          <div className="mt-4 grid w-[80%] text-white text-center grid-cols-1 gap-5">
            <Link
              className="px-4 bg-[#1447E6] flex justify-center items-center gap-[5px] py-1.5 rounded-xl "
              href="/"
            >
              <span>
                <lord-icon
                  src="https://cdn.lordicon.com/oeotfwsx.json"
                  trigger="loop"
                  delay="1500"
                  state="in-reveal"
                  colors="primary:#ffffff"
                ></lord-icon>
              </span>
              <span>Home</span>
            </Link>
            <Link
              className="px-4 py-1.5 rounded-xl flex justify-center items-center gap-[5px] bg-[#1447E6] shadow"
              href="/about"
            >
              <span>
                <lord-icon
                  src="https://cdn.lordicon.com/cfkiwvcc.json"
                  trigger="loop"
                  delay="1500"
                  colors="primary:#ffffff"
                ></lord-icon>
              </span>
              <span>About</span>
            </Link>
            <Link
              className="px-4 py-1.5 flex justify-center items-center gap-[5px] rounded-xl bg-[#1447E6] shadow"
              href="/services"
            >
              <span>
                <lord-icon
                  src="https://cdn.lordicon.com/mudwpdhy.json"
                  trigger="loop"
                  delay="1500"
                  state="in-build"
                  colors="primary:#ffffff"
                ></lord-icon>
              </span>
              <span>Services</span>
            </Link>
            <Link
              className="px-4 flex justify-center items-center gap-[5px] py-1.5 rounded-xl bg-[#1447E6] shadow"
              href="/profile"
            >
              <span>
                <lord-icon
                  src="https://cdn.lordicon.com/bushiqea.json"
                  trigger="loop"
                  delay="1500"
                  state="morph-select"
                  colors="primary:#ffffff"
                ></lord-icon>
              </span>
              <span>Profile</span>
            </Link>

            {/* --- CONDITIONAL LOGIN/LOGOUT --- */}

            {isLoggedIn ? (
              // --- IF LOGGED IN: Show Logout Button ---
              <button
                className="px-4 flex justify-center items-center gap-[5px] py-1.5 rounded-xl bg-[#1447E6]  shadow"
                onClick={handleLogout}
              >
                <span>
                  <lord-icon
                    src="https://cdn.lordicon.com/jarmuava.json" // Logout Icon
                    trigger="loop"
                    delay="1500"
                    state="in-reveal"
                    colors="primary:#ffffff"
                  ></lord-icon>
                </span>
                <span>Logout</span>
              </button>
            ) : (
              // --- IF LOGGED OUT: Show Login Link ---
              <Link
                className="px-4 flex justify-center items-center gap-[5px] py-1.5 rounded-xl bg-[#1447E6]  shadow"
                href="/login"
              >
                <span>
                  <lord-icon
                    src="https://cdn.lordicon.com/whtfgdfm.json" // Login Icon (Key)
                    trigger="loop"
                    delay="1500"
                    colors="primary:#ffffff"
                  ></lord-icon>
                </span>
                <span>Login</span>
              </Link>
            )}

          </div>

          {/* Optional: helpful tips */}
          <div className="mt-auto text-xs opacity-70">
            Tip: Click “Close” to collapse this panel.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;