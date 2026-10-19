import { toMs } from "../../../pkg/utils/time.js";

export default function generateTokens(res, accessToken, refreshToken) {
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    maxAge: toMs(1, "hours"),
  });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    path: "/api/v1/auth/refresh",
    maxAge: toMs(7, "days"),
  });
}
