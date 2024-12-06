import { IconType } from "react-icons";

/** 
 * Utility type to check if two types are exactly equal.
 * This type uses conditional types to compare two type parameters V1 and V2.
 * Returns true if V1 extends V2, false otherwise.
 */
export type Equals<V1, V2> = V1 extends V2 ? true : false;

/**
 * Represents a navigation item in the application's navbar.
 * Each navigation item consists of a URL path, an icon component from react-icons,
 * and a display label. These items are used to build the main navigation menu.
 */
export type NavItem = {
    /** The URL path for the navigation link */
    href: string;
    /** Icon component from react-icons to display */
    icon: IconType;
    /** Display text for the navigation item */
    label: string;
}

/**
 * Represents a link in the footer section.
 * Footer links are simpler than navigation items, containing only
 * a label and URL without icons or additional styling information.
 */
export type FooterLink = {
    /** Display text for the footer link */
    label: string;
    /** URL for the footer link */
    href: string;
}

/**
 * Represents a section in the footer containing a group of related links.
 * Footer sections help organize links into logical groupings, each with
 * its own title and collection of related links.
 */
export type FooterSection = {
    /** Title of the footer section */
    title: string;
    /** Array of links contained in this section */
    links: FooterLink[];
}

/**
 * Represents a feature highlight on the application's homepage.
 * Features are used to showcase key functionality or benefits of the application,
 * combining a title, description, and representative icon.
 */
export type Feature = {
    /** Title of the feature */
    title: string;
    /** Detailed description of the feature */
    description: string;
    /** Icon component from react-icons to represent the feature */
    icon: IconType;
}

/**
 * Contains social media links managed in the footer.
 * All properties are optional, allowing flexible configuration of
 * which social media platforms to display links for. Each property
 * represents the full URL to the respective social media profile.
 */
export type ManagedFooterLinks = {
    /** GitHub profile URL */
    github?: string;
    /** Twitter profile URL */
    twitter?: string;
    /** LinkedIn profile URL */
    linkedin?: string;
    /** Facebook profile URL */
    facebook?: string;
    /** Instagram profile URL */
    instagram?: string;
}

/**
 * Represents the type of database used for authentication.
 * Currently supports SQLite for local development and MySQL for production environments.
 * This type is used to determine which database configuration should be used.
 */
export type AuthenticationDatabaseType = "sqlite" | "mysql";

/**
 * Represents the configuration for a SQLite authentication database.
 * SQLite is typically used for development and testing environments
 * due to its self-contained nature and zero-configuration setup.
 */
export type SQLiteAuthenticationDatabaseConfiguration = {
    type: "sqlite";
}

/**
 * Represents the configuration for a MySQL authentication database.
 * MySQL is typically used in production environments where more robust
 * database features and multi-user access are required. Contains all
 * necessary connection parameters.
 */
export type MySQLAuthenticationDatabaseConfiguration = {
    type: "mysql";
}

/**
 * Main application configuration type containing all configurable aspects
 * of the application including navigation, footer, and features.
 * This type serves as the central configuration schema for the entire application,
 * ensuring type safety and providing clear documentation for all available options.
 * It includes sections for basic app information, navigation structure,
 * footer content, feature highlights, and authentication settings.
 */
export type AppConfiguration = {
    /** Application name */
    name: string;
    /** Application description */
    description: string;
    /** Optional logo image path */
    logo?: string;

    /** Navigation bar configuration */
    navbarConfig: {
        /** Array of navigation items to display */
        navItems: NavItem[];
        /** Whether navbar should stick to top of viewport */
        sticky: boolean;
    };

    /** Footer configuration */
    footerConfig: {
        /** Copyright notice text */
        copyright: string;
        /** Social media links */
        links: ManagedFooterLinks;
        /** Footer content sections */
        sections: FooterSection[];
    };

    /** Homepage feature highlights */
    features: Feature[];

    /** Authentication configuration */
    authentication: {
        /** Whether authentication is enabled */
        enabled: boolean;
        /** Authentication Database Configuration */
        database: SQLiteAuthenticationDatabaseConfiguration | MySQLAuthenticationDatabaseConfiguration;
    }
}
