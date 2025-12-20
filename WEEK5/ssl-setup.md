# SSL Setup

Used `mkcert` to create certificates for host name 'hv18','localhost','127.0.0.1'

SSL/TLS setup is implemented inside **nginx.conf**.

* Nginx terminates HTTPS connections
* Internal container‑to‑container traffic remains HTTP
* Frontend and backend services are unaware of TLS

This keeps encryption centralized and operationally simple.

## HTTPS Termination Model

```
Browser (HTTPS)
      ↓
Nginx (TLS termination)
      ↓
Frontend / Backend (HTTP, internal)
```

Nginx handles:

* Certificate validation
* Key exchange
* Encryption / decryption

## HTTP → HTTPS Redirection

```
server {
    listen 80;
    server_name hv18;
    return 301 https://$host$request_uri;
}
```

* All incoming HTTP requests are permanently redirected to HTTPS
* Ensures encryption is always enforced

## HTTPS Server Configuration

```
server {
    listen 443 ssl;
    server_name hv18;

    ssl_certificate     /etc/nginx/ssl/hv18+2.pem;
    ssl_certificate_key /etc/nginx/ssl/hv18+2-key.pem;
}
```

This server block handles all secure traffic.

## Certificate Management

* Certificates are mounted into the Nginx container
* Private keys are never exposed to other services

### Files Used

| File       | Purpose                  |
| ---------- | ------------------------ |
| `.pem`     | Public certificate chain |
| `-key.pem` | Private key              |

## Secure Routing

SSL does **not** affect routing behavior.

Request flow remains:

```
Browser → Nginx → Frontend / Backend
```

The only difference is encrypted transport between browser and Nginx.

## Headers Passed Through TLS Termination

```
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
```

These headers ensure:

* Backend receives original client IP
* Hostname consistency across services
* Proper request tracing and logging

## Security Boundary

| Layer              | Security               |
| ------------------ | ---------------------- |
| Browser → Nginx    | HTTPS (TLS encrypted)  |
| Nginx → Containers | HTTP (private network) |

Docker network isolation provides sufficient internal trust boundary.