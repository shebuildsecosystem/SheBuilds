import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'testingbydivyansh@gmail.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || ''
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  // Welcome email for new users
  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f59e0b;">Welcome to SheBuilds! 🚀</h1>
        <p>Hi ${userName},</p>
        <p>Welcome to the SheBuilds community! We're excited to have you join our platform for builders.</p>
        <p>Here's what you can do:</p>
        <ul>
          <li>Create and showcase your projects</li>
          <li>Apply for grants to support your work</li>
          <li>Participate in monthly challenges</li>
          <li>Connect with other builders</li>
        </ul>
        <p>Start building your portfolio and making an impact!</p>
        <p>Best regards,<br>The SheBuilds Team</p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Welcome to SheBuilds!',
      html
    });
  }

  // Grant application confirmation
  async sendGrantApplicationEmail(userEmail: string, userName: string, projectTitle: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f59e0b;">Grant Application Received! 📝</h1>
        <p>Hi ${userName},</p>
        <p>We've received your grant application for the project: <strong>${projectTitle}</strong></p>
        <p>Our team will review your application and get back to you within 5-7 business days.</p>
        <p>You can track your application status in your dashboard.</p>
        <p>Best regards,<br>The SheBuilds Team</p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Grant Application Received - SheBuilds',
      html
    });
  }

  // Grant approval notification
  async sendGrantApprovalEmail(userEmail: string, userName: string, projectTitle: string, amount: number): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981;">Congratulations! 🎉</h1>
        <p>Hi ${userName},</p>
        <p>Great news! Your grant application for <strong>${projectTitle}</strong> has been approved!</p>
        <p>Grant Amount: ₹${amount}</p>
        <p>We'll be in touch soon with the disbursement details.</p>
        <p>Keep building amazing things!</p>
        <p>Best regards,<br>The SheBuilds Team</p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Grant Approved - SheBuilds',
      html
    });
  }

  // Challenge registration confirmation
  async sendChallengeRegistrationEmail(userEmail: string, userName: string, challengeTitle: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8b5cf6;">Challenge Registration Confirmed! 🏆</h1>
        <p>Hi ${userName},</p>
        <p>You've successfully registered for the challenge: <strong>${challengeTitle}</strong></p>
        <p>Check your dashboard for challenge details and submission guidelines.</p>
        <p>Good luck with your project!</p>
        <p>Best regards,<br>The SheBuilds Team</p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Challenge Registration Confirmed - SheBuilds',
      html
    });
  }

  // Contact form email (sends message to SheBuilds team + confirmation to sender)
  async sendContactEmail(senderName: string, senderEmail: string, message: string): Promise<boolean> {
    const teamHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f59e0b;">New Contact Form Message</h1>
        <p><strong>From:</strong> ${senderName} (${senderEmail})</p>
        <hr style="border: 1px solid #e5e7eb;" />
        <p style="white-space: pre-wrap;">${message}</p>
        <hr style="border: 1px solid #e5e7eb;" />
        <p style="color: #6b7280; font-size: 12px;">This message was sent via the SheBuilds contact form.</p>
      </div>
    `;

    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f59e0b;">We received your message!</h1>
        <p>Hi ${senderName},</p>
        <p>Thank you for reaching out to SheBuilds. We've received your message and will get back to you within 2-3 business days.</p>
        <p><strong>Your message:</strong></p>
        <blockquote style="border-left: 3px solid #f59e0b; padding-left: 12px; color: #4b5563;">${message}</blockquote>
        <p>Best regards,<br>The SheBuilds Team</p>
      </div>
    `;

    // Send to team
    const teamEmail = await this.sendEmail({
      to: process.env.CONTACT_EMAIL || 'shebuilds.hacks@gmail.com',
      subject: `Contact Form: Message from ${senderName}`,
      html: teamHtml
    });

    // Send confirmation to sender
    const confirmEmail = await this.sendEmail({
      to: senderEmail,
      subject: 'We received your message - SheBuilds',
      html: confirmationHtml
    });

    return teamEmail && confirmEmail;
  }

  // Password reset email
  async sendPasswordResetEmail(userEmail: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ef4444;">Password Reset Request</h1>
        <p>You requested a password reset for your SheBuilds account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>The SheBuilds Team</p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Password Reset - SheBuilds',
      html
    });
  }
}

export const emailService = new EmailService(); 