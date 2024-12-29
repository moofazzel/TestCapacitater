import Script from "next/script";

const GoogleAnalytics = ({ gaId }) => (
  <>
    {/* Load the Google Analytics library */}
    <Script
      strategy="lazyOnload"
      src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
    />
    {/* Initialize Google Analytics */}
    <Script id="google-analytics" strategy="lazyOnload">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}', {
          page_path: window.location.pathname,
        });
      `}
    </Script>
  </>
);

export default GoogleAnalytics;
