import { transporter } from "../config/mailer.ts";

export async function sendEmailVerification(
  email: string,
  otp: string,
): Promise<void> {
  try {
    const res = await transporter.sendMail({
      from: `"Hamara Kunda" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email - Hamara Kunda",

      html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Email Verification</title>
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellspacing="0" cellpadding="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellspacing="0" cellpadding="0"
style="background:#ffffff;border-radius:12px;padding:40px;box-shadow:0 4px 16px rgba(0,0,0,.08);">

<tr>
<td align="center">

<h1 style="margin:0;color:#2563eb;font-size:30px;">
Hamara Kunda
</h1>

<p style="margin-top:8px;color:#666;font-size:16px;">
Connecting our local community.
</p>

</td>
</tr>

<tr>
<td>

<h2 style="margin-top:40px;color:#222;">
Verify your email
</h2>

<p style="font-size:16px;color:#555;line-height:1.7;">
Welcome to <strong>Hamara Kunda</strong>!

Use the OTP below to verify your email address.
This OTP is valid for <strong>10 minutes</strong>.
</p>

<div
style="
margin:40px auto;
width:220px;
padding:18px;
background:#2563eb;
color:white;
font-size:34px;
font-weight:bold;
letter-spacing:10px;
text-align:center;
border-radius:10px;
">

${otp}

</div>

<p style="font-size:15px;color:#666;line-height:1.7;">
If you didn't request this verification, you can safely ignore this email.
</p>

<hr style="margin:40px 0;border:none;border-top:1px solid #eee;">

<p style="text-align:center;color:#888;font-size:13px;">
© ${new Date().getFullYear()} Hamara Kunda
<br>
Made for our community ❤️
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
      `,
    });
  } catch (err) {
    console.error("Error sending verification email:", err);
    throw new Error("Unable to send verification email.");
  }
}
