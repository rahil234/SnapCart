interface ImportMetaEnv {
    readonly VITE_GOOGLE_OAUTHCLIENTID: string;
    readonly VITE_BUCKET_URL: string;
    readonly VITE_API_URL: string;
    readonly VITE_IMAGE_URL: string;
    readonly VITE_RAZORPAY_KEY_ID: string;
}

export interface ImportMeta {
    readonly env: ImportMetaEnv;
}