import React from 'react';
import PropTypes from 'prop-types';
import '../public/index.css';
const RootLayout = ({ children }) => {
  return (
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="icon" href="/icon" sizes="any" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}

RootLayout.propTypes = {
  children: PropTypes.any,
}

export const metadata = {
  title: 'eastbluelegends',
  description: 'Very cool FEC',
}

export default RootLayout