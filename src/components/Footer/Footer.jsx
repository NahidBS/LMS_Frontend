// import React from "react";
// import {
//   FaFacebookF,
//   FaLinkedinIn,
//   FaTwitter,
//   FaYoutube,
// } from "react-icons/fa";

// const Footer = () => {
//   return (
//     <footer className="bg-gradient-to-r from-white to-[#fff6f6] text-gray-700 px-6 py-10 md:px-16 lg:px-28">
//       <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
//         {/* Company Info */}
//         <div>
//           <img
//             src="/BSlogo-removebg-preview.png"
//             alt="Brain Station 23"
//             className="h-16 mb-4"
//           />
//           <p className="mb-4 text-sm">
//             AI-ready software service company specializing in resource
//             augmentation. We deliver 10X faster solutions for startups, SMEs,
//             and Enterprises across Fintech, Pharma, Retail & Distribution.
//           </p>

//           {/* Social Icons with Circle Border */}
//           <div className="flex space-x-4 mt-4">
//             <a
//               href="https://facebook.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               aria-label="Facebook"
//               className="text-blue-600 hover:text-blue-800 transition-transform transform hover:scale-110 border border-blue rounded-full p-3"
//             >
//               <FaFacebookF size={16} />
//             </a>
//             <a
//               href="https://linkedin.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               aria-label="LinkedIn"
//               className="text-blue-700 hover:text-blue-900 transition-transform transform hover:scale-110 border border-blue rounded-full p-3"
//             >
//               <FaLinkedinIn size={16} />
//             </a>
//             <a
//               href="https://twitter.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               aria-label="Twitter"
//               className="text-sky-500 hover:text-sky-700 transition-transform transform hover:scale-110 border border-sky rounded-full p-3"
//             >
//               <FaTwitter size={16} />
//             </a>
//             <a
//               href="https://youtube.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               aria-label="YouTube"
//               className="text-red-600 hover:text-red-800 transition-transform transform hover:scale-110 border border-sky rounded-full p-3"
//             >
//               <FaYoutube size={16} />
//             </a>
//           </div>
//         </div>

//         {/* Company Links with Hover Underline */}
//         <div>
//           <h3 className="font-semibold text-lg text-blue-500 mb-4">COMPANY</h3>
//           <ul className="space-y-2 text-sm">
//             {[
//               { label: "HOME", href: "#" },
//               { label: "ABOUT US", href: "#" },
//               { label: "BOOKS", href: "#" },
//               { label: "EBOOKS", href: "#" },
//               { label: "NEW RELEASE", href: "#" },
//               { label: "CONTACT US", href: "#" },
//               { label: "BLOG", href: "#" },
//             ].map((item, index) => (
//               <li key={index}>
//                 <a
//                   href={item.href}
//                   className="relative inline-block text-gray-700 hover:text-sky-500 transition duration-300 after:content-[''] after:absolute after:w-0 after:h-0.5 after:left-0 after:-bottom-1 after:bg-sky-500 hover:after:w-full after:transition-all after:duration-300"
//                 >
//                   {item.label}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Latest News */}
//         <div>
//           <h3 className="font-semibold text-lg text-blue-500 mb-4">LATEST NEWS</h3>
//           <div className="space-y-4 text-sm">
//             <div className="flex space-x-4">
//               <img
//                 src="/emplye.jpeg"
//                 alt="News"
//                 className="h-14 w-14 object-cover rounded-md"
//               />
//               <div>
//                 <p className="text-blue-500 font-semibold">Nostrud exercitation</p>
//                 <p className="text-gray-500">
//                   Ullamco laboris nisi ut aliquip ex ea commodo consequat.
//                 </p>
//                 <p className="text-yellow-500 text-xs mt-1">15 April 2022</p>
//               </div>
//             </div>
//             <div className="flex space-x-4">
//               <img
//                 src="/employee.jpeg"
//                 alt="News"
//                 className="h-14 w-14 object-cover rounded-md"
//               />
//               <div>
//                 <p className="text-blue-500 font-semibold">Nostrud exercitation</p>
//                 <p className="text-gray-500">
//                   Ullamco laboris nisi ut aliquip ex ea commodo consequat.
//                 </p>
//                 <p className="text-yellow-500 text-xs mt-1">15 April 2022</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Line */}
//       <div className="mt-10 border-t border-gray-200 pt-4 flex flex-col md:flex-row justify-between text-sm text-gray-500">
//         <p>©2025 Brain Station 23. All rights reserved.</p>
//         <p>
//           <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a> |{" "}
//           <a href="#" className="hover:text-blue-500 hover:underline">Terms of Service</a>
//         </p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;



// Footer.jsx
import React from "react";
import { ChevronUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative w-full bg-[#1e2a31] text-gray-400">
      {/* Center on mobile/tablet, left on desktop */}
      <div className="mx-auto w-full max-w-screen-xl px-6 sm:px-10 lg:px-12 pt-14 pb-8 text-center md:text-center lg:text-left">
        {/* Row 1: Copyright */}
        <p className="m-0 text-[15px] leading-relaxed">
          Copyright (c) Brainstation 23 LMS - 2025. All rights reserved.
        </p>

        {/* Divider */}
        <hr className="my-6 border-[#2c3941]" />

        {/* Row 2: Links — centered on mobile/tablet, left on desktop */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 text-[15px]">
          <a
            href="#"
            className="hover:text-white transition-colors"
            aria-label="Data retention summary"
          >
            Data retention summary
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors"
            aria-label="Get the mobile app"
          >
            Get the mobile app
          </a>
        </div>
      </div>

      {/* Back-to-top button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className="group absolute right-4 top-6 sm:right-6 sm:top-8 grid h-9 w-9 place-items-center rounded-md bg-[#148dc0] text-white shadow-md transition hover:bg-[#0f7aa6] focus:outline-none focus:ring-2 focus:ring-sky-300"
      >
        <ChevronUp className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
      </button>
    </footer>
  );
};

export default Footer;
