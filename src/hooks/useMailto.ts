import { useState } from 'react';

export const useMailto = (email: string) => {
  const [copied, setCopied] = useState(false);

  const handleMailtoClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Try to copy to clipboard first (works everywhere, no mail client needed)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard failed, continue to mailto
      }
    }
    
    // Also try mailto link - if mail client exists, it will open
    // If no mail client, nothing happens (which is fine, we already copied)
    // Use a temporary link to trigger mailto without navigation
    const mailtoLink = document.createElement('a');
    mailtoLink.href = `mailto:${email}`;
    mailtoLink.style.display = 'none';
    document.body.appendChild(mailtoLink);
    mailtoLink.click();
    document.body.removeChild(mailtoLink);
  };

  return { handleMailtoClick, copied };
};

