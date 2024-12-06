"use client";
import Link from 'next/link';
import { memo } from 'react';
import { motion } from 'framer-motion';
import config from '~/appconfig/config';
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

// Reusable animation variants
const fadeInUpVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const fadeInVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
};

const FooterSection = memo(function FooterSection({ section }: { section: typeof config.footerConfig.sections[0] }) {
  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-sm font-semibold text-white">{section.title}</h3>
      <ul className="mt-4 space-y-3">
        {section.links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
});

const SocialLink = memo(function SocialLink({ href, label, icon: Icon }: { href?: string; label: string; icon: React.ReactNode }) {
  if (!href) return null;
  
  return (
    <motion.a
      href={href}
      className="text-gray-400 hover:text-white transition-colors duration-200"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
      {Icon}
    </motion.a>
  );
});

const socialIcons = {
  twitter: FaTwitter,
  github: FaGithub,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  instagram: FaInstagram
} as const;

const Footer = memo(function Footer() {
  const currentYear = new Date().getFullYear();
  const copyright = config.footerConfig.copyright || `© ${currentYear} ${config.name}. All rights reserved.`;

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-black/5 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {config.footerConfig.sections.map((section) => (
            <FooterSection key={section.title} section={section} />
          ))}
        </div>

        <motion.div 
          variants={fadeInVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center"
        >
          <motion.p 
            className="text-sm text-gray-400"
            whileHover={{ color: '#ffffff' }}
          >
            {copyright}
          </motion.p>
          
          <div className="mt-4 sm:mt-0 flex space-x-6">
            {(Object.entries(config.footerConfig.links) as [keyof typeof socialIcons, string][]).map(([key, href]) => {
              const Icon = socialIcons[key];
              return (
                <SocialLink
                  key={key}
                  href={href}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  icon={<Icon />}
                />
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/5 rounded-full filter blur-3xl" />
      </div>
    </footer>
  );
});

export default Footer;
