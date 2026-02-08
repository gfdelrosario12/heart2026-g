import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let data: any;
  try {
    data = await request.json();
    const { response, alternateDate, venue, programFlow, dateDetails, timestamp } = data;

    // Use sender email from environment variable
    const senderEmail = process.env.SENDER_EMAIL;
    const recipientEmail = 'gladwin.delrosario.organizations@gmail.com';
    const appPassword = process.env.APP_PASSWORD;

    // Build program flow HTML
    const programFlowHTML = programFlow
      .map((item: { time: string; activity: string }) => 
        `<tr>
          <td style="padding: 8px; color: #ec4899; font-family: monospace;">${item.time}</td>
          <td style="padding: 8px; color: #fda4af;">${item.activity}</td>
        </tr>`
      )
      .join('');

    // Email HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #1e293b; color: #f1f5f9; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(to bottom right, #831843, #881337); border-radius: 12px; padding: 30px; }
            .header { text-align: center; margin-bottom: 30px; }
            .heart { font-size: 48px; margin-bottom: 10px; }
            h1 { color: #fce7f3; margin: 0; }
            .section { background: rgba(136, 19, 55, 0.3); border: 1px solid rgba(236, 72, 153, 0.3); border-radius: 8px; padding: 20px; margin: 20px 0; }
            .section h2 { color: #fce7f3; font-size: 18px; margin-top: 0; }
            .response-yes { color: #86efac; font-weight: bold; font-size: 24px; }
            .response-alternate { color: #fbbf24; font-weight: bold; font-size: 24px; }
            table { width: 100%; border-collapse: collapse; }
            .link { color: #f9a8d4; text-decoration: none; }
            .link:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="heart">💕</div>
              <h1>Valentine's Day Response!</h1>
            </div>

            <div class="section">
              <h2>Response</h2>
              <p class="${response === 'yes' ? 'response-yes' : 'response-alternate'}">
                ${response === 'yes' ? '✅ YES! She said YES! 🎉' : '📅 Alternate date suggested'}
              </p>
              ${alternateDate ? `<p style="color: #fda4af;">Suggested Date: ${new Date(alternateDate).toLocaleString()}</p>` : ''}
              <p style="color: #cbd5e1; font-size: 12px;">Timestamp: ${new Date(timestamp).toLocaleString()}</p>
            </div>

            <div class="section">
              <h2>📍 Venue Details</h2>
              <p style="color: #fda4af; font-weight: bold;">${venue.name}</p>
              <p style="color: #fda4af; font-size: 14px;">${venue.address}</p>
              <p>
                <a href="${venue.googleMapsLink}" class="link" target="_blank">📍 View on Google Maps</a><br>
                <a href="${venue.tiktokLink}" class="link" target="_blank">🎵 TikTok Inspiration</a>
              </p>
            </div>

            <div class="section">
              <h2>📅 ${dateDetails.occasion} - ${dateDetails.date}</h2>
              <h3 style="color: #fce7f3; margin-bottom: 15px;">Program Flow</h3>
              <table>
                ${programFlowHTML}
              </table>
            </div>

            <div style="text-align: center; margin-top: 30px; color: #fda4af;">
              <p>💖 Sent from Valentine's IAM Platform 💖</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Create email message in RFC 822 format
    const subject = `💕 Valentine's Date ${response === 'yes' ? 'Confirmed!' : 'Alternate Date Suggested'}`;
    const emailMessage = [
      `From: ${senderEmail}`,
      `To: ${recipientEmail}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=utf-8`,
      ``,
      htmlContent
    ].join('\r\n');

    // Send using Gmail SMTP
    const smtpUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/send`;
    
    // Use nodemailer-compatible approach
    const nodemailerTransport = await import('nodemailer');
    const transporter = nodemailerTransport.default.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: senderEmail,
        pass: appPassword,
      },
    });

    await transporter.sendMail({
      from: senderEmail,
      to: recipientEmail,
      subject: subject,
      html: htmlContent,
    });

    console.log('✅ Email sent successfully to:', recipientEmail);

    return NextResponse.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('❌ Email sending error:', error);
    
    // Still log the data
    console.log('=== VALENTINE RESPONSE DATA ===');
    console.log(JSON.stringify(data, null, 2));
    console.log('================================');
    
    return NextResponse.json(
      { success: false, error: 'Failed to send email', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}