// The import recipe from the @lue-ui/css README, through Next's default CSS pipeline.
import '@lue-ui/tokens/tokens.css';
import '@lue-ui/css';
import type { ReactNode } from 'react';

export const metadata = { title: 'Lue UI · Next fixture' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
