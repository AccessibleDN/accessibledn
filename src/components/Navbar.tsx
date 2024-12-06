"use client";
import Link from 'next/link';
import { useState, memo, useCallback } from 'react';
import { FaBars } from 'react-icons/fa';
import config from "~/appconfig/config";
import { motion, AnimatePresence } from 'framer-motion';
import NavLink from './NavLink';
import Image from 'next/image';

const Navbar = memo(function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const mobileMenuVariants = {
    hidden: { height: 0, opacity: 0, y: -10 },
    visible: { 
      height: 'auto', 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
    },
    exit: { height: 0, opacity: 0, y: -10 }
  };

  return (
    <motion.nav 
      className={`${config.navbarConfig.sticky ? 'sticky' : 'relative'} top-0 z-50 w-full bg-black/5 backdrop-blur-xl`}
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center group">
            <motion.span 
              className="text-xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent"
              whileHover={{ 
                scale: 1.05,
                backgroundImage: 'linear-gradient(to right, #fff, #fff, #e2e2e2)'
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {config.logo ? (
                <Image src={config.logo} alt={config.name} width={32} height={32} />
              ) : (
                config.name
              )}
            </motion.span>
          </Link>

          <div className="hidden sm:flex sm:items-center sm:space-x-1">
            {config.navbarConfig.navItems.map(({ href, icon, label }) => (
              <NavLink key={href} href={href} icon={icon} className="mx-2">
                {label}
              </NavLink>
            ))}
          </div>

          <motion.button 
            onClick={handleMobileMenuToggle}
            className="sm:hidden relative p-2.5 rounded-xl text-white/90 hover:bg-white/10 active:bg-white/20 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <FaBars className="h-5 w-5" />
          </motion.button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="sm:hidden bg-black/20 backdrop-blur-2xl rounded-b-2xl mx-4 mb-4 border border-white/10 overflow-hidden"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="px-4 py-3 space-y-2">
                {config.navbarConfig.navItems.map(({ href, icon, label }) => (
                  <NavLink key={href} href={href} icon={icon}>
                    {label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
});

export default Navbar;
