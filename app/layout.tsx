import React from "react";
import '@styles/globals.scss'
import 'bootstrap/dist/css/bootstrap.min.css';


const RootLayout = ({ children }: React.PropsWithChildren) => {
    return (
        <html>
            <body>
                {children}
            </body>
        </html>
    )
}

export default RootLayout;