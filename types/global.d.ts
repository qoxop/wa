declare global {
  namespace NodeJS {
    interface ProcessEnv {
      github_client_id: string;
      github_client_secret: string;
      SELF_AES_KEY: string;
      SELF_AES_IV: string;
      FIREBASE_TOKEN: string;
    }
  }
  namespace Github {
    interface AccessTokenData {
      access_token: string;
      scope: string;
      token_type: string;
    }
    interface UserInfo {
      login: string;
      name: string;
      email: string;
      avatar_url: string;
      html_url: string;
    }
  }
}

export {}