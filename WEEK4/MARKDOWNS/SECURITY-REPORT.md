# SECURITY REPORT

## 1. Learning Outcomes Achieved
- **Secure & sanitize APIs**  
- **Request validation using Joi**  
- **Rate limiting with express-rate-limit**  
- **Input sanitization to prevent NoSQL injection, XSS, and parameter pollution**  
---

## 2. Security Measures Implemented

### 2.1 Input Validation
- **User and Product payloads** validated with **Joi** schemas.
- Ensures:
  - Required fields are present
  - Data types are correct
  - Field-specific constraints (e.g., `price >= 0`, `password minlength 6`)
- Invalid payloads are rejected with **HTTP 400**.

### 2.2 API Security Middlewares
- **Helmet**: Adds common security headers (XSS protection, HSTS, etc.)  
- **CORS**: Configured to allow only `http://localhost:3001`  
- **express-rate-limit**: Limits number of requests per IP per timeframe  
- **express.json()** with payload size limit to prevent large body attacks  

### 2.3 Input Sanitization
- **express-mongo-sanitize**: Prevents `$` and `.` operators in request payloads (NoSQL Injection)  
- Prevents parameter pollution and XSS by sanitizing query and body inputs  
---

## 3. Routes Secured
| Route                  | Method | Security/Validation Applied |
|------------------------|--------|-----------------------------|
| /users                 | POST   | Joi validation, rate limiting, helmet, CORS, payload size |
| /products              | POST   | Joi validation, rate limiting, helmet, CORS, payload size |
| All other API endpoints | All    | helmet, rate limiting, CORS, payload size |
---

## 4. Manual Test Cases
### 4.1 Validation Tests (Joi)
| Test Case | Input | Expected Result | Actual Result |
|-----------|-------|----------------|---------------|
| Invalid Product price | `{ price: -10 }` | 400 Bad Request | 400 Bad Request |
---

### 4.2 Rate Limiting Tests
- Send 10 requests to  `/products`  
- **Expected:** 429 Too Many Requests  
- **Result:** Rate limit enforced  
---

### 4.3 CORS Policy Tests
- Allowed origin: `http://localhost:3001` → **200 OK**  
- Disallowed origin: `http://localhost:9999` → **Blocked** 
- **Result:** CORS enforced  
---

### 4.4 Helmet Security Headers
- Verified headers:
  - `X-DNS-Prefetch-Control`  
  - `X-Frame-Options`  
  - `X-download-options`  
  - `X-Content-Type-Options`  
  - `referrer-policy`
- **Result:** All headers applied  
---

### 4.5 Payload Size Limit
- Tested with body > 1MB  
- **Expected:** 413 Payload Too Large  
- **Result:** Blocked  
---

### 4.6 Input Sanitization / NoSQL Injection
| Test Case | Input | Expected Result | Actual Result |
|-----------|-------|----------------|---------------|
| MongoDB operator injection | `{ "$gt": "" }` in body | 400 Bad Request / sanitized | Blocked |
| XSS attempt | `<script>alert(1)</script>` in string field | 400 Bad Request / sanitized | Blocked |
| Parameter pollution | Duplicate query params | Only first used / sanitized | Blocked |
---

## 5. Tools Used
- **Joi**: Request payload validation  
- **express-rate-limit**: Request throttling  
- **Helmet**: Security headers  
- **CORS**: Cross-Origin protection  
- **express-mongo-sanitize**: NoSQL injection prevention  
- **Supertest + Jest**: Manual and automated test execution  
---