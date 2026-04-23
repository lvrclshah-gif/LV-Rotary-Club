# Rotary Grant Application - Complete Setup Guide

**Status:** Production Ready | All fields from PDF included | Sequential approval workflow

---

## PREREQUISITES

1. **Google Account:** lvrc.lshah@gmail.com
2. **Google Sheet:** Create new sheet (name it: `Rotary Grants V2`)
3. **Netlify Account:** Free tier (drag & drop hosting)

---

## STEP 1: Create Google Sheet Structure

### Create 3 Tabs:

#### Tab 1: `Grant Applications` (auto-created by Apps Script)
Leave empty. Headers will be added automatically when first application submitted.

#### Tab 2: `Rotarians`
| Column A | Column B |
|----------|----------|
| Name | Email |
| John Doe | john@example.com |
| Jane Smith | jane@example.com |
| (add more Rotarians) | |

#### Tab 3: `Settings`
| Column A | Column B |
|----------|----------|
| Grant Leads | (your email OR name1, name2) |
| Min Grant | 500 |
| Max Grant | 1000 |

**Copy your Google Sheet URL. You'll need the Sheet ID later.**

---

## STEP 2: Deploy Apps Script Backend

### In Your Google Sheet:

1. Go to **Extensions** → **Apps Script**
2. **Delete** the default code
3. **Paste ALL code** from `apps_script_final_complete.gs`
4. Click **Save** (Cmd+S)

### Deploy as Web App:

1. Click **Deploy** (top right)
2. Click **+ New Deployment**
3. Click gear icon → Select **Web app**
4. Set:
   - **Execute as:** lvrc.lshah@gmail.com
   - **Who has access:** Anyone
5. Click **Deploy**
6. **COPY the URL shown** (looks like: `https://script.google.com/macros/s/ABC123.../exec`)

⚠️ **IMPORTANT:** Save this URL for Step 3.

---

## STEP 3: Update HTML Form

### Open `grant_form_final_complete.html` in text editor:

1. Find this line (near bottom, inside `<script>` tag):
   ```javascript
   const response = await fetch('YOUR_APPS_SCRIPT_URL', {
   ```

2. Replace `YOUR_APPS_SCRIPT_URL` with the URL from Step 2:
   ```javascript
   const response = await fetch('https://script.google.com/macros/s/ABC123.../exec', {
   ```

3. **Save the file**

---

## STEP 4: Populate Rotarian Dropdown (Optional)

The form currently has a placeholder dropdown. To make it dynamic:

1. In the HTML, find this section (around line 750):
   ```javascript
   async function loadRotarians() {
       try {
           // This will be populated from your Google Sheet
           // For now, showing placeholder - will be dynamic in production
           const rotarians = [
               { name: 'John Doe', email: 'john@example.com' },
               { name: 'Jane Smith', email: 'jane@example.com' }
           ];
   ```

2. You can manually add Rotarians from your "Rotarians" sheet here, OR leave it as-is and users can type custom entries.

3. **Save**

---

## STEP 5: Upload to Netlify

### Option A: Drag & Drop (Easiest)

1. Go to [netlify.com](https://netlify.com) (sign up free if needed)
2. **Drag the `grant_form_final_complete.html` file** onto the Netlify drop zone
3. Wait ~10 seconds
4. Copy your **public URL** (e.g., `https://peaceful-dragon-abc123.netlify.app`)
5. **Done!** Share this URL with applicants

### Option B: GitHub Pages

1. Create GitHub repo
2. Upload `grant_form_final_complete.html`
3. Enable Pages in repo Settings
4. Get your GitHub Pages URL

---

## STEP 6: TEST THE ENTIRE WORKFLOW

### Test Form Submission:

1. Open your Netlify form URL
2. **Fill out completely:**
   - Period: Spring
   - Organization: Test Org
   - Contact: Test Person (email@example.com)
   - All required fields
   - **School District:** Check this box (to test both workflows)
   - Rotarian: Either select from dropdown OR type custom name/email
   - Signature: Your name
   - Date: Today

3. Click **Submit**

### Expected Results:

✓ **Form Success Message:** "Application submitted successfully!"

✓ **Check Google Sheet:** 
   - Go to "Grant Applications" tab
   - New row should appear with all your data
   - Status should be "Pending School Approval"

✓ **Check Emails:**
   - **School Administrator** receives: "School District Approval Needed" email with "REVIEW & APPROVE" link
   - **Applicant** receives: Confirmation email
   - Both have the clickable approval link

### Test Approval Workflow:

1. **School Administrator clicks approval link** in their email
2. You'll see: "Success! Approval Recorded" page
3. **Check Google Sheet:** 
   - School Approved column = "Yes"
   - Status = "Pending Sponsor Approval"

4. **Rotarian Sponsor receives email** with approval link
5. **Sponsor clicks link**
6. **Check Google Sheet:**
   - Sponsor Approved column = "Yes"
   - Status = "Fully Approved"

7. **Final notification emails sent to:**
   - Applicant
   - School Rep
   - Sponsor
   - Grant Leads (from Settings)

---

## IMPORTANT NOTES

### Column References:
The Apps Script uses specific column numbers. If you change the column order in "Grant Applications," the approval workflow will break. **Do not rearrange columns.**

### Email Addresses:
- Make sure "Rotarians" sheet has correct emails
- Make sure "Settings" sheet has Grant Leads emails
- Test emails go to YOUR account first (lvrc.lshah@gmail.com can be bcc'd)

### Grant Amount Limits:
Currently set to $500-$1000. To change:
1. Edit Settings sheet (Min Grant / Max Grant)
2. Edit HTML form `<input type="number" ... min="500" max="1000">`

### Meeting Info:
Currently hardcoded as "Tuesdays 7-8:30am" and "First Street Alehouse on May 19". Edit email templates in Apps Script if needed.

---

## TROUBLESHOOTING

### "404 Error" When Submitting:
- ✓ Check Apps Script URL is correct in HTML
- ✓ Check deployment is still active (Deploy → Manage Deployments)
- ✓ Clear browser cache (Cmd+Shift+R)

### No emails received:
- ✓ Check Gmail spam folder
- ✓ Check Apps Script Execution log for errors
- ✓ Check email addresses in form are correct

### Data not appearing in Sheet:
- ✓ Check "Grant Applications" tab exists
- ✓ Check Apps Script execution log (Extensions → Apps Script → Executions)
- ✓ Clear browser cache and try again

### Approval link doesn't work:
- ✓ Link is time-sensitive. Try within 24 hours
- ✓ Make sure you're logged into Google account
- ✓ Copy full link from email (don't cut off any characters)

---

## SHARING THE FORM

Once tested, share the Netlify URL with applicants:

```
Forms Due: Last Friday in April (Spring) or October (Fall)

Apply here: [YOUR_NETLIFY_URL]

Questions? Contact: [YOUR_EMAIL]
```

---

## NEXT STEPS (OPTIONAL)

- **Dynamic Rotarian Dropdown:** Update `loadRotarians()` function to fetch from "Rotarians" sheet
- **Custom Email Templates:** Edit `sendApprovalEmail()` functions in Apps Script
- **Custom Approval Form:** Replace email links with Google Form approval
- **Dashboard:** Create summary sheet showing application status in real-time

---

**Need help? Check the Apps Script Execution log for detailed error messages.**

Good luck! 🎉
