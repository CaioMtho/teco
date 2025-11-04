'use server'

type ActionState = {
  error?: string
  message?: string
} | null

export async function signup(prevState: ActionState, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/signup`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()

  if (!res.ok) {
    return { error: data.error }
  }

  return { message: data.message }
}
