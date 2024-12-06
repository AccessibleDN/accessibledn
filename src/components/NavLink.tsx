import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface NavLinkProps {
  href: string;
  icon: IconType;
  children: React.ReactNode;
  className?: string;
}

export const NavLink = ({ href, icon: Icon, children, className = '' }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  const linkClasses = `
    flex items-center px-3 py-2 rounded-lg
    transition-colors duration-200
    ${isActive ? 'bg-white/20 text-white' : 'text-gray-300 hover:bg-white/10'}
    ${className}
  `;

  const iconClasses = `mr-3 text-lg ${isActive ? 'text-white' : 'text-gray-300'}`;

  const springTransition = { type: "spring", stiffness: 380, damping: 30 };

  return (
    <Link href={href} className="block">
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.95 }}
        className={linkClasses}
      >
        <Icon className={iconClasses} />
        <span className="font-medium">{children}</span>
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
            transition={springTransition}
          />
        )}
      </motion.div>
    </Link>
  );
};

export default NavLink;