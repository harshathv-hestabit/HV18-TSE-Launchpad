# DEPLOYMENT NOTES
## 1. Project Overview
* Background job queue using **BullMQ**
* Worker process for email jobs
* Structured logging using **Winston**
* Request tracing using `X-Request-ID`
* API documentation using **Swagger**
* Production process management using **PM2**
* Deploy-ready `prod/` folder containing `ecosystem.config.js`, `.env`, logs, and build artifacts if required
---
### Notes
* In production, **only .env inside `prod/` is used**.
* Since PM2 runs files from `/src`, the `.env` must be manually pointed to using `dotenv.config({ path: '/prod/.env.prod' })`.

In `src/app.js` (or entry file), load env from prod folder:

## 2. Folder Structure
Production runtime uses **src/** — not prod/src.
```
project/
│
├── prod/
│   ├── .env
│   ├── ecosystem.config.js
│   └── logs/             ← PM2 / Winston logs (prod only)
```
---

## 3. PM2 Configuration
**prod/ecosystem.config.js**

### Important Notes
* Both server and worker run separately under PM2.
* Worker must be **required directly** (not behind lazy functions) because PM2 forks processes.
* Environment values **do not inherit `.env` automatically** → dotenv must load it.
---

## 4. Deployment Steps
### Step 1 — Install dependencies
```
npm install
```
### Step 2 — Build or prepare prod folder
### Step 3 — Create prod/.env
### Step 4 — Start PM2
```
cd prod
pm2 start ecosystem.config.js
```
### Step 5 — View logs
```
pm2 logs server
or
pm2 monit
```
### Step 6 — Test endpoints
```
GET  /test
GET  /test-email
GET  /product
POST /product
```
### Step 7 — Test background jobs
---