import { Metadata } from "next"
import { redirect } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import AccountLayout from "@modules/account/templates/account-layout"
import LoginTemplate, { LOGIN_VIEW } from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Join Us | TamZen Atelier",
  description: "Create your TamZen customer account to enjoy bespoke concierge, acquisition tracking, and exclusive previews.",
}

export default async function RegisterPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const customer = await retrieveCustomer().catch(() => null)

  if (customer) {
    redirect(`/${countryCode}/account`)
  }

  return (
    <AccountLayout customer={null}>
      <LoginTemplate initialView={LOGIN_VIEW.REGISTER} />
    </AccountLayout>
  )
}
