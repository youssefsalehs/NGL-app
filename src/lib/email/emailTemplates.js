export function getOtpEmailTemplate(code, type = "register") {
  const titles = {
    register: "Welcome to NGL! Verify Your Email",
    resend: "Your New NGL Verification Code",
  };

  const descriptions = {
    register:
      "Thanks for joining NGL! Please use the verification code below to complete your registration.",
    resend:
      "You requested a new verification code. Use the code below to verify your account.",
  };

  return `
    <!DOCTYPE html>
    html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>NGL Verification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f7; padding: 40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 30px; text-align: center; color: #ffffff;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px;">NGL</h1>
                </td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td style="padding: 40px 30px; color: #333333;">
                  <h2 style="margin-top: 0; font-size: 20px; color: #1f2937;">${titles[type]}</h2>
                  <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
                    ${descriptions[type]}
                  </p>

                  <!-- OTP Box -->
                  <div style="text-align: center; margin: 30px 0;">
                    <div style="display: inline-block; background-color: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 6px; padding: 15px 30px; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #4f46e5;">
                      ${code}
                    </div>
                  </div>

                  <p style="font-size: 14px; color: #6b7280; text-align: center;">
                    This code will expire in <strong>15 minutes</strong>. If you didn't request this, you can safely ignore this email.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0;">&copy; ${new Date().getFullYear()} NGL App. All rights reserved.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
