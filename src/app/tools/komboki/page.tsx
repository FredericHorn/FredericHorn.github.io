'use client';

import { useEffect } from 'react';

export default function KombokiPage() {
  useEffect(() => {
    window.location.replace('/tools/komboki/index.html');
  }, []);

  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/tools/komboki/index.html" />
      <p className="sr-only">
        Redirecting to <a href="/tools/komboki/index.html">KombOpt Kompass</a>…
      </p>
    </>
  );
}
