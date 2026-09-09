import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'contact@devmatesolutions.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'The Inner Circle DXB <onboarding@resend.dev>';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      referenceName,
      referenceRelationship,
      sponsorContact,
      fullName,
      email,
      phone,
      location,
      companyName,
      title,
      industry,
      revenueStage,
      businessDescription,
      websiteUrl,
      linkedinUrl,
      instagramHandle,
      contributionReason,
    } = body;

    // Validate required fields
    if (!fullName || !email || !referenceName || !referenceRelationship) {
      return NextResponse.json(
        { error: 'Please complete all required fields including your reference.' },
        { status: 400 }
      );
    }

    const applicationRef = 'TIC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const submissionTime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Dubai',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Membership Dossier - The Inner Circle DXB</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0b0e; color: #e5e5e7; margin: 0; padding: 30px 15px; }
        .container { max-width: 620px; margin: 0 auto; background-color: #121217; border: 1px solid #2a261a; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8); }
        .header { background: linear-gradient(180deg, #1a1711 0%, #121217 100%); padding: 36px 30px; text-align: center; border-bottom: 1px solid #332b1a; }
        .badge { display: inline-block; font-size: 10px; text-transform: uppercase; letter-spacing: 2.5px; color: #d4af37; background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.25); padding: 4px 14px; border-radius: 12px; margin-bottom: 14px; }
        .title { font-size: 24px; color: #f5f5f7; font-weight: 300; letter-spacing: 4px; margin: 0 0 6px 0; text-transform: uppercase; }
        .subtitle { font-size: 11px; color: #a19d93; letter-spacing: 2px; text-transform: uppercase; }
        .content { padding: 32px 30px; }
        .section { margin-bottom: 26px; }
        .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #d4af37; border-bottom: 1px solid #262116; padding-bottom: 8px; margin-bottom: 16px; font-weight: 600; }
        .data-grid { width: 100%; border-collapse: collapse; }
        .data-grid td { padding: 8px 0; vertical-align: top; font-size: 13px; line-height: 1.5; }
        .data-label { color: #8a8880; width: 38%; }
        .data-val { color: #f0ede6; font-weight: 500; }
        .data-val a { color: #d4af37; text-decoration: none; word-break: break-all; }
        .highlight-box { background: rgba(212, 175, 55, 0.05); border-left: 2px solid #d4af37; padding: 12px 16px; margin-top: 10px; border-radius: 0 6px 6px 0; }
        .footer { background-color: #0b0b0e; padding: 20px 30px; text-align: center; border-top: 1px solid #1f1d18; font-size: 11px; color: #5a5852; letter-spacing: 1px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="badge">CONFIDENTIAL ADMISSION DOSSIER</div>
          <h1 class="title">— THE INNER CIRCLE —</h1>
          <div class="subtitle">DXB PRIVATE SYNDICATE • APPLICATION #${applicationRef}</div>
        </div>
        
        <div class="content">
          <!-- Reference Section -->
          <div class="section">
            <div class="section-title">01. Sponsor & Referral Verification</div>
            <table class="data-grid">
              <tr>
                <td class="data-label">Sponsor / Reference:</td>
                <td class="data-val" style="color: #f7d679; font-weight: 600;">${referenceName}</td>
              </tr>
              <tr>
                <td class="data-label">Relationship Context:</td>
                <td class="data-val">${referenceRelationship}</td>
              </tr>
              ${sponsorContact ? `<tr><td class="data-label">Sponsor Contact:</td><td class="data-val">${sponsorContact}</td></tr>` : ''}
            </table>
          </div>

          <!-- Personal Identity Section -->
          <div class="section">
            <div class="section-title">02. Applicant Credentials</div>
            <table class="data-grid">
              <tr>
                <td class="data-label">Full Name:</td>
                <td class="data-val">${fullName}</td>
              </tr>
              <tr>
                <td class="data-label">Direct Email:</td>
                <td class="data-val"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td class="data-label">Mobile / WhatsApp:</td>
                <td class="data-val"><a href="tel:${phone}">${phone || 'Not provided'}</a></td>
              </tr>
              <tr>
                <td class="data-label">Location / Base:</td>
                <td class="data-val">${location || 'Dubai, UAE'}</td>
              </tr>
            </table>
          </div>

          <!-- Business Section -->
          <div class="section">
            <div class="section-title">03. Enterprise & Venture Profile</div>
            <table class="data-grid">
              <tr>
                <td class="data-label">Organization / Venture:</td>
                <td class="data-val">${companyName || 'Not specified'}</td>
              </tr>
              <tr>
                <td class="data-label">Title / Role:</td>
                <td class="data-val">${title || 'Founder / Executive'}</td>
              </tr>
              <tr>
                <td class="data-label">Industry / Sector:</td>
                <td class="data-val">${industry || 'Private Equity / Tech / Luxury'}</td>
              </tr>
              <tr>
                <td class="data-label">Revenue / Scale:</td>
                <td class="data-val">${revenueStage || 'Undisclosed'}</td>
              </tr>
            </table>
            ${businessDescription ? `
            <div class="highlight-box">
              <div style="font-size: 11px; color: #a59368; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px;">Venture Overview</div>
              <div style="font-size: 13px; color: #dedad2; line-height: 1.6;">${businessDescription.replace(/\n/g, '<br/>')}</div>
            </div>` : ''}
          </div>

          <!-- Verification & Links -->
          <div class="section">
            <div class="section-title">04. Digital Footprint & Verification</div>
            <table class="data-grid">
              ${websiteUrl ? `<tr><td class="data-label">Enterprise Website:</td><td class="data-val"><a href="${websiteUrl.startsWith('http') ? websiteUrl : 'https://' + websiteUrl}" target="_blank">${websiteUrl}</a></td></tr>` : ''}
              ${linkedinUrl ? `<tr><td class="data-label">LinkedIn Profile:</td><td class="data-val"><a href="${linkedinUrl.startsWith('http') ? linkedinUrl : 'https://' + linkedinUrl}" target="_blank">${linkedinUrl}</a></td></tr>` : ''}
              ${instagramHandle ? `<tr><td class="data-label">Social / Instagram:</td><td class="data-val">${instagramHandle}</td></tr>` : ''}
            </table>
            ${contributionReason ? `
            <div class="highlight-box" style="margin-top: 14px;">
              <div style="font-size: 11px; color: #a59368; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px;">Syndicate Contribution Statement</div>
              <div style="font-size: 13px; color: #dedad2; line-height: 1.6;">${contributionReason.replace(/\n/g, '<br/>')}</div>
            </div>` : ''}
          </div>
        </div>

        <div class="footer">
          SUBMITTED ON ${submissionTime} (GST) • STRICTLY PRIVILEGED & CONFIDENTIAL<br/>
          THE INNER CIRCLE DXB MEMBERSHIP ADMISSIONS BOARD
        </div>
      </div>
    </body>
    </html>
    `;

    // 1. Save lead to local leads.json backup
    try {
      const leadsFilePath = path.join(process.cwd(), 'leads.json');
      let existingLeads = [];
      if (fs.existsSync(leadsFilePath)) {
        const fileData = fs.readFileSync(leadsFilePath, 'utf8');
        existingLeads = JSON.parse(fileData || '[]');
      }
      existingLeads.unshift({
        referenceId: applicationRef,
        submittedAt: submissionTime,
        fullName,
        email,
        phone,
        referenceName,
        referenceRelationship,
        companyName,
        title,
        linkedinUrl,
        contributionReason,
      });
      fs.writeFileSync(leadsFilePath, JSON.stringify(existingLeads, null, 2), 'utf8');
    } catch (fsErr) {
      console.error('Failed to backup lead to leads.json:', fsErr);
    }

    // 2. Attempt to send email via Resend to contact@devmatesolutions.com
    // Try sending with custom domain first if configured, or default
    let resendResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: [RECIPIENT_EMAIL],
      subject: `[Membership Application] ${fullName} (Ref: ${referenceName})`,
      html: emailHtml,
      replyTo: email,
    });

    // If custom domain is not yet verified on Resend, try fallback sender
    if (resendResult.error && resendResult.error.message?.includes('is not verified')) {
      console.warn('Sender domain not verified on Resend, retrying with onboarding@resend.dev...');
      resendResult = await resend.emails.send({
        from: 'The Inner Circle DXB <onboarding@resend.dev>',
        to: [RECIPIENT_EMAIL],
        subject: `[Membership Application] ${fullName} (Ref: ${referenceName})`,
        html: emailHtml,
        replyTo: email,
      });
    }

    // If test domain restriction prevents sending to external recipient, deliver to account owner email as backup
    if (resendResult.error && resendResult.error.message?.includes('You can only send testing emails to your own email address')) {
      const match = resendResult.error.message.match(/\(([^)]+)\)/);
      const testOwnerEmail = match ? match[1] : 'zangbang360@gmail.com';
      
      console.warn(`Resend sandbox active. Routing lead to account email (${testOwnerEmail}) until domain is verified.`);
      const devNotice = `
        <div style="background: #2a1f0a; border: 1px solid #d4af37; padding: 14px; margin-bottom: 20px; border-radius: 6px; font-size: 12px; color: #f7e6b5;">
          <strong>ACTION REQUIRED FOR DIRECT DELIVERY:</strong><br/>
          This lead was routed to your verified Resend account email (<strong>${testOwnerEmail}</strong>) because <code>${RECIPIENT_EMAIL}</code> requires domain verification in Resend.
          Your DNS record <code>resend._domainkey.devmatesolutions.com</code> is already active! Simply open <a href="https://resend.com/domains" style="color: #fff; text-decoration: underline;">resend.com/domains</a> and click <strong>Verify</strong> to enable direct delivery to <strong>${RECIPIENT_EMAIL}</strong>.
        </div>
      `;

      resendResult = await resend.emails.send({
        from: 'The Inner Circle DXB <onboarding@resend.dev>',
        to: [testOwnerEmail],
        subject: `[LEAD FOR ${RECIPIENT_EMAIL}] [Membership Application] ${fullName} (Ref: ${referenceName})`,
        html: emailHtml.replace('<div class="content">', `<div class="content">${devNotice}`),
        replyTo: email,
      });
    }

    if (resendResult.error) {
      console.error('Resend error:', resendResult.error);
      return NextResponse.json(
        {
          error: resendResult.error.message || 'Failed to dispatch dossier through Resend.',
          referenceId: applicationRef,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Application dossier submitted successfully.',
      referenceId: applicationRef,
      emailId: resendResult.data?.id,
    });
  } catch (err) {
    console.error('Submission error:', err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Internal server error while processing dossier.',
      },
      { status: 500 }
    );
  }
}
