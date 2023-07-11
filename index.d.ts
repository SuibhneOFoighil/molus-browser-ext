declare namespace NodeJS {
  interface ProcessEnv {
    PLASMO_PUBLIC_API_URI?: string
    PLASMO_PUBLIC_STRIPE_LINK?: string

    STRIPE_PRIVATE_KEY?: string

    OAUTH_CLIENT_ID?: string

    PLASMO_PUBLIC_GTAG_ID?: string
  }
}
 
interface Window {
  dataLayer: Array
  gtag: (a: string, b: any, c?: any) => void
}