#!/bin/bash
set -e

if [ ! -f .env ]; then
  echo -e "\n.env file not found! Aborting."
  exit 1
fi
echo -e "\nBuilding frontend and backend images..."
docker compose -f docker-compose.prod.yaml build --pull
docker container prune -f

echo -e "\nStarting services..."
docker compose -f docker-compose.prod.yaml up -d

echo -e "\nWaiting for services to become healthy..."
sleep 15

docker compose -f docker-compose.prod.yaml ps
echo -e "\nBoss, Week 5 Docker Services are now live!"