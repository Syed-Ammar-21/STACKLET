import React, { useState } from 'react';

const GITHUB_URL = 'https://github.com/Syed-Ammar-21';
const LINKEDIN_URL = 'https://www.linkedin.com/in/syed-ammar-5167a42b1/';

export default function Footer() {
  const [showIcons, setShowIcons] = useState(false);

  return (
    <footer className="w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-md">
      <div className="w-full flex flex-col md:flex-row items-center md:items-center justify-between py-6 px-4">
        <div className="text-white flex flex-col items-center md:items-start md:text-left text-center">
          <div className="flex flex-row items-center">
            <div className="relative flex flex-row items-center">
              <span 
                className="text-3xl font-black tracking-wider select-none text-white font-['Orbitron',monospace] uppercase cursor-pointer"
                onClick={() => setShowIcons(!showIcons)}
              >
                Contact Me
              </span>
              <div className={`flex gap-4 items-center ml-2 absolute left-full top-1/2 -translate-y-1/2 transition-all duration-300 ${
                showIcons 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-2'
              }`}>

              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=ammarzulfiqar976@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email" className="flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-gray-200 shadow transition">
                <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24" className="text-slate-900">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4v-9.99l8 6.99 8-6.99V18z" />
                </svg>
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-gray-200 shadow transition">
                <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24" className="text-slate-900">
                  <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
                </svg>
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-gray-200 shadow transition">
                <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24" className="text-slate-900">
                  <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.966 0-1.75-.79-1.75-1.76 0-.97.784-1.76 1.75-1.76s1.75.79 1.75 1.76c0 .97-.784 1.76-1.75 1.76zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v4.74z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        </div>
        <div className="text-white mt-6 md:mt-0 text-center md:text-right font-['Orbitron',monospace]">
          2025, Syed Ammar, All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
