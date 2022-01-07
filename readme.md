# `Prismixer`

This package allow you to create multiple Prisma schema files, supporting cross-file and model relations

> Learn more about Prisma: [prisma.io](https://prisma.io)

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

## Relationship Example

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