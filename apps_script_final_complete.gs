// Rotary Club Grant Application - Complete Backend
// Templates hardcoded. Key values (dates, locations, times) come from Settings sheet.

function doPost(e) {
  // Handle approval POST requests
  if (e.parameter.action === 'approve') {
    try {
      const appId = e.parameter.appId;
      const role = e.parameter.role;
      
      if (!appId || !role) {
        return ContentService.createTextOutput('Invalid approval request').setMimeType(ContentService.MimeType.TEXT);
      }
      
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName("Grant Applications");
      const settingsSheet = ss.getSheetByName("Settings");
      const data = sheet.getDataRange().getValues();
      const settingsData = settingsSheet.getDataRange().getValues();
      const grantLeads = getSettingValue(settingsData, "Grant Leads");
      
      // Find the application
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]).trim() === String(appId).trim()) {
          if (role === "School") {
            // School approved
            sheet.getRange(i + 1, 31).setValue("Yes");
            sheet.getRange(i + 1, 33).setValue("Pending Sponsor Approval");
            
            // Send email to sponsor with ALL form details
            const sponsorEmail = data[i][26];
            sendApprovalEmail(sponsorEmail, "Sponsor", appId, {
              period: data[i][2],
              orgName: data[i][3],
              address: data[i][4],
              website: data[i][5],
              contactName: data[i][6],
              contactTitle: data[i][7],
              phone: data[i][8],
              fax: data[i][9],
              email: data[i][10],
              orgType: data[i][11],
              incorp: data[i][12],
              taxId: data[i][13],
              hasBoard: data[i][14],
              prevGrants: data[i][15],
              projectTitle: data[i][16],
              projectDesc: data[i][17],
              location: data[i][18],
              amount: data[i][19],
              startDate: data[i][20],
              endDate: data[i][21],
              payableTo: data[i][22]
            });
            
            // Notify applicant
            sendApprovalNotification(data[i][10], data[i][6], "School Administrator", appId);
            
          } else if (role === "Sponsor") {
            // Sponsor approved
            sheet.getRange(i + 1, 32).setValue("Yes");
            sheet.getRange(i + 1, 33).setValue("Fully Approved");
            
            // Send approval to applicant
            sendApprovalApprovedEmail(data[i][10], data[i][6], appId);
          }
          
          return ContentService.createTextOutput('Approval recorded successfully').setMimeType(ContentService.MimeType.TEXT);
        }
      }
      
      return ContentService.createTextOutput('Application not found').setMimeType(ContentService.MimeType.TEXT);
      
    } catch (error) {
      Logger.log('Error in approval POST: ' + error.toString());
      return ContentService.createTextOutput('Error: ' + error.toString()).setMimeType(ContentService.MimeType.TEXT);
    }
  }
  
  // Original form submission
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Grant Applications");
    const settingsSheet = ss.getSheetByName("Settings");
    const settingsData = settingsSheet.getDataRange().getValues();
    
    const data = JSON.parse(e.postData.contents);
    
    // Get settings
    const grantLeads = getSettingValue(settingsData, "Grant Leads");
    const minGrant = parseInt(getSettingValue(settingsData, "Min Grant")) || 500;
    const maxGrant = parseInt(getSettingValue(settingsData, "Max Grant")) || 1000;
    
    const appId = "APP-" + new Date().getTime();
    const timestamp = new Date();
    
    // Determine initial status and who to email first
    let initialStatus = "Pending School Approval";
    let firstApproverEmail = data.schoolEmail;
    let firstApproverRole = "School";
    
    if (!data.isSchool || !data.schoolEmail) {
      initialStatus = "Pending Sponsor Approval";
      firstApproverEmail = data.sponsorEmail;
      firstApproverRole = "Sponsor";
    }
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Application ID',
        'Submission Date',
        'Period',
        'Organization Name',
        'Address',
        'Website',
        'Contact Person',
        'Title',
        'Phone',
        'Fax',
        'Email',
        'Org Type',
        'Incorporated',
        'Tax ID',
        'Board of Directors',
        'Previous Grants',
        'Project Title',
        'Project Description',
        'Location',
        'Amount Requested',
        'Start Date',
        'End Date',
        'Check Payable To',
        'Applicant Signature',
        'Signature Date',
        'Rotarian Sponsor Name',
        'Rotarian Sponsor Email',
        'School Involved',
        'School Approval By',
        'School Contact Email',
        'School Approved',
        'Sponsor Approved',
        'Overall Status'
      ]);
    }
    
    // Append application data
    sheet.appendRow([
      appId,
      timestamp,
      data.period || '',
      data.orgName || '',
      data.address || '',
      data.website || '',
      data.contactName || '',
      data.contactTitle || '',
      data.phone || '',
      data.fax || '',
      data.email || '',
      data.orgType || '',
      data.incorp || '',
      data.taxId || '',
      data.hasBoard || '',
      data.prevGrants || '',
      data.projectTitle || '',
      data.projectDesc || '',
      data.location || '',
      data.amount || '',
      data.startDate || '',
      data.endDate || '',
      data.payableTo || '',
      data.signature || '',
      data.signatureDate || '',
      data.sponsorName || '',
      data.sponsorEmail || '',
      data.isSchool ? 'Yes' : 'No',
      data.schoolApprover || '',
      data.schoolEmail || '',
      'No',  // School Approved
      'No',  // Sponsor Approved
      initialStatus  // Overall Status
    ]);
    
    // Send first approval email
    if (firstApproverEmail) {
      sendApprovalEmail(firstApproverEmail, firstApproverRole, appId, data);
    }
    
    // Send confirmation to applicant
    sendApplicationConfirmation(data.email, data.contactName, data.projectTitle, appId, data.isSchool && data.schoolEmail);
    
    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      appId: appId,
      message: 'Application submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle getRotarians action
  if (e.parameter.action === 'getRotarians') {
    const rotarians = getRotarians();
    return ContentService.createTextOutput(JSON.stringify(rotarians))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Handle getGrantLimits action
  if (e.parameter.action === 'getGrantLimits') {
    const limits = getGrantLimits();
    return ContentService.createTextOutput(JSON.stringify(limits))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput('Not Found').setMimeType(ContentService.MimeType.TEXT);
}

function sendApprovalEmail(toEmail, role, appId, appData) {
  const webAppUrl = ScriptApp.getService().getUrl();
  const settings = getCustomSettings();
  
  let subject = '';
  let roleText = '';
  
  if (role === "School") {
    subject = 'School District Approval Needed: ' + appData.projectTitle;
    roleText = 'School District Administrator';
  } else {
    subject = 'Rotarian Sponsor Approval Needed: ' + appData.projectTitle;
    roleText = 'Rotarian Sponsor';
  }
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
      <div style="background: #003da5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">${settings.clubName}</h2>
        <p style="margin: 5px 0;">Grant Application Review</p>
      </div>
      
      <div style="border: 1px solid #ddd; padding: 20px; border-radius: 0 0 8px 8px;">
        <p>Dear ${roleText},</p>
        
        <p>A grant application requires your review and approval:</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #FFB81C; margin: 20px 0;">
          <h3 style="color: #003da5; margin-top: 0;">Applicant Information</h3>
          <p><strong>Organization:</strong> ${appData.orgName}</p>
          <p><strong>Contact Person:</strong> ${appData.contactName}</p>
          <p><strong>Title:</strong> ${appData.contactTitle || 'N/A'}</p>
          <p><strong>Phone:</strong> ${appData.phone}</p>
          <p><strong>Email:</strong> ${appData.email}</p>
          <p><strong>Address:</strong> ${appData.address}</p>
          <p><strong>Website:</strong> ${appData.website || 'N/A'}</p>
          <p><strong>Type of Organization:</strong> ${appData.orgType}</p>
          <p><strong>Incorporated:</strong> ${appData.incorp || 'N/A'}</p>
          <p><strong>Tax ID:</strong> ${appData.taxId || 'N/A'}</p>
          <p><strong>Board of Directors:</strong> ${appData.hasBoard}</p>
          <p><strong>Previous Grants:</strong> ${appData.prevGrants || 'None'}</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #FFB81C; margin: 20px 0;">
          <h3 style="color: #003da5; margin-top: 0;">Project Details</h3>
          <p><strong>Project Title:</strong> ${appData.projectTitle}</p>
          <p><strong>Project Description:</strong> ${appData.projectDesc}</p>
          <p><strong>Location:</strong> ${appData.location}</p>
          <p><strong>Amount Requested:</strong> $${appData.amount}</p>
          <p><strong>Project Period:</strong> ${appData.startDate} to ${appData.endDate}</p>
          <p><strong>Check Payable To:</strong> ${appData.payableTo}</p>
          <p><strong>Application Period:</strong> ${appData.period}</p>
          <p><strong>Application ID:</strong> ${appId}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <form method="POST" action="${webAppUrl}" style="display: inline;">
            <input type="hidden" name="action" value="approve">
            <input type="hidden" name="appId" value="${appId}">
            <input type="hidden" name="role" value="${role}">
            <button type="submit" style="background-color: #FFB81C; color: #003da5; padding: 15px 40px; border: none; font-weight: bold; border-radius: 5px; font-size: 16px; cursor: pointer;">
              REVIEW & APPROVE
            </button>
          </form>
        </div>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This is an automated message from ${settings.clubName}. 
          Do not reply to this email.
        </p>
      </div>
    </div>
  `;
  
  try {
    MailApp.sendEmail(toEmail, subject, '', { htmlBody: htmlBody });
    Logger.log('Approval email sent to: ' + toEmail);
  } catch (err) {
    Logger.log('Error sending approval email: ' + err);
  }
}

function sendApplicationConfirmation(toEmail, contactName, projectTitle, appId, requiresSchool) {
  const settings = getCustomSettings();
  
  let waitingFor = 'your Rotarian Sponsor';
  if (requiresSchool) {
    waitingFor = 'the School District Administrator';
  }
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #003da5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">Application Received</h2>
        <p style="margin: 5px 0;">${settings.clubName}</p>
      </div>
      
      <div style="border: 1px solid #ddd; padding: 20px; border-radius: 0 0 8px 8px;">
        <p>Dear ${contactName},</p>
        
        <p>Your application is complete and is currently waiting for approval from ${waitingFor}.</p>
        
        <p>Thank you,</p>
        <p><strong>${settings.clubName}</strong><br>
        Community Grants Committee</p>
      </div>
    </div>
  `;
  
  try {
    MailApp.sendEmail(toEmail, 'Grant Application Received: ' + projectTitle, '', { htmlBody: htmlBody });
    Logger.log('Confirmation email sent to: ' + toEmail);
  } catch (err) {
    Logger.log('Error sending confirmation email: ' + err);
  }
}

function sendApprovalNotification(toEmail, contactName, approverRole, appId) {
  const settings = getCustomSettings();
  
  let message = '';
  if (approverRole === "School Administrator") {
    message = 'Your application has been approved by the School District and is now awaiting final Sponsor review.';
  } else {
    message = 'Your application is currently with the School District Administrator for approval.';
  }
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #003da5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">Application Status Update</h2>
      </div>
      
      <div style="border: 1px solid #ddd; padding: 20px; border-radius: 0 0 8px 8px;">
        <p>Dear ${contactName},</p>
        
        <p>${message}</p>
        
        <p><strong>Application ID:</strong> ${appId}</p>
        
        <p>Thank you,<br>
        <strong>${settings.clubName}</strong></p>
      </div>
    </div>
  `;
  
  try {
    MailApp.sendEmail(toEmail, 'Application Status Update', '', { htmlBody: htmlBody });
  } catch (err) {
    Logger.log('Error sending status email: ' + err);
  }
}

function sendApprovalApprovedEmail(applicantEmail, applicantName, appId) {
  const settings = getCustomSettings();
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #003da5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">Application Approved for Review</h2>
      </div>
      
      <div style="border: 1px solid #ddd; padding: 20px; border-radius: 0 0 8px 8px;">
        <p>Dear ${applicantName},</p>
        
        <p>Your application has been approved and is now under final review.</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #FFB81C; margin: 20px 0;">
          <p><strong>Application ID:</strong> ${appId}</p>
        </div>
        
        <p>We will notify you ${settings.decisionNotificationDate} whether your application is successful.</p>
        
        <p><strong>If approved,</strong> we will be awarding grants at a club meeting on ${settings.awardCeremonyDate} at ${settings.awardCeremonyLocation}. The meeting starts at ${settings.awardCeremonyTime} and lasts about an hour. Recipients are expected to present their project results at a future club meeting (${settings.meetingTimes}).</p>
        
        <p>Please let me know if you have any questions.</p>
        
        <p>Thank you,</p>
        <p><strong>${settings.clubName}</strong><br>
        Community Grants Committee</p>
      </div>
    </div>
  `;
  
  try {
    MailApp.sendEmail(applicantEmail, 'Application Approved for Review', '', { htmlBody: htmlBody });
  } catch (err) {
    Logger.log('Error sending approval email: ' + err);
  }
}

// Get Rotarians list for form dropdown
function getRotarians() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const rotariansSheet = ss.getSheetByName("Rotarians");
    const data = rotariansSheet.getDataRange().getValues();
    
    const rotarians = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][1]) {
        rotarians.push({
          name: data[i][0],
          email: data[i][1]
        });
      }
    }
    
    return rotarians;
  } catch (error) {
    Logger.log('Error getting rotarians: ' + error);
    return [];
  }
}

// Get grant min/max amounts from Settings sheet
function getGrantLimits() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const settingsSheet = ss.getSheetByName("Settings");
    const data = settingsSheet.getDataRange().getValues();
    
    let minGrant = 500;
    let maxGrant = 1000;
    
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === "Min Grant") minGrant = parseInt(data[i][1]);
      if (data[i][0] === "Max Grant") maxGrant = parseInt(data[i][1]);
    }
    
    return { min: minGrant, max: maxGrant };
  } catch (error) {
    Logger.log('Error getting grant limits: ' + error);
    return { min: 500, max: 1000 };
  }
}

// Get custom settings (dates, locations, times, etc.)
function getCustomSettings() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const settingsSheet = ss.getSheetByName("Settings");
    const data = settingsSheet.getDataRange().getValues();
    
    const settings = {
      awardCeremonyDate: 'Tuesday, May 19',
      awardCeremonyTime: '8:15 AM',
      awardCeremonyLocation: 'First Street Alehouse',
      meetingTimes: 'Tuesdays, 8:15-9:30 AM',
      decisionNotificationDate: 'early in the week of May 11',
      clubName: 'Rotary Club of Livermore Valley'
    };
    
    // Override defaults with values from Settings sheet
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === "Award Ceremony Date" && data[i][1]) settings.awardCeremonyDate = data[i][1];
      if (data[i][0] === "Award Ceremony Time" && data[i][1]) settings.awardCeremonyTime = data[i][1];
      if (data[i][0] === "Award Ceremony Location" && data[i][1]) settings.awardCeremonyLocation = data[i][1];
      if (data[i][0] === "Meeting Times" && data[i][1]) settings.meetingTimes = data[i][1];
      if (data[i][0] === "Decision Notification Date" && data[i][1]) settings.decisionNotificationDate = data[i][1];
      if (data[i][0] === "Club Name" && data[i][1]) settings.clubName = data[i][1];
    }
    
    return settings;
  } catch (error) {
    Logger.log('Error getting custom settings: ' + error);
    return {
      awardCeremonyDate: 'Tuesday, May 19',
      awardCeremonyTime: '8:15 AM',
      awardCeremonyLocation: 'First Street Alehouse',
      meetingTimes: 'Tuesdays, 8:15-9:30 AM',
      decisionNotificationDate: 'early in the week of May 11',
      clubName: 'Rotary Club of Livermore Valley'
    };
  }
}

function getSettingValue(settingsData, key) {
  for (let i = 0; i < settingsData.length; i++) {
    if (settingsData[i][0] === key) {
      return settingsData[i][1];
    }
  }
  return '';
}
