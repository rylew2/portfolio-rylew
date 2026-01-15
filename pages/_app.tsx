import { AppProps } from 'next/app';
import { Analytics } from "@vercel/analytics/next"
import { DM_Sans, Manrope } from 'next/font/google';
import '../components/styles/layout.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

/**
 * Root level component for all pages
 * @param {ReactComponentElement} Component Page component to be rendered
 * @param {object} pageProps All props for the page
 */
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={`${dmSans.variable} ${manrope.variable}`}>
      <Component {...pageProps} />
      <Analytics />
    </div>
  );
}

export default MyApp;
