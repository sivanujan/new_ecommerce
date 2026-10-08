import { Metadata } from "next"
import { redirect } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import AccountLayout from "@modules/account/templates/account-layout"
import LoginTemplate, { LOGIN_VIEW } from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Sign In | TamZen Atelier",
  description: "Sign in to your TamZen customer account to view your acquisitions, saved addresses, and profile.",
}

export default async function LoginPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const customer = await retrieveCustomer().catch(() => null)

  if (customer) {
    redirect(`/${countryCode}/account`)
  }

  return (
    <AccountLayout customer={null}>
      <LoginTemplate initialView={LOGIN_VIEW.SIGN_IN} />
    </AccountLayout>
  )
}
