/**
 * Mobile utility functions and constants for responsive design
 */

// Common responsive classes that can be reused
export const mobileResponsiveClasses = {
  // Text sizing
  title: "text-xl sm:text-2xl lg:text-3xl",
  subtitle: "text-lg sm:text-xl lg:text-2xl",
  body: "text-sm sm:text-base",
  small: "text-xs sm:text-sm",

  // Button sizing
  buttonFullWidth: "w-full sm:w-auto",
  buttonFlexGrow: "flex-1 sm:flex-none",

  // Layout patterns
  stackOnMobile: "flex flex-col sm:flex-row",
  centerOnMobile: "items-center sm:items-start",
  spaceYtoX: "space-y-3 sm:space-y-0 sm:space-x-3",
  spaceYtoX2: "space-y-2 sm:space-y-0 sm:space-x-2",

  // Grid patterns
  grid2to4: "grid grid-cols-2 lg:grid-cols-4",
  grid1to2: "grid grid-cols-1 sm:grid-cols-2",
  grid1to3: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",

  // Gaps
  gapResponsive: "gap-3 sm:gap-4 lg:gap-6",
  gapSmall: "gap-2 sm:gap-3",

  // Padding and margins
  paddingResponsive: "p-3 sm:p-4 lg:p-6",
  marginResponsive: "m-3 sm:m-4 lg:m-6",

  // Common combinations
  cardPadding: "p-3 sm:p-4",
  headerSpacing: "mb-4 sm:mb-6",
  sectionSpacing: "space-y-4 sm:space-y-6",
};

// Responsive text patterns for common elements
export const responsiveText = {
  // Navigation and tabs
  navItem: {
    full: "hidden sm:inline",
    short: "sm:hidden"
  },

  // Button labels
  button: {
    full: "hidden sm:inline",
    short: "sm:hidden"
  },

  // Status indicators
  status: {
    full: "hidden sm:inline",
    abbreviated: "sm:hidden"
  }
};

// Breakpoint values (matching Tailwind defaults)
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Helper functions
export const getResponsiveText = (fullText: string, shortText: string) => ({
  full: fullText,
  short: shortText,
  className: {
    full: responsiveText.button.full,
    short: responsiveText.button.short
  }
});

export const combineResponsiveClasses = (...classes: string[]) => {
  return classes.join(' ');
};

// Common mobile-first patterns
export const mobileFirstPatterns = {
  // Header with actions
  pageHeader: "flex flex-col space-y-4 sm:space-y-0",
  pageHeaderTitle: "flex-1 min-w-0",
  pageHeaderActions: "flex-shrink-0",

  // Card layouts
  cardGrid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
  cardHeader: "flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0",

  // Form layouts
  formGrid: "grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6",
  formButtons: "flex flex-col sm:flex-row gap-2 sm:gap-3",

  // Table alternatives for mobile
  mobileTable: "block sm:table",
  mobileTableRow: "block sm:table-row border-b sm:border-b-0",
  mobileTableCell: "block sm:table-cell py-2 sm:py-0",
};