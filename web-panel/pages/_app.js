import '../styles/globals.css';
import { ToastProvider } from '../components/ToastProvider';

export default function App({ Component, pageProps }) {
  return (
    <ToastProvider>
      <Component {...pageProps} />
    </ToastProvider>
  );
}