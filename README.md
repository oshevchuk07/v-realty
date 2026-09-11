# Framework NextJS
https://nextjs.org/
# Next Auth 
https://next-auth.js.org/

## Seed db:
```
npx tsx prisma/seed.ts
```

## Start
```
yarn start
```

## Generate pass hash
```
node -e "require('bcryptjs').hash(process.argv[1], 10).then(console.log)" "password_string"
```
## Auth sercret
```
npx auth secret
```