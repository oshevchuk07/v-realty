1) compile contract
npx prisma@latest contract emit

2) create plan migration
npx prisma@latest migration plan

3) check migration file and apply migration
npx prisma@latest db migrate


# other commands
1. check migrations - local prod etc
npx prisma@latest migration status

2. logs
npx prisma@latest migration log

3. swithc between migrations
npx prisma@latest db migrate --to <HASN_OR_NAME>

4. deploy
npx prisma@latest db migrate