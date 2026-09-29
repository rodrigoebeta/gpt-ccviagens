declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    CENTRAL_TERMS_VERSION?: string;
    CENTRAL_TERMS_ACCEPTED_AT?: string;
    CENTRAL_INSTALLATION_OWNER_ID?: string;
    CENTRAL_SYNC_TOKEN_SHA256?: string;
    CENTRAL_SYNC_USER_ID?: string;
    CENTRAL_SYNC_USER_EMAIL?: string;
    CENTRAL_SYNC_TIMEZONE?: string;
  }
}
