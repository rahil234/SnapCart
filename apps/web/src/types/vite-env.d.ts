/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_RAZORPAY_KEY_ID: string;
  readonly VITE_GOOGLE_OAUTH_CLIENT_ID: string;
  readonly VITE_BUCKET_URL: string;
  readonly VITE_IMAGE_URL: string;
  readonly VITE_REFERRAL_LINK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
