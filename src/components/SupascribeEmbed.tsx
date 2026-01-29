import React, { useEffect, useRef } from 'react';

const SUPASCRIBE_SRC = 'https://js.supascribe.com/v1/loader/IGPnpSjSnFWhFAFeRDyqelxNjlg2.js';

export const SupascribeEmbed: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const scriptId = 'supascribe-loader-script';
    const exists = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!exists) {
      const s = document.createElement('script');
      s.id = scriptId;
      s.src = SUPASCRIBE_SRC;
      s.async = true;
      document.body.appendChild(s);

      s.addEventListener('load', () => {
        // try to trigger any global init if present
        const win = window as any;
        if (typeof win.supascribeInit === 'function') win.supascribeInit();
        if (win.Supascribe && typeof win.Supascribe.init === 'function') win.Supascribe.init();
      });
    } else {
      // re-run the loader by injecting a short-lived script so the embed initializes
      const s2 = document.createElement('script');
      s2.src = SUPASCRIBE_SRC;
      s2.async = true;
      document.body.appendChild(s2);
      setTimeout(() => s2.remove(), 3000);
    }
  }, []);

  return (
    // match the Substack embed sizing so both columns align
    <div
      ref={ref}
      data-supascribe-embed-id="329666669396"
      data-supascribe-feed
      className="w-full h-full min-h-[220px] max-h-[360px] overflow-auto"
    />
  );
};

export default SupascribeEmbed;
