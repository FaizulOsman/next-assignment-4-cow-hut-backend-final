export type ILoginAuthResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};

export type ILoginAuth = {
  phoneNumber: string;
  password: string;
};
