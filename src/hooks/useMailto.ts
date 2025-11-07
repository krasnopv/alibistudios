import { useState } from 'react';

export const useMailto = (email: string) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string): Promise<boolean> => {
    // Method 1: Modern Clipboard API (requires HTTPS/secure context)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn('Clipboard API failed:', err);
        // Fall through to fallback method
      }
    }

    // Method 2: Fallback using execCommand (works in more contexts)
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        return true;
      }
    } catch (err) {
      console.warn('execCommand copy failed:', err);
    }

    return false;
  };

  const handleMailtoClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Try to copy to clipboard first
    const copySuccess = await copyToClipboard(email);
    
    if (copySuccess) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    
    // Also try mailto link - if mail client exists, it will open
    // If no mail client, nothing happens (which is fine, we already copied)
    // Use a temporary link to trigger mailto without navigation
    try {
      const mailtoLink = document.createElement('a');
      mailtoLink.href = `mailto:${email}`;
      mailtoLink.style.display = 'none';
      document.body.appendChild(mailtoLink);
      mailtoLink.click();
      // Small delay before removal to ensure click is processed
      setTimeout(() => {
        if (document.body.contains(mailtoLink)) {
          document.body.removeChild(mailtoLink);
        }
      }, 100);
    } catch (err) {
      console.warn('Mailto link failed:', err);
    }
  };

  return { handleMailtoClick, copied };
};

