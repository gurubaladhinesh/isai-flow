# DNS Configuration Instructions for isaiflow.in

To ensure deliverability of transactional emails and improve domain trust, implement the following DNS records.

## 1. SPF (Sender Policy Framework) Record
Add a TXT record for your root domain (`isaiflow.in`):

**Type:** `TXT`
**Host:** `@`
**Value:** `v=spf1 include:_spf.google.com ~all`

*(Note: Replace `include:_spf.google.com` with your actual email provider's SPF if not using Google Workspace).*

## 2. DKIM (DomainKeys Identified Mail)
Generate a DKIM key in your email provider's admin console and add it as a TXT record.
**Type:** `TXT`
**Host:** `google._domainkey` (example)
**Value:** `v=DKIM1; k=rsa; p=MIIB...`

## 3. DMARC (Domain-based Message Authentication, Reporting, and Conformance)
**Type:** `TXT`
**Host:** `_dmarc`
**Value:** `v=DMARC1; p=quarantine; rua=mailto:admin@isaiflow.in`

## 4. Verification Check
After adding these records, verify them using tools like:
- [Google Admin Toolbox Dig](https://toolbox.googleapps.com/apps/dig/)
- [MXToolbox](https://mxtoolbox.com/spf.aspx)
