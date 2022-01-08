# `Prismixer`

This package allow you to create multiple Prisma schema files, supporting cross-file and model relations

> Learn more about Prisma: [prisma.io](https://prisma.io)

[![Downloads](https://img.shields.io/npm/dt/prismixer.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/prismixer)
[![Downloads](https://img.shields.io/npm/v/prismixer.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/prismixer)

## Installation

1. Install Prismixer

```
yarn add --dev prismixer
```

2. Create a `prismixer.config.json` file in the root of your project.

```json
{
  "input": ["base.prisma", "./src/modules/**/**.prisma"],
  "output": "prisma/schema.prisma"
}
```

```
The order of your input files effects how overrides are considered
```

## Relation Example

## `base.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = "mysql://..."
}
```

## `account.prisma`
```prisma
model Account {
  id       String @id @default(cuid())
  email    String
  password String

  @@map("accounts")
}
```

## `posts.prisma`
```prisma
model Post {
  id         String @id @default(cuid())
  title      String
  content    String
  account_id String
  account    Account @relation(fields: [account_id], references: [id])

  @@map("posts")
}

model Account {
  id   String @id @default(cuid())
  posts Post[]
}
```

## Native database field Example

## `base.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = "mysql://..."
}
```

## `posts.prisma`
```prisma
# You've to repeat the data source connector to allow you to use native database types
datasource db {
  provider = "mysql"
  url      = "mysql://..."
}

model Post {
  id String @id @default(cuid())
  title String
  content String @db.LongText # Set field as long text type
}
```