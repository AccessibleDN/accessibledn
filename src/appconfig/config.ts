/** 
 * Icons imported from react-icons library for use throughout the application.
 */
import { FaCloud, FaFolder } from "react-icons/fa";
import { FaChartBar } from "react-icons/fa";

/** 
 * Type definition import that enforces the structure of our configuration object
 */
import { AppConfiguration } from "~/utils/types";

/** 
 * Main application configuration object.
 * This object contains all core settings and content used throughout the application,
 * including navigation, footer content, and feature descriptions.
 */
export default {
    /** 
     * Application name used as the primary identifier across the platform
     */
    name: "Accessibledn",
    
    /** 
     * Primary description of the application's purpose and technology stack
     * Used in metadata tags and homepage hero section
     */
    description: "Accessibledn is a cutting-edge Content Delivery Network (CDN) platform, crafted with Next.js and Tailwind CSS, designed to deliver content swiftly and securely.",

    /** 
     * Navigation bar configuration object
     * Controls the display and behavior of the main navigation menu
     */
    navbarConfig: {
        /** 
         * Navigation menu items array
         * Each item contains routing and display information
         */
        navItems: [
            { href: '/filesystem', icon: FaFolder, label: 'Files' },
            { href: '/analytics', icon: FaChartBar, label: 'Analytics' },
        ],
        /** 
         * Determines if navbar should stick to viewport top when scrolling
         */
        sticky: false,
    },

    /** 
     * Footer configuration object
     * Defines the structure and content of the application footer
     */
    footerConfig: {
        /** 
         * Footer content sections
         * Each section contains a title and array of navigation links
         */
        sections: [
            { title: 'Company', links: [{ label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }] },
        ],
        /** 
         * Copyright notice with dynamically updated year
         */
        copyright: `© ${new Date().getFullYear()} Accessibledn. All rights reserved.`,
        /** 
         * Social media and platform links
         */
        links: {
            twitter: 'https://twitter.com/accessibledn',
            github: 'https://github.com/accessibledn',
        }
    },

    /** 
     * Feature cards configuration
     * Defines the features displayed on the homepage
     */
    features: [
        { title: 'Global CDN', description: 'Lightning-fast content delivery through our worldwide network of edge servers.', icon: FaCloud },
    ],

    /**
     * Authentication configuration object
     * Defines the configuration for the authentication system
     */
    authentication: {
        enabled: true, // Whether authentication is enabled
        database: {
            type: "sqlite", // Type of database to use
            path: "Main.sqlite", // Path to the SQLite database file (if no extension is provided, it will default to .sqlite)
        }
    }
} as AppConfiguration;