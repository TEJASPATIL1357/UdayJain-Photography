import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingWhatsApp() {
  const whatsappNumber = "+917774803320"; // Default placeholder
  const message = encodeURIComponent("Hello UdayJain Photography, I would like to inquire about your services.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg shadow-black/40 hover:bg-green-400 transition-colors"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Chat on WhatsApp"
    >
      <svg 
        viewBox="0 0 32 32" 
        className="w-8 h-8 fill-white" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.002 2.052c-7.702 0-13.952 6.25-13.952 13.951 0 2.457.64 4.846 1.848 6.945L2.1 29.544l6.732-1.765c2.012 1.096 4.3 1.674 6.67 1.674h.004c7.7 0 13.95-6.25 13.95-13.95 0-3.733-1.453-7.24-3.626-9.88A13.842 13.842 0 0016.002 2.05zm0 23.513h-.002c-2.079 0-4.116-.56-5.897-1.616l-.423-.25-4.38 1.148 1.17-4.27-.275-.436a11.594 11.594 0 01-1.782-6.19c0-6.4 5.212-11.613 11.615-11.613 3.103 0 6.018 1.21 8.21 3.402A11.56 11.56 0 0127.618 16c0 6.4-5.213 11.613-11.616 11.613zm6.368-8.71c-.348-.175-2.062-1.02-2.38-1.137-.318-.117-.55-.175-.783.174-.23.35-.9 1.138-1.103 1.37-.204.232-.408.262-.756.087-.35-.174-1.472-.542-2.805-1.73-1.036-.924-1.735-2.065-1.94-2.414-.203-.35-.022-.538.152-.712.157-.156.348-.407.522-.612.174-.204.232-.348.348-.58.116-.232.058-.436-.03-.61-.086-.175-.782-1.888-1.072-2.585-.282-.68-.568-.587-.782-.598-.204-.01-.436-.01-.668-.01-.232 0-.61.086-.928.435-.318.348-1.218 1.19-1.218 2.903 0 1.714 1.247 3.37 1.42 3.603.174.232 2.457 3.75 5.952 5.258.832.36 1.48.574 1.986.735.834.266 1.594.228 2.193.138.67-.102 2.062-.843 2.352-1.656.29-.812.29-1.508.204-1.655-.087-.146-.318-.232-.667-.406z"/>
      </svg>
    </motion.a>
  );
}
