import LegalContent from "../_components/LegalContent";
const articles = [{
  title: "Information You Provide",
  lines: ["Account details include the name, email and phone number you enter.", "Delivery addresses and order details are sent to Route's e-commerce service.", "Wishlist and cart actions are associated with your signed-in account."]
}, {
  title: "How Your Information Is Used",
  lines: ["Account data supports sign-in and profile updates.", "Shipping details are included when you submit an order.", "Saved addresses help you complete future checkouts."]
}, {
  title: "Payment Processing",
  lines: ["Online checkout opens the payment provider's secure page.", "FreshCart does not collect card numbers in its own forms."]
}, {
  title: "Service Providers",
  lines: ["This storefront connects to Route's API to provide products, accounts, orders and addresses.", "Online payment is handled by the external checkout provider."]
}, {
  title: "Your Choices",
  lines: ["You can update your profile information and manage saved addresses in your account.", "Contact the service operator for requests about account data held by that service."]
}, {
  title: "Cookies",
  lines: ["An essential session cookie keeps you signed in.", "You can remove site data through your browser, which will sign you out."]
}, {
  title: "Temporary Browser Data",
  lines: ["Password recovery temporarily stores your email in this tab's session storage.", "Product comparison stays in memory during the browsing session."]
}, {
  title: "Contact",
  lines: ["For questions about this storefront, use the contact page or email support@freshcart.com."]
}];
export default function PrivacyPage() {
  return <LegalContent title="Privacy Policy" introTitle="Your Privacy Matters" intro="This policy describes how FreshCart uses account, order and browsing information. Review the service operator's full policy for data requests and retention details." articles={articles} next={{
    href: "/terms",
    label: "View Terms of Service"
  }} />;
}
