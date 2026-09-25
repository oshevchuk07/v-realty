## Start

```
yarn start
```

# Create migration without deploy
```
yarn prisma migrate dev --create-only --name add_feature_name
```
check migration file and them:
```
yarn prisma migrate dev
```

# migration status
```
yarn prisma migrate status
```

# Seed db
```
npx tsx prisma/seed.ts
```

## Generate pass hash

```
node -e "require('bcryptjs').hash(process.argv[1], 10).then(console.log)" "password_string"
```

## Auth sercret

```
npx auth secret
```
