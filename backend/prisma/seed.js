import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Creating admin account...')

  const hashedPassword = await bcrypt.hash('Givora-Admin-2024@4842!', 12)
  
  const admin = await prisma.user.create({
    data: {
      email: 'FADyAdmin94@gmail.com',
      passwordHash: hashedPassword,
      firstName: 'Fady',
      lastName: 'Admin',
      accountType: 'admin',
      isVerified: true,
      approved: true,
    },
  })

  console.log('✅ Admin created successfully!')
  console.log(`👤 Email: FADyAdmin94@gmail.com`)
  console.log(`🔑 Password: Givora-Admin-2024@4842!`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())