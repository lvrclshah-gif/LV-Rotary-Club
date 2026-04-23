# Rotary Community Grant Application System

A complete web-based grant application system for Rotary clubs, featuring form submission, approval workflow, and email notifications.

## Features

- **Professional HTML form** - Responsive, modern design with Rotary branding
- **Google Apps Script backend** - Serverless form processing and approvals
- **Google Sheets integration** - Automatic data storage and management
- **Email workflow** - Automated approval notifications and status updates
- **Dynamic configuration** - Customizable dates, amounts, and club details via Settings sheet
- **Multi-stage approval** - Optional school district approval before Rotarian sponsor approval

## Files

### Frontend
- `grant_form_final_complete.html` - Professional web form (update YOUR_APPS_SCRIPT_URL)

### Backend
- `apps_script_final_complete.gs` - Google Apps Script (paste into Google Sheet Extensions)

### Documentation
- `README.md` - This file
- `SETUP_GUIDE_FINAL_COMPLETE.md` - Step-by-step setup instructions
- `SETTINGS_CONFIGURATION.md` - How to configure the Settings sheet
- `REBUILD_PROMPT.md` - Complete prompt to rebuild if needed

## Quick Start

1. **Create Google Sheet** with 3 tabs: Grant Applications, Rotarians, Settings
2. **Go to Extensions → Apps Script** and paste `apps_script_final_complete.gs`
3. **Deploy** as Web App (Execute as your email, Anyone access)
4. **Update HTML** - Replace `YOUR_APPS_SCRIPT_URL` with your deployment URL
5. **Host HTML** on Netlify, GitHub Pages, or your web server
6. **Populate Rotarians sheet** with club member names and emails
7. **Fill Settings sheet** with your club's details

See `SETUP_GUIDE_FINAL_COMPLETE.md` for detailed instructions.

## Form Sections

1. **Organization Information** - Name, contact, address, type, tax ID
2. **Project Details** - Title, description, location, amount, dates
3. **School District** (optional) - Approval chain if project involves school
4. **Rotarian Sponsor** - Select from dropdown or add custom
5. **Signature** - Typed name and date

## Approval Workflow

```
Form Submitted
     ↓
School Approval Needed? 
  ├─ YES → Email School → School Approves → Email Sponsor
  └─ NO → Email Sponsor Directly
     ↓
Sponsor Approves → Email Applicant (Approved for Review)
     ↓
Complete
```

## Settings Sheet Configuration

| Key | Value | Example |
|-----|-------|---------|
| Grant Leads | Email(s) | john@example.com |
| Min Grant | Amount | 500 |
| Max Grant | Amount | 1000 |
| Award Ceremony Date | Date | Tuesday, May 19 |
| Award Ceremony Time | Time | 8:15 AM |
| Award Ceremony Location | Location | First Street Alehouse |
| Meeting Times | Times | Tuesdays, 8:15-9:30 AM |
| Decision Notification Date | Date phrase | early in the week of May 11 |
| Club Name | Club name | Rotary Club of Livermore Valley |

## Email Templates

All emails are **hardcoded in Apps Script** (not customizable in sheet):

1. **Application Received** - Simple confirmation to applicant
2. **Approval Request** - All form details to school/sponsor + approval button
3. **Status Update** - When school approves, notifies applicant
4. **Approved for Review** - When sponsor approves, detailed info to applicant

## Color Palette

- **Primary Blue**: #003da5 (Rotary brand)
- **Accent Yellow**: #FFB81C (Rotary brand)
- **Text**: #1a1a1a (dark), #666 (light)
- **Background**: #f8f9fa (light)

## Customization

### Change min/max grant amounts
Edit Settings sheet rows 2-3

### Change award ceremony details
Edit Settings sheet rows 4-6

### Add/remove Rotarians
Edit Rotarians sheet (Name, Email columns)

### Change meeting times
Edit Settings sheet row 7

### Change club name in emails
Edit Settings sheet row 9

**Do NOT** change column headers in sheets.

## Technical Architecture

- **Frontend**: HTML5, CSS3, vanilla JavaScript
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **Email**: Gmail API (via Apps Script)
- **Form submission**: POST to Apps Script
- **Approvals**: POST form submission (not URL links)

## Troubleshooting

**Form won't submit?**
- Check YOUR_APPS_SCRIPT_URL is correct in HTML (2 places)
- Ensure Apps Script is deployed as Web App

**Rotarians dropdown empty?**
- Populate Rotarians sheet (Name in A, Email in B)
- Ensure no blank rows at top

**Grant amounts not showing?**
- Check Settings sheet rows 2-3 have values
- Ensure column B has the numbers

**Approval link not working?**
- Redeploy Apps Script (get new deployment URL)
- Update HTML with new URL

**Emails not sending?**
- Check Gmail is enabled in Apps Script
- Verify email addresses are valid

## Support

If system breaks, use `REBUILD_PROMPT.md` to rebuild from scratch with Claude.

## License

© Rotary Club of Livermore Valley
