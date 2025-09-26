// Google Fonts integration utility

export const loadGoogleFont = (fontFamily: string): void => {
  // Check if font is already loaded
  const existingLink = document.querySelector(`link[href*="${encodeURIComponent(fontFamily)}"]`);
  if (existingLink) return;

  // Create and append Google Fonts link
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@300;400;500;600;700&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

export const applyBrandStyles = (brandAssets: {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    fontSize: 'small' | 'medium' | 'large';
  };
}): void => {
  // Load Google Fonts
  if (brandAssets.typography.headingFont && brandAssets.typography.headingFont !== 'Inter') {
    loadGoogleFont(brandAssets.typography.headingFont);
  }
  if (brandAssets.typography.bodyFont && brandAssets.typography.bodyFont !== 'Inter') {
    loadGoogleFont(brandAssets.typography.bodyFont);
  }

  // Apply CSS custom properties
  const root = document.documentElement;
  root.style.setProperty('--brand-color-primary', brandAssets.colors.primary);
  root.style.setProperty('--brand-color-secondary', brandAssets.colors.secondary);
  root.style.setProperty('--brand-color-accent', brandAssets.colors.accent);
  root.style.setProperty('--brand-color-text', brandAssets.colors.text);
  root.style.setProperty('--brand-color-background', brandAssets.colors.background);
  root.style.setProperty('--brand-font-heading', brandAssets.typography.headingFont);
  root.style.setProperty('--brand-font-body', brandAssets.typography.bodyFont);

  // Apply font size variables
  const fontSizeMap = {
    small: '0.875rem',
    medium: '1rem',
    large: '1.125rem'
  };
  root.style.setProperty('--brand-font-size-base', fontSizeMap[brandAssets.typography.fontSize]);
};

export const generateMenuStyles = (brandAssets: {
  logo?: string;
  backgroundImage?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    fontSize: 'small' | 'medium' | 'large';
  };
}): string => {
  const fontSizeMultipliers = {
    small: 0.875,
    medium: 1,
    large: 1.125
  };

  const multiplier = fontSizeMultipliers[brandAssets.typography.fontSize];

  return `
    :root {
      --brand-color-primary: ${brandAssets.colors.primary};
      --brand-color-secondary: ${brandAssets.colors.secondary};
      --brand-color-accent: ${brandAssets.colors.accent};
      --brand-color-text: ${brandAssets.colors.text};
      --brand-color-background: ${brandAssets.colors.background};
      --brand-font-heading: "${brandAssets.typography.headingFont}", sans-serif;
      --brand-font-body: "${brandAssets.typography.bodyFont}", sans-serif;
      --brand-font-size-xs: ${0.75 * multiplier}rem;
      --brand-font-size-sm: ${0.875 * multiplier}rem;
      --brand-font-size-base: ${1 * multiplier}rem;
      --brand-font-size-lg: ${1.125 * multiplier}rem;
      --brand-font-size-xl: ${1.25 * multiplier}rem;
      --brand-font-size-2xl: ${1.5 * multiplier}rem;
      --brand-font-size-3xl: ${1.875 * multiplier}rem;
      --brand-font-size-4xl: ${2.25 * multiplier}rem;
    }

    .brand-menu {
      background-color: var(--brand-color-background);
      color: var(--brand-color-text);
      font-family: var(--brand-font-body);
      font-size: var(--brand-font-size-base);
      line-height: 1.6;
    }

    .brand-menu h1,
    .brand-menu h2,
    .brand-menu h3,
    .brand-menu h4,
    .brand-menu h5,
    .brand-menu h6 {
      font-family: var(--brand-font-heading);
      color: var(--brand-color-primary);
      font-weight: 600;
    }

    .brand-menu h1 { font-size: var(--brand-font-size-4xl); }
    .brand-menu h2 { font-size: var(--brand-font-size-3xl); }
    .brand-menu h3 { font-size: var(--brand-font-size-2xl); }
    .brand-menu h4 { font-size: var(--brand-font-size-xl); }

    .brand-menu .menu-header {
      background: ${brandAssets.backgroundImage ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${brandAssets.backgroundImage})` : `linear-gradient(135deg, ${brandAssets.colors.primary}, ${brandAssets.colors.secondary})`};
      background-size: cover;
      background-position: center;
      color: white;
    }

    .brand-menu .menu-logo {
      ${brandAssets.logo ? `background-image: url(${brandAssets.logo});` : ''}
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    .brand-menu .menu-category {
      border-color: var(--brand-color-primary);
    }

    .brand-menu .menu-item-name {
      color: var(--brand-color-primary);
      font-family: var(--brand-font-heading);
      font-weight: 600;
    }

    .brand-menu .menu-item-price {
      color: var(--brand-color-accent);
      font-weight: 600;
    }

    .brand-menu .menu-item-description {
      color: var(--brand-color-text);
      font-size: var(--brand-font-size-sm);
    }

    .brand-menu .btn-primary {
      background-color: var(--brand-color-primary);
      border-color: var(--brand-color-primary);
      color: white;
    }

    .brand-menu .btn-primary:hover {
      background-color: var(--brand-color-secondary);
      border-color: var(--brand-color-secondary);
    }

    .brand-menu .btn-accent {
      background-color: var(--brand-color-accent);
      border-color: var(--brand-color-accent);
      color: white;
    }

    .brand-menu .badge-primary {
      background-color: var(--brand-color-primary);
      color: white;
    }

    .brand-menu .badge-accent {
      background-color: var(--brand-color-accent);
      color: white;
    }

    .brand-menu .text-primary {
      color: var(--brand-color-primary);
    }

    .brand-menu .text-accent {
      color: var(--brand-color-accent);
    }

    .brand-menu .border-primary {
      border-color: var(--brand-color-primary);
    }
  `;
};