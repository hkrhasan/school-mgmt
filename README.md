# School Management API

Node.js API for managing schools with proximity sorting using Express, Prisma, MySQL, Docker, and Nginx.

## Features
- Add new schools with geo-coordinates
- List schools sorted by proximity

## Prerequisites
- Docker 20.10+
- Postman (for testing)

## Setup
1. Clone repository:
```bash
git clone https://github.com/hkrhasan/school-mgmt.git
cd school-mgmt
```

2. Create .env file
```bash
cp .env.example .env
```

3. Start API
```bash
docker-compose up --build -d
```
