## **Day 1 Task records**

1. Created a node simple server to send a response on port 3000
2. Used Docker init to create the dockerfile and compose.yaml and additional files(.dockerignore and a docker.readme.md).
3. Built the container image using the command: "docker build -t node-express-server . "
4. running the container using the command: "docker run -p 3000:3000 node-express-server"
5. used docker exec -it wonderful_golick /bin/sh to create a shell pointing to the app inside docker terminal

## **Day 2 Task records**

1. Revised the project structure from earlier and separated files into two directories - Backend (node+express) and Frontend (react+vite)
2. Created separate dockerfiles for backend and frontend, and created a unified docker compose file listing frontend, backend and mongo as services and created a bridge type network.
3. Created multi-container app from docker compose and checked logs to determine if everything was working perfectly.