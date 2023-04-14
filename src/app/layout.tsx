"use client";
import { store_0001 } from '@/store/store';
import { Provider } from 'react-redux';
import './globals.css'


export default function RootLayout({children,}: {children: React.ReactNode}) {
    return (
        <html lang="en">
            <body>
                <Provider store={store_0001}>
                    {children}
                </Provider>
            </body>
        </html>
    )
}
