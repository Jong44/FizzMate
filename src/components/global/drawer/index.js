import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const dialogVariants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: "100%" },
};

const menu = [
  {
    name: "Beranda",
    link: "/",
  },
  {
    name: "Pengaturan",
    link: "/pengaturan",
  },
  {
    name: "Umpan Balik",
    link: "/feedback",
  },
];

const Drawer = ({ isOpen, onClose }) => {
  const [isMounted, setIsMounted] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    }
  }, [isOpen]);

  const handleAnimationComplete = (definition) => {
    if (definition === "closed") {
      setIsMounted(false); // Menghapus dari DOM setelah animasi penutupan selesai
    }
  };

  if (!isMounted) return null; // Jangan render jika tidak diperlukan

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
      onClick={onClose}
    >
      <motion.div
        className="drawer"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={dialogVariants}
        transition={{ duration: 0.3 }}
        onAnimationComplete={handleAnimationComplete}
        style={{
          backgroundColor: "white",
          padding: "20px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          maxWidth: "350px",
          width: "70%",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()} // Untuk mencegah close ketika klik di dalam drawer
      >
        <div className="flex justify-between items-center gap-3">
            <Image src="/assets/icons/logo_web.webp" alt="logo" width={40} height={40} />
            <p className="text-xl font-bold text-center max-md:text-lg">FizzMate</p>
        </div>
        {/* Menu */}
        <div className="h-[1px] bg-gray-200 my-5"></div>
        <div className="flex flex-col gap-3">
          {menu.map((item, index) => (
            <Link
              key={index}
              onClick={onClose}
              href={item.link}
              className="text-lg text-center hover:bg-gray-100 p-2 rounded-lg cursor-pointer max-md:text-base"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Drawer;
