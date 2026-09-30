import LegalContent from "../_components/LegalContent";
const articles = [{
  title: "Using the Storefront",
  lines: ["FreshCart provides product browsing, account management and checkout through its connected e-commerce service.", "Product listings and availability come from the service and may change."]
}, {
  title: "Accounts",
  lines: ["An account is required for cart, wishlist, saved addresses and checkout.", "Keep your account credentials private and your profile information current."]
}, {
  title: "Product Information",
  lines: ["Product descriptions, images and prices are supplied by the connected catalog.", "Review your selected item and current price before completing checkout."]
}, {
  title: "Orders and Payments",
  lines: ["Cash orders are submitted to the connected order service.", "Online checkout transfers you to a separate payment provider.", "An order should only be considered placed after the service confirms it."]
}, {
  title: "Shipping",
  lines: ["Enter an accurate phone number, city and delivery address at checkout.", "Confirm delivery availability and any applicable fees with the service operator."]
}, {
  title: "Returns and Refunds",
  lines: ["For a return request, provide your order number and the product concerned.", "Confirm eligibility and refund arrangements with the operator before sending anything back."]
}, {
  title: "Availability",
  lines: ["The catalog and account features depend on the connected service being available.", "Temporary connectivity errors do not confirm that an order was submitted."]
}, {
  title: "Contact Us",
  lines: ["For an account, order or product question, visit the Contact Us page.", "You can also email support@freshcart.com."]
}];
export default function TermsPage() {
  return <LegalContent title="Terms of Service" introTitle="Important Notice" intro="These terms explain how to use FreshCart, manage your account and place orders. Review the service operator's fulfillment conditions before completing checkout." articles={articles} next={{
    href: "/privacy",
    label: "View Privacy Policy"
  }} />;
}
