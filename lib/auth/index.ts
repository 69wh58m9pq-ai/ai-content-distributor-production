import { getServerSession } from "next-auth"
import { authOptions } from "../auth"

export { authOptions }

export async function auth() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function requireAuth() {
  const session = await auth()
  if (!session) {
    throw new Error('Authentication required')
  }
  return session
}

export async function requireAdmin() {
  const session = await auth()
  if (!session) {
    throw new Error('Authentication required')
  }
  // 这里可以添加管理员检查逻辑
  return session
}