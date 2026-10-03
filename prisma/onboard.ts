import 'dotenv/config';
import inquirer from 'inquirer';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma';

// One-time interactive setup for a freshly forked deployment.
// Run manually with `npx tsx prisma/onboard.ts` — never during automated migrate/seed.
async function main() {
  console.log('--- New client onboarding ---\n');

  const answers = await inquirer.prompt([
    { type: 'input', name: 'siteName', message: 'Site name:', default: 'Нерухомість' },
    { type: 'input', name: 'contactPhone', message: 'Contact phone:' },
    { type: 'input', name: 'contactEmail', message: 'Contact email:' },
    { type: 'input', name: 'adminEmail', message: 'Admin login email:' },
    { type: 'password', name: 'adminPassword', message: 'Admin password (min 8 chars):', mask: '*' },
  ]);

  if (answers.adminPassword.length < 8) {
    console.error('Password must be at least 8 characters. Aborting.');
    process.exit(1);
  }

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      siteName: answers.siteName,
      contactPhone: answers.contactPhone,
      contactEmail: answers.contactEmail,
    },
    create: {
      id: 1,
      siteName: answers.siteName,
      contactPhone: answers.contactPhone,
      contactEmail: answers.contactEmail,
    },
  });

  await prisma.user.upsert({
    where: { email: answers.adminEmail },
    update: {},
    create: {
      email: answers.adminEmail,
      passwordHash: await bcrypt.hash(answers.adminPassword, 10),
      role: 'ADMIN',
    },
  });

  console.log('\nDone. Site settings saved, admin user ready.');
  console.log(`Log in at /admin/login with: ${answers.adminEmail}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });