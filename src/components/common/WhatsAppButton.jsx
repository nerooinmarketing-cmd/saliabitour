import { siteContent } from '../../data/content';

export default function WhatsAppButton({ number, message }) {
  const defaultPhone = siteContent.whatsapp.replace(/[^0-9]/g, '');
  const phoneToUse = number ? number.replace(/[^0-9]/g, '') : defaultPhone;
  const messageParam = message ? `?text=${encodeURIComponent(message)}` : '';
  
  return (
    <a
      href={`https://wa.me/${phoneToUse}${messageParam}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="WhatsApp ile iletişim"
    >
      <svg viewBox="0 0 32 32" width="32" height="32" fill="white">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.502 1.14 6.742 3.072 9.372L1.062 31.11l5.898-1.964A15.904 15.904 0 0016.004 32C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0zm9.31 22.606c-.39 1.1-2.278 2.104-3.142 2.168-.864.064-1.67.39-5.63-1.172-4.766-1.878-7.788-6.77-8.024-7.086-.234-.316-1.916-2.55-1.916-4.862s1.214-3.45 1.644-3.924c.432-.474.94-.592 1.254-.592.314 0 .628.002.904.016.29.014.68-.11 1.064.812.39.94 1.326 3.234 1.442 3.468.116.234.194.508.04.82-.156.312-.234.506-.468.782-.234.274-.492.614-.702.824-.234.234-.478.488-.206.958.274.47 1.214 2.002 2.608 3.244 1.79 1.596 3.302 2.09 3.772 2.324.47.234.744.196 1.018-.118.274-.314 1.176-1.372 1.49-1.844.314-.474.628-.39 1.058-.234.432.156 2.724 1.286 3.194 1.52.47.234.782.352.898.546.116.196.116 1.126-.274 2.226z"/>
      </svg>
    </a>
  );
}
