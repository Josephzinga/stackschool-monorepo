import { prisma } from '@stackschool/db'

interface UpsertOauthUser {
  provider: 'google' | 'facebook'
  providerAccountId: string
  email: string
  emailVerified: boolean
  displayName: string
  firstname?: string
  lastname?: string
  avatar?: string
  accessToken: string
  refreshToken?: string
}

export async function upsertOauthUser({
  provider,
  providerAccountId,
  email,
  emailVerified,
  displayName,
  firstname,
  lastname,
  avatar,
  accessToken,
  refreshToken,
}: UpsertOauthUser) {
  const existingAccount = await prisma.account.findUnique({
    where: { provider_providerAccountId: { provider, providerAccountId } },
  })

  if (existingAccount) {
    await prisma.account.update({
      where: { id: existingAccount.id },
      data: {
        access_token: accessToken ?? existingAccount.access_token,
        refresh_token: refreshToken ?? existingAccount.refresh_token,
      },
    })

    return existingAccount.userId
  }

  if (email) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    })

    if (existingUser) {
      return
    }
  }

  const safeEmail = email || `${provider}`
}
