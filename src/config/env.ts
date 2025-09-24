// Environment configuration
export const env = {
  // Contentful CMS
  CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID || '',
  CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN || '',
  CONTENTFUL_PREVIEW_ACCESS_TOKEN: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN || '',
  
  // Site Configuration
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || 'Alibi',
  
  // Analytics
  GA_ID: process.env.NEXT_PUBLIC_GA_ID || '',
  GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || '',
  
  // Contact
  CONTACT_EMAIL: process.env.CONTACT_EMAIL || 'hello@alibi.com',
  
  // SMTP (for contact forms)
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
};

// Validation
export const validateEnv = () => {
  const required = [
    'CONTENTFUL_SPACE_ID',
    'CONTENTFUL_ACCESS_TOKEN',
  ];
  
  const missing = required.filter(key => !env[key as keyof typeof env]);
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
    console.warn('Please set up your Contentful CMS configuration.');
  }
  
  return missing.length === 0;
};
