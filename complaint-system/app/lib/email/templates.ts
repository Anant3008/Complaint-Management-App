import transporter from "./transporter";

export type NewComplaintEmailData = {
  title: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  description?: string;
  complaintId: string;
};

export type StatusUpdateEmailData = {
  title: string;
  status: "Pending" | "In Progress" | "Resolved";
  complaintId: string;
  updatedAt: string;
};

export async function sendNewComplaintEmail(data: NewComplaintEmailData) {
  const { title, category, priority, description, complaintId } = data;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 4px; text-align: center; margin-bottom: 20px; }
          .content { background: white; padding: 20px; border-radius: 4px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #667eea; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .badge-high { background: #fee; color: #c33; }
          .badge-medium { background: #ffeaa7; color: #d97706; }
          .badge-low { background: #d4edda; color: #155724; }
          .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Complaint Submitted</h1>
          </div>
          <div class="content">
            <p>A new complaint has been submitted and requires attention.</p>
            
            <div class="field">
              <span class="label">Title:</span>
              <p>${title}</p>
            </div>
            
            <div class="field">
              <span class="label">Category:</span>
              <p>${category}</p>
            </div>
            
            <div class="field">
              <span class="label">Priority:</span>
              <p>
                <span class="badge badge-${priority.toLowerCase()}">
                  ${priority}
                </span>
              </p>
            </div>
            
            <div class="field">
              <span class="label">Description:</span>
              <p>${description || "No description provided."}</p>
            </div>
            
            <div class="field">
              <span class="label">Complaint ID:</span>
              <p><code>${complaintId}</code></p>
            </div>
            
            <p style="margin-top: 25px;">
              <a href="${process.env.ADMIN_URL || "http://localhost:3000"}/admin" style="display: inline-block; background: #667eea; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none;">View in Dashboard</a>
            </p>
          </div>
          <div class="footer">
            <p>This is an automated email from the Complaint Management System.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Complaint: ${title}`,
      html: htmlContent,
    });
    console.log("New complaint email sent successfully");
  } catch (error) {
    console.error("Error sending new complaint email:", error);
    throw error;
  }
}

export async function sendStatusUpdateEmail(data: StatusUpdateEmailData) {
  const { title, status, complaintId, updatedAt } = data;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 4px; text-align: center; margin-bottom: 20px; }
          .content { background: white; padding: 20px; border-radius: 4px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #667eea; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .badge-pending { background: #ffeaa7; color: #d97706; }
          .badge-progress { background: #d4edda; color: #155724; }
          .badge-resolved { background: #d1ecf1; color: #0c5460; }
          .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Complaint Status Updated</h1>
          </div>
          <div class="content">
            <p>A complaint status has been updated.</p>
            
            <div class="field">
              <span class="label">Title:</span>
              <p>${title}</p>
            </div>
            
            <div class="field">
              <span class="label">New Status:</span>
              <p>
                <span class="badge badge-${status.toLowerCase().replace(/\s+/g, "")}">
                  ${status}
                </span>
              </p>
            </div>
            
            <div class="field">
              <span class="label">Updated At:</span>
              <p>${new Date(updatedAt).toLocaleString()}</p>
            </div>
            
            <div class="field">
              <span class="label">Complaint ID:</span>
              <p><code>${complaintId}</code></p>
            </div>
            
            <p style="margin-top: 25px;">
              <a href="${process.env.ADMIN_URL || "http://localhost:3000"}/admin" style="display: inline-block; background: #667eea; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none;">View in Dashboard</a>
            </p>
          </div>
          <div class="footer">
            <p>This is an automated email from the Complaint Management System.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Complaint Status Updated: ${title}`,
      html: htmlContent,
    });
    console.log("Status update email sent successfully");
  } catch (error) {
    console.error("Error sending status update email:", error);
    throw error;
  }
}
