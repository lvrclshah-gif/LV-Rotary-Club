# Settings Sheet Configuration

Add these rows to your "Settings" tab. **Only key values - no HTML templates needed.**

---

## Required Settings

| Column A | Column B | Notes |
|----------|----------|-------|
| Grant Leads | your.email@example.com | Email of grant leads (receives final approval emails) |
| Min Grant | 500 | Minimum grant amount |
| Max Grant | 1000 | Maximum grant amount |
| Award Ceremony Date | Tuesday, May 19 | Date of award ceremony |
| Award Ceremony Time | 8:15 AM | Time of award ceremony |
| Award Ceremony Location | First Street Alehouse | Where ceremony will be held |
| Meeting Times | Tuesdays, 8:15-9:30 AM | Regular club meeting times |
| Decision Notification Date | early in the week of May 11 | When applicants will hear decision |
| Club Name | Rotary Club of Livermore Valley | Your club's full name |

---

## How Emails Use These Settings

All 4 emails use values from this Settings sheet:

1. **Approval Email** (to School/Sponsor)
   - Uses: Club Name

2. **Confirmation Email** (to applicant)
   - Uses: Club Name, Award Ceremony Date, Award Ceremony Time, Award Ceremony Location, Meeting Times, Decision Notification Date

3. **Status Update Email** (when school approves)
   - Uses: Club Name

4. **Final Approval Email** (when fully approved)
   - Uses: Club Name, Award Ceremony Date, Award Ceremony Time, Award Ceremony Location, Meeting Times, Grant Leads

---

## Example Settings Sheet

```
Row 1: Grant Leads | lvrc.lshah@gmail.com
Row 2: Min Grant | 500
Row 3: Max Grant | 1000
Row 4: Award Ceremony Date | Tuesday, May 19, 2026
Row 5: Award Ceremony Time | 8:15 AM
Row 6: Award Ceremony Location | First Street Alehouse, Livermore
Row 7: Meeting Times | Tuesdays, 7:00-8:30 AM
Row 8: Decision Notification Date | early in the week of May 11
Row 9: Club Name | Rotary Club of Livermore Valley
```

---

## How to Customize

1. Go to your Google Sheet "Settings" tab
2. Add these rows exactly as shown above
3. Change Column B values to match your club's specifics
4. Save the sheet
5. When you redeploy Apps Script, emails will automatically use these values

**No email editing needed!** All emails pull from this sheet. 👍

---

## Important Notes

- **Don't change Column A headers** - Apps Script looks for exact matches
- **Column A must be exact** (spelling, capitalization)
- Emails are hardcoded templates, not customizable - but all key values come from Settings sheet
- If you leave a setting blank, defaults will be used (see defaults in Apps Script)

---

## Defaults (if you leave Settings blank)

- Award Ceremony Date: Tuesday, May 19
- Award Ceremony Time: 8:15 AM
- Award Ceremony Location: First Street Alehouse
- Meeting Times: Tuesdays, 8:15-9:30 AM
- Decision Notification Date: early in the week of May 11
- Club Name: Rotary Club of Livermore Valley
- Min Grant: 500
- Max Grant: 1000
