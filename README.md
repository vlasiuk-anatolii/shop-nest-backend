# 🛍️ Shop Backend API (NestJS + Prisma)

This is the backend part of the **Shop** application, built with **NestJS** and **Prisma**, and deployed via **AWS Elastic Beanstalk**. It features full CI/CD using **AWS CodePipeline**, **CodeBuild**, and PostgreSQL through **Amazon RDS**.

---

## 🔗 Production Endpoint

- **Health Check**:  
  [`http://shop-backend-env.eba-kpsmmad2.eu-north-1.elasticbeanstalk.com/`](http://shop-backend-env.eba-kpsmmad2.eu-north-1.elasticbeanstalk.com/)

---

## ⚙️ Tech Stack

- **Backend Framework**: [NestJS](https://nestjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL (via Amazon RDS)
- **CI/CD**: AWS CodePipeline + CodeBuild
- **Deployment**: AWS Elastic Beanstalk (Node.js Platform)
- **Package Manager**: npm

---

## 🗂️ Project Structure

```
shop-nest-backend/
│
├── dist/                   # Compiled output (after build)
├── node_modules/
├── prisma/                 # Prisma schema, migrations
│   └── schema.prisma
├── public/                 # Static assets (if any)
├── src/                    # NestJS application code
├── test/                   # E2E or unit tests
│
├── .env                    # Environment variables (not committed)
├── .gitignore
├── .prettierrc             # Prettier config
├── buildspec.yaml          # AWS CodeBuild instructions
├── eslint.config.mjs       # ESLint config
├── nest-cli.json
├── package.json
├── package-lock.json
├── Procfile                # Elastic Beanstalk process definition
├── README.md
├── tsconfig.build.json
└── tsconfig.json
```

---

## ☁️ AWS Infrastructure

### 🔹 Elastic Beanstalk

- Node.js environment
- Runs `npm run start:prod` using `Procfile`
- Uses `/` as health check endpoint
- Monitors app health automatically

### 🔹 RDS (PostgreSQL)

- PostgreSQL database instance
- Connected using credentials from `.env`
- Used via Prisma ORM

### 🔹 CodePipeline

- **Source**: GitHub (trigger on push)
- **Build**: CodeBuild using `buildspec.yaml`
- **Deploy**: Elastic Beanstalk deployment

### 🔹 CodeBuild

**buildspec.yaml** sample:

```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 18
    commands:
      - npm install
  build:
    commands:
      - npx prisma generate
      - npm run build
artifacts:
  files:
    - '**/*'
  base-directory: dist
```

---

## 🚀 Deployment Flow

1. Developer pushes code to GitHub
2. CodePipeline is triggered automatically
3. CodeBuild runs `buildspec.yaml`
4. Output is deployed to Elastic Beanstalk

---

## 🧪 Health Check

- **Endpoint**: `GET /`
- **Purpose**: Used by Elastic Beanstalk to check instance health

---

## 🗄️ Prisma Setup

- Prisma schema is located in `prisma/schema.prisma`
- Run migrations with:

```bash
npx prisma migrate deploy
```

- Generate Prisma client:

```bash
npx prisma generate
```

---

## 📄 Procfile (Elastic Beanstalk)

```
web: node node_modules/prisma/build/index.js migrate deploy && npm run start:prod
```

---

## 👤 Author

**Developer**: Anatolii Vlasiuk  
**GitHub**: [vlasiuk-anatolii](https://github.com/vlasiuk-anatolii)

---
