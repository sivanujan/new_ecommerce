import { Metadata } from "next"
import NotFoundTemplate from "@modules/common/components/not-found-template"

export const metadata: Metadata = {
  title: "404 - Lost in the Vault | TamZen",
  description: "Even our master jewelers couldn't find this piece. Explore our Tamil heritage jewelry and luxury silk collections at TamZen.",
}

export default async function NotFound() {
  return <NotFoundTemplate countryCode="fr" />
}
