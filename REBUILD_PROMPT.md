# Rotary Grant Form - Complete Rebuild Prompt

Use this prompt to rebuild the entire system if anything breaks or gets corrupted.

---

## SYSTEM REQUIREMENTS

Build a **Rotary Club Grant Application System** with:
- Professional HTML5 form (looks like webpage, not form)
- Google Apps Script backend handling submissions and approvals
- Google Sheets integration for data storage
- Email workflow with approval chain

---

## CORE FEATURES

### 1. HTML Form (Professional Webpage Design)
- **Header**: Rotary branding with logo circle, blue (#003da5) and yellow (#FFB81C) colors
- **5 Sections** with numbered headers:
  1. Organization Information (org name, contact, address, website, type, tax ID, etc.)
  2. Project Details (title, description, location, amount, dates, payable to)
  3. School District Involvement (optional checkbox, conditionally shows school approval fields)
  4. Rotarian Sponsor (dropdown loaded from Rotarians sheet, custom entry option)
  5. Signature (typed name, date)
- **Meeting time notice**: "Tuesdays, 8:15-9:30 AM"
- **Validation**: HTML5 native (required, email, tel, date, number types)
- **Dynamic loading**: Rotarians dropdown and grant limits (min/max) from Apps Script
- **Responsive design**: Mobile-friendly
- **Submit/Reset buttons**: Yellow button for submit, light for reset
- **Success/Error messages**: Display after submission
- **Form actions at bottom**: Centered submit and reset buttons

### 2. Google Apps Script Backend
Two main functions:

#### **doPost(e)** - Form Submission
- Check if action is 'approve' (POST approval)
  - If approve action: update sheet, send emails, return success
  - Otherwise: handle form submission
- Parse form data as JSON
- Generate unique appId: "APP-" + timestamp
- Create headers in sheet if first time
- Append all form data to "Grant Applications" sheet
- Determine if school approval needed first or go straight to sponsor
- Send approval email to school OR sponsor (with ALL form details)
- Send confirmation email to applicant (simple message)
- Return JSON success/error

#### **doGet(e)** - Data Loading
- Handle `?action=getRotarians` → return JSON array of rotarians from Rotarians sheet
- Handle `?action=getGrantLimits` → return JSON with min/max from Settings sheet
- All other requests return "Not Found"

#### **Helper Functions**
- `getRotarians()` - Reads Rotarians sheet (Name, Email columns)
- `getGrantLimits()` - Reads Settings sheet for Min Grant, Max Grant
- `getCustomSettings()` - Reads Settings sheet for:
  - Award Ceremony Date
  - Award Ceremony Time
  - Award Ceremony Location
  - Meeting Times
  - Decision Notification Date
  - Club Name
- `getSettingValue(settingsData, key)` - Utility to find setting by key
- `sendApprovalEmail()` - Email with ALL form details + POST form button
- `sendApplicationConfirmation()` - Simple message to applicant (waiting for school/sponsor)
- `sendApprovalNotification()` - Simple message when school approves
- `sendApprovalApprovedEmail()` - Detailed message when sponsor approves (includes ceremony dates, times, etc.)

### 3. Google Sheet Structure

**3 Tabs:**

**Tab: Grant Applications** (auto-created)
Columns (auto-created on first submission):
- Application ID
- Submission Date
- Period (Spring/Fall)
- Organization Name
- Address
- Website
- Contact Person
- Title
- Phone
- Fax
- Email
- Org Type
- Incorporated
- Tax ID
- Board of Directors
- Previous Grants
- Project Title
- Project Description
- Location
- Amount Requested
- Start Date
- End Date
- Check Payable To
- Applicant Signature
- Signature Date
- Rotarian Sponsor Name
- Rotarian Sponsor Email
- School Involved (Yes/No)
- School Approval By
- School Contact Email
- School Approved (Yes/No) - updated by doPost approval
- Sponsor Approved (Yes/No) - updated by doPost approval
- Overall Status (Pending School Approval / Pending Sponsor Approval / Fully Approved)

**Tab: Rotarians**
- Column A: Name
- Column B: Email
(User must populate with club members)

**Tab: Settings**
Row 1: Grant Leads | [email(s)]
Row 2: Min Grant | 500
Row 3: Max Grant | 1000
Row 4: Award Ceremony Date | Tuesday, May 19
Row 5: Award Ceremony Time | 8:15 AM
Row 6: Award Ceremony Location | First Street Alehouse
Row 7: Meeting Times | Tuesdays, 8:15-9:30 AM
Row 8: Decision Notification Date | early in the week of May 11
Row 9: Club Name | Rotary Club of Livermore Valley

---

## EMAIL WORKFLOW

### Email 1: Application Received (Immediately)
**To**: Applicant
**Subject**: Grant Application Received: [Project Title]
**Message**: Simple - "Your application is complete and is currently waiting for approval from [School/Sponsor]"

### Email 2: Approval Request (Immediately)
**To**: School (if needed) OR Sponsor
**Subject**: School District Approval Needed / Rotarian Sponsor Approval Needed
**Message**: ALL form details (applicant info + project details) + POST form button
**Button**: Submits form with action=approve, appId, role=School/Sponsor

### Email 3: Status Update (When School Approves)
**To**: Applicant
**Subject**: Application Status Update
**Message**: Simple - "Your application has been approved by the School District and is now awaiting final Sponsor review"

### Email 4: Approval Request to Sponsor (When School Approves)
**To**: Sponsor
**Subject**: Rotarian Sponsor Approval Needed
**Message**: Same as Email 2 (ALL form details)

### Email 5: Approved for Review (When Sponsor Approves)
**To**: Applicant
**Subject**: Application Approved for Review
**Message**: Detailed - includes decision date, award ceremony date/time/location, meeting times, thank you

---

## APPROVAL FLOW (doPost with action=approve)

1. User clicks button in approval email
2. Form POSTs to Apps Script with action=approve, appId, role
3. doPost finds application in sheet by appId
4. **If role == "School"**:
   - Mark column 31 (School Approved) = "Yes"
   - Mark column 33 (Overall Status) = "Pending Sponsor Approval"
   - Send approval email to sponsor
   - Send status email to applicant
5. **If role == "Sponsor"**:
   - Mark column 32 (Sponsor Approved) = "Yes"
   - Mark column 33 (Overall Status) = "Fully Approved"
   - Send approval email to applicant
6. Return: "Approval recorded successfully"

---

## FORM FIELDS & VALIDATION

**Required fields** (marked with red asterisk *):
- Application Period
- Organization Name
- Contact Person
- Phone
- Email
- Address
- Type of Organization
- Board of Directors
- Project Title
- Project Description
- Location
- Amount Requested
- Start Date
- End Date
- Check Payable To
- Applicant Signature
- Signature Date
- Rotarian Sponsor Name
- Rotarian Sponsor Email

**Validation types**:
- email: type="email"
- phone: type="tel"
- dates: type="date"
- amount: type="number" with min/max from Settings
- required: HTML5 required attribute

**Conditional fields**:
- School fields (School Approval By, Contact Email) show only if "school involved" checkbox checked

---

## STYLING & COLORS

**Color Palette**:
- Primary Blue: #003da5
- Accent Yellow: #FFB81C
- Dark Text: #1a1a1a
- Light Text: #666
- Light Background: #f8f9fa
- Border: #e0e0e0

**Design approach**:
- Professional, minimal
- No excessive graphics
- Clean typography
- Proper spacing and alignment
- Rotary branding (logo circle, colors)
- Mobile responsive

---

## DEPLOYMENT

1. Create Google Sheet with 3 tabs (Grant Applications, Rotarians, Settings)
2. Populate Rotarians sheet with club members
3. Fill Settings sheet with your club details
4. Go to Extensions → Apps Script
5. Paste Apps Script code
6. Deploy as Web App (Execute as your email, Anyone access)
7. Copy deployment URL
8. Update HTML: Replace `YOUR_APPS_SCRIPT_URL` (2 places: lines for getRotarians and getGrantLimits fetches)
9. Upload HTML to Netlify (drag & drop)
10. Test: Submit form → check sheet → check emails → test approval link

---

## KEY TECHNICAL NOTES

#### **Critical Implementation Details**
- **Approval emails MUST pass ALL form fields** to sendApprovalEmail (period, orgName, address, website, contactName, contactTitle, phone, fax, email, orgType, incorp, taxId, hasBoard, prevGrants, projectTitle, projectDesc, location, amount, startDate, endDate, payableTo)
- doPost handles BOTH form submission AND approvals (check `e.parameter.action === 'approve'`)
- Approval button uses POST form (not GET link) to avoid Google Drive errors
- **All settings customizable from Settings sheet** (dates, times, amounts, etc.)
- **Email templates hardcoded** in Apps Script (not in sheet)
- **Dynamic data loading** from sheets (Rotarians, grant limits)
- **String comparison with trim()** for appId matching (handles whitespace)

---

## IF SOMETHING BREAKS

Use this exact prompt to rebuild. All code is deterministic and reproducible.

**Files needed**:
1. grant_form_final_complete.html
2. apps_script_final_complete.gs
3. Google Sheet with 3 tabs + Settings

**Common issues**:
- Google Drive error on approval? → Use new deployment URL
- Rotarians not loading? → Check Rotarians sheet has data
- Grant limits not updating? → Check Settings sheet Min/Max cells
- Emails not sending? → Check Apps Script permissions + Gmail enabled
