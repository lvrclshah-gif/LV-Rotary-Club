# System Verification Checklist

Run through this after rebuilding to ensure everything works.

## ✅ Code Files Exist
- [ ] grant_form_final_complete.html (800 lines)
- [ ] apps_script_final_complete.gs (492 lines)

## ✅ Apps Script Functions (10 total)
- [ ] `doPost(e)` - Form submission + approval handler
- [ ] `doGet(e)` - Data loading (getRotarians, getGrantLimits)
- [ ] `sendApprovalEmail()` - Email with ALL form details
- [ ] `sendApplicationConfirmation()` - Simple message to applicant
- [ ] `sendApprovalNotification()` - School approval notification
- [ ] `sendApprovalApprovedEmail()` - Sponsor approval notification
- [ ] `getRotarians()` - Load from Rotarians sheet
- [ ] `getGrantLimits()` - Load from Settings sheet
- [ ] `getCustomSettings()` - Load 9 settings (dates, times, location, club name)
- [ ] `getSettingValue()` - Utility function

## ✅ HTML Form Structure (5 Sections)
- [ ] Section 1: Organization Info (with 12 fields)
- [ ] Section 2: Project Details (with 7 fields)
- [ ] Section 3: School District (conditional)
- [ ] Section 4: Rotarian Sponsor (dropdown + custom)
- [ ] Section 5: Signature (typed name + date)

## ✅ Dynamic Loading
- [ ] Rotarians dropdown loads from Rotarians sheet
- [ ] Grant limits (min/max) load from Settings sheet
- [ ] Limits applied to amount field

## ✅ Approval Workflow
- [ ] **Submission**: Form → Apps Script doPost
- [ ] **Email 1**: Confirmation to applicant (simple)
- [ ] **Email 2**: Approval request to School OR Sponsor (with ALL details)
- [ ] **Approval Click**: POST form → Apps Script doPost(action=approve)
- [ ] **School Approval**: Updates sheet → emails Sponsor → notifies Applicant
- [ ] **Sponsor Approval**: Updates sheet → emails Applicant with details

## ✅ Sheet Structure
- [ ] **Grant Applications tab**: 33 columns (auto-created)
  - Column 31: School Approved (Yes/No)
  - Column 32: Sponsor Approved (Yes/No)
  - Column 33: Overall Status
- [ ] **Rotarians tab**: Name (A), Email (B)
- [ ] **Settings tab**: 9 rows with key-value pairs

## ✅ Email Contents

### Email 1: Application Received
- [ ] TO: Applicant
- [ ] Content: Simple message only
- [ ] "Your application is complete and is currently waiting for approval from [School/Sponsor]"

### Email 2: Approval Request
- [ ] TO: School OR Sponsor
- [ ] Content: ALL form details (applicant info + project details)
- [ ] Button: POST form with action=approve

### Email 3: Status Update (School Approves)
- [ ] TO: Applicant
- [ ] Content: Simple message
- [ ] "Your application has been approved by the School District..."

### Email 4: Approval Request (to Sponsor after School approves)
- [ ] TO: Sponsor
- [ ] Content: Same as Email 2 (ALL form details)
- [ ] Button: POST form with action=approve

### Email 5: Approved for Review (Sponsor Approves)
- [ ] TO: Applicant
- [ ] Content: Detailed message with award ceremony dates, times, meeting times
- [ ] Includes decision notification date

## ✅ Critical Details
- [ ] Approval emails pass ALL 22 form fields (not just 4)
- [ ] POST form used for approvals (not GET links)
- [ ] String comparison with `.trim()` for appId matching
- [ ] Settings override defaults in getCustomSettings()
- [ ] Sheet column updates use correct indices (0-indexed)
- [ ] No hardcoded deployment URLs (3 placeholders: YOUR_APPS_SCRIPT_URL)

## ✅ Configuration Required
- [ ] Create Google Sheet with 3 tabs
- [ ] Deploy Apps Script
- [ ] Update HTML with deployment URL (3 places)
- [ ] Populate Rotarians sheet
- [ ] Fill Settings sheet (9 rows)
- [ ] Host HTML on Netlify/GitHub Pages

## 🚨 Known Issues Fixed
- ✅ Fixed: Approval emails now include ALL form fields (was only 4)
- ✅ Fixed: Uses POST form for approvals (avoids Google Drive error)
- ✅ Fixed: String comparison with trim() (handles whitespace in appId)
- ✅ Fixed: Custom settings override defaults properly

## ✅ Test Cases

1. **Submit form without school**
   - [ ] Form submits
   - [ ] Data saved to sheet
   - [ ] Confirmation email to applicant
   - [ ] Approval request to Sponsor (with all details)

2. **Submit form with school**
   - [ ] School fields shown
   - [ ] Approval request to School (with all details)
   - [ ] School clicks approve
   - [ ] Applicant gets notification
   - [ ] Sponsor gets approval request

3. **Sponsor approves**
   - [ ] Sheet updates (Sponsor Approved = Yes, Status = Fully Approved)
   - [ ] Applicant gets detailed approval email

4. **Data accuracy**
   - [ ] All form fields appear in approval emails
   - [ ] All settings (dates, times, location) pull from sheet
   - [ ] Rotarians dropdown populated from sheet

---

If all checkmarks pass ✅, system is built correctly.
If any fail ❌, review REBUILD_PROMPT.md and rebuild.
