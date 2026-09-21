// Plain data module (NO "use client") so it can be imported by both the
// server component (faq/page.tsx, which builds JSON-LD) and the client
// accordion. Exporting this from the "use client" component made `faqData`
// resolve to undefined inside the RSC page → `faqData.flatMap is not a function`.

export type FAQItem = {
  id: string
  question: string
  answer: string
}

export type FAQCategory = {
  id: string
  title: string
  description?: string
  items: FAQItem[]
}

export const faqData: FAQCategory[] = [
  {
    id: "orders-shipping",
    title: "Orders & Shipping",
    description: "Delivery estimates, tracking, and European & international fulfillment",
    items: [
      {
        id: "delivery-time",
        question: "How long does delivery take?",
        answer:
          "Orders within France and Western Europe typically arrive within 2 to 4 business days. For the rest of the European Union, shipping takes 3 to 6 business days. International deliveries outside Europe generally arrive within 6 to 10 business days via tracked priority airmail.",
      },
      {
        id: "worldwide-shipping",
        question: "Do you ship worldwide?",
        answer:
          "Yes. TamZen ships worldwide with fully tracked door-to-door delivery. Every parcel is insured and packaged in our signature luxury presentation box to ensure pristine arrival anywhere across the globe.",
      },
      {
        id: "shipping-rates",
        question: "How much is shipping?",
        answer:
          "We offer free standard tracked shipping on all orders over €75 across the European Union. For orders below €75, standard tracked delivery is €4.90 within France and €7.90 for other EU member states. International express options are calculated at checkout.",
      },
      {
        id: "tracking-order",
        question: "How can I track my order?",
        answer:
          "As soon as your parcel is dispatched from our atelier, you will receive an email confirmation with your direct tracking number and carrier link. You can also view live tracking updates anytime directly within your TamZen account under the Orders tab.",
      },
    ],
  },
  {
    id: "products-materials",
    title: "Products & Materials",
    description: "The craftsmanship, resilience, and science of marine-grade 316L steel",
    items: [
      {
        id: "what-is-316l",
        question: "What is 316L stainless steel and why do you use it?",
        answer:
          "316L stainless steel is a surgical and marine-grade alloy enriched with 2–3% molybdenum, granting exceptional resistance to oxidation, salt corrosion, and acidic contact. We forge our heritage pendants exclusively in 316L so they withstand decades of daily wear without losing structural integrity or sharp engraving detail.",
      },
      {
        id: "tarnish-fade",
        question: "Will the jewelry tarnish or fade?",
        answer:
          "Never. Unlike silver or brass plated fashion jewelry, genuine 316L stainless steel will never turn green, black, or peel. Our gold-toned pieces utilize state-of-the-art Vacuum PVD (Physical Vapor Deposition) coating, bonding real gold molecules at high temperature for tenfold the durability of standard plating.",
      },
      {
        id: "water-sweat",
        question: "Is it water and sweat resistant?",
        answer:
          "100% waterproof and sweat-resistant. You can wear your TamZen pendant in the shower, during intensive workouts, while swimming in the ocean, or in the sauna without fear of corrosion, dulling, or chemical degradation.",
      },
      {
        id: "hypoallergenic",
        question: "Is it skin-friendly and hypoallergenic?",
        answer:
          "Yes. Our 316L jewelry is completely biocompatible, lead-free, cadmium-free, and compliant with EU REACH nickel-release directives. It is safe for sensitive skin and will not cause rashes, redness, or irritation.",
      },
    ],
  },
  {
    id: "care-maintenance",
    title: "Care & Maintenance",
    description: "Simple guidelines to keep your sacred jewelry gleaming forever",
    items: [
      {
        id: "cleaning",
        question: "How do I clean and care for my pendant and chain?",
        answer:
          "Because 316L steel is naturally resilient, maintenance is effortless. Simply wash with warm water and mild liquid soap, then dry thoroughly with a soft microfiber cloth. For intricate laser-cut engravings, a soft-bristled toothbrush removes any lotion or dust buildup instantly.",
      },
      {
        id: "storage",
        question: "How should I store my jewelry when not in use?",
        answer:
          "When traveling or storing your jewelry, place your pendant inside the velvet TamZen pouch or presentation box provided with your order. Storing chains separately prevents them from knotting or scratching other softer precious metals.",
      },
    ],
  },
  {
    id: "returns-exchanges",
    title: "Returns & Exchanges",
    description: "Hassle-free 30-day guarantee and simple return processes",
    items: [
      {
        id: "return-policy",
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy from the date your package is delivered. Items must be in unworn, brand-new condition and returned in their original TamZen jewelry box with all accompanying certificates and pouches.",
      },
      {
        id: "request-return",
        question: "How do I request a return or exchange?",
        answer:
          "To begin a return or exchange, simply contact our concierge team at contact@tamzen.com or submit a message through our Contact page with your order number. Our team will provide prepaid return documentation and step-by-step instructions within 24 hours.",
      },
      {
        id: "refund-timeline",
        question: "When will I receive my refund?",
        answer:
          "Once your returned piece arrives at our facility and passes inspection (usually within 1–2 business days), your refund will be immediately initiated back to your original payment method. Depending on your bank or credit card provider, funds reflect in 3 to 5 business days.",
      },
    ],
  },
  {
    id: "payments-security",
    title: "Payments & Security",
    description: "Trusted global payment gateways and bank-grade encryption",
    items: [
      {
        id: "payment-methods",
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit and debit cards (Visa, MasterCard, American Express, Cartes Bancaires), Apple Pay, Google Pay, PayPal, and regional European options such as Bancontact and iDEAL where supported.",
      },
      {
        id: "secure-checkout",
        question: "Is checkout secure?",
        answer:
          "Completely secure. All transactions are encrypted via 256-bit SSL encryption and processed through PCI-DSS Level 1 certified gateways (such as Stripe). We never store or have access to your full credit card numbers or banking credentials.",
      },
    ],
  },
]
