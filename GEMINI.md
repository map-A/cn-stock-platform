# Project Architecture and Theme Enhancements

## Project Overview

This project is a React-based application built with Umi.js, leveraging Ant Design for its user interface components. It follows a modular architecture with distinct layers for API interaction, business logic services, and global state management using Zustand. The application is designed for managing stock-related information, including real-time quotes, news analysis, portfolio management, and various other financial tools.

### Key Technologies:

*   **Frontend Framework**: React.js
*   **Build System/Framework**: Umi.js
*   **UI Library**: Ant Design Pro Components, Ant Design
*   **State Management**: Zustand
*   **Language**: TypeScript
*   **HTTP Client**: Axios (implied by API layer)

### Module Breakdown:

*   **`src/api/`**: Handles all interactions with the backend API, including client configuration and interceptors.
*   **`src/components/`**: Houses reusable React components, categorized into `ui`, `common`, and `business` for better organization.
*   **`src/config/`**: Contains application-wide configurations, including routing and theme settings.
*   **`src/constants/`**: Stores global constants, enums, and API-related constants.
*   **`src/hooks/`**: Provides custom React Hooks for encapsulating reusable logic (e.g., API calls, authentication, theming).
*   **`src/pages/`**: Contains the main page components, orchestrating various business and common components.
*   **`src/services/`**: Implements complex business logic and data processing, independent of UI.
*   **`src/stores/`**: Manages global application state using Zustand, with modules for different state domains.
*   **`src/styles/`**: Defines global styles and theme variables.
*   **`src/typings/`**: Centralized location for all TypeScript type definitions.
*   **`src/utils/`**: Utility functions for formatting, requests, and notifications.

## Theme and Visual Style Revamp

To achieve a unified and modern visual aesthetic, significant changes have been implemented across the theming system:

### 1. Unified Theme Configuration (`src/config/themeConfig.ts`)

*   **Primary Color**: The `colorPrimary` has been updated to a vibrant blue (`#3B82F6`) to serve as the new accent color across the application.
*   **Light Mode Tokens**: Adjusted `colorBgContainer`, `colorText`, and `colorBgLayout` for a cleaner, brighter light theme with improved readability and a spacious feel.
*   **Dark Mode Tokens**: Refined `colorBgContainer`, `colorText`, and `colorBgLayout` for a softer, more eye-friendly dark theme.
*   **Centralized Token Generation**: The `generateThemeToken` function now dynamically generates the complete set of theme tokens based on the current mode and primary color, ensuring consistency.

### 2. Streamlined Theme Token Integration (`src/config/themeToken.ts`)

*   **Eliminated Redundancy**: The previously hardcoded `darkThemeToken` and `lightThemeToken` objects have been removed.
*   **Adapter Functionality**: `getThemeToken` now acts as an adapter, utilizing the `generateThemeToken` from `themeConfig.ts` to provide theme tokens to Ant Design's ProLayout, based on the `navTheme` and `ThemeConfig`.
*   **Dynamic Layout Settings**: `getLayoutSettings` now accepts the current `ThemeConfig`, allowing for a more flexible and dynamic application of theme settings to the ProLayout.

### 3. Application-Wide Theme Application (`src/app.tsx`)

*   **Initial State Theme Loading**: The `getInitialState` function now loads the saved theme configuration using `loadThemeConfig()` and passes it to `getLayoutSettings` to initialize the layout settings and Ant Design's theme tokens.
*   **Dynamic Theme Updates**: The `SettingDrawer`'s `onSettingChange` callback has been updated to reload the theme configuration and merge it with the new settings, ensuring that user-driven theme changes are correctly applied and reflected in the UI.
*   **Ant Design Runtime Theme**: The `antd` runtime configuration now uses the `loadThemeConfig()` to set up Ant Design's theme tokens at application startup, ensuring that Ant Design components are styled according to the unified theme from the outset.

### 4. Refactored Global Styles (`src/styles/global.css` & `src/styles/theme-variables.css`)

*   **CSS Variable Consolidation**: Redundant CSS variable definitions and component-specific style overrides related to Ant Design's theme have been removed from `global.css` and `theme-variables.css`.
*   **Focus on Essentials**: These files now primarily retain essential global styles such as body font size inheritance, compact mode, no-animations, and universal smooth transitions, deferring theme-specific styling to Ant Design's built-in theming system and the `themeConfig.ts`.

## Building and Running the Project

To build and run the project, the following commands from `package.json` are relevant:

*   **Install Dependencies**: `pnpm install` (or `npm install` if pnpm is not used)
*   **Start Development Server**: `npm run start` or `npm run start:dev`
*   **Build for Production**: `npm run build`
*   **Linting**: `npm run lint` (uses `@biomejs/biome` and `tsc`)
*   **Testing**: `npm run test` (uses `jest`)

## Development Conventions

Existing development conventions regarding component naming, import paths, component structure, service layer, and state management are detailed in the project's `README.md` file. These conventions should continue to be followed for consistent code quality and maintainability.