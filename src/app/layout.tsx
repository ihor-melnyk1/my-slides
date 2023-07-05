'use client';
import { store } from '@/store/store';
import { Provider } from 'react-redux';
import './globals.css';
import App from './app';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout ({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Provider store={store}>
          <App>
            {children}
          </App>
        </Provider>
      </body>
    </html>
  );
}
