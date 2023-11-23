# gaolamthuy-api

local dev: `npm run dev`

local test docker: `docker build `

```docker-compose.yml
version: '3'
services:
  db:
    image: postgres
    environment:
      POSTGRES_DB: your_db_name
      POSTGRES_USER: your_username
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"
  adminer:
    image: adminer
    restart: always
    ports:
      - "8080:8080"
```
