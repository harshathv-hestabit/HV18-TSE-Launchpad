# Reverse Proxy

* Nginx acts as the **Reverse Proxy** .
* Frontend, backend, mongo services run in **separate Docker containers**.
* All containers are attached to the **same Docker bridge network**.
* Only Nginx exposes a port to the host.

```
Browser → Nginx → Frontend (UI)
Browser → Nginx → Backend (API)
```

## Container Networking Model

* No frontend or backend ports are exposed to the host.

| Service  | Port | Exposure |
| -------- | ---- | -------- |
| nginx    | 80   | Exposed  |
| frontend | 5173 | Internal |
| backend  | 3000 | Internal |


## Nginx Role (Before SSL)

Nginx is responsible for:

* Accepting all inbound HTTP traffic
* Routing requests based on URL path
* Forwarding requests to the appropriate internal service

## Upstream Configuration

```
upstream backend_upstream {
    server backend1:3000;
    server backend2:3000;
}
```

* Defines a logical backend group
* Enables Round-robin load balancing by default


## Path‑Based Routing Rules

### Frontend Routing

```
location / {
    proxy_pass http://frontend:5173;
}
```

* Matches all paths
* Serves frontend UI routes

### Backend (API) Routing

```
location /api/ {
    proxy_pass http://backend_upstream;
}
```

* Matches all API calls under `/api/`
* Forwards requests to backend services

## Request Flow Details

### UI Request

```
GET /
Browser → Nginx → Frontend
```

### API Request

```
GET /api/users
Browser → Nginx → Backend Upstream → Backend Container
```

## Development Mode Behavior

* Frontend runs a **Vite dev server** inside its container

```
Browser → Nginx → Frontend (dev server)
Browser → Nginx → Backend
```