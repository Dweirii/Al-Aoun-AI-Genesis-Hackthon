import {withSentryConfig} from "@sentry/nextjs";
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  devIndicators: false,
  async redirects () {
    return [
      {  
        source:"/",
        destination:"/conversations",
        permanent: false
      }
    ]
  }
}

export default withSentryConfig(nextConfig, {

  org: "dweiri-llc",

  project: "javascript-nextjs",
  silent: !process.env.CI,

  widenClientFileUpload: true,

  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});