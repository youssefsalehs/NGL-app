import { toMs } from "../../../pkg/utils/time.js";

const isProd = process.env.NODE_ENV === "production";

const baseCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "none",
};

export default function generateTokens(res, accessToken, refreshToken) {
  res.cookie("access_token", accessToken, {
    ...baseCookieOptions,
    path: "/",
    maxAge: toMs(1, "hours"),
  });

  res.cookie("refresh_token", refreshToken, {
    ...baseCookieOptions,
    path: "/api/v1/auth",
    maxAge: toMs(7, "days"),
  });
}
