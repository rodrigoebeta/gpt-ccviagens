declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    CENTRAL_TERMS_VERSION?: string;
    CENTRAL_TERMS_ACCEPTED_AT?: string;
    CENTRAL_INSTALLATION_OWNER_ID?: string;
  }
}
