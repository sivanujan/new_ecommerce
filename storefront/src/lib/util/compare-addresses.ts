import { isEqual, pick } from "lodash"

export default function compareAddresses(address1: any, address2: any) {
  if (!address1 || !address2) {
    return false
  }

  const fields = [
    "first_name",
    "last_name",
    "address_1",
    "company",
    "postal_code",
    "city",
    "country_code",
    "province",
    "phone",
  ]

  return fields.every((field) => {
    const val1 =
      address1[field] == null ? "" : String(address1[field]).trim().toLowerCase()
    const val2 =
      address2[field] == null ? "" : String(address2[field]).trim().toLowerCase()
    return val1 === val2
  })
}
