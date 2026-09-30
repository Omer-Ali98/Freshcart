import PageHeader from "../_components/PageHeader";

export default function CookiesPage() {
  return (
    <>
      <PageHeader title="Cookie Policy" subtitle="Cookies and local browser storage" />
      <article className="container-main max-w-4xl! pb-16">
        <div className="panel space-y-6 p-8 text-sm leading-7 text-gray-600">
          <h2 className="text-xl font-bold text-gray-900">Essential cookies</h2>
          <p>Authentication cookies keep your account signed in and allow cart, wishlist and checkout requests to use your session.</p>
          <h2 className="text-lg font-bold text-gray-900">Temporary browser data</h2>
          <p>Password recovery temporarily stores your email in this tab&apos;s session storage and removes it after a successful reset. Product comparison is held in memory for this browsing session.</p>
          <h2 className="text-lg font-bold text-gray-900">Managing cookies</h2>
          <p>You can clear cookies and site data through your browser settings. Doing so signs you out and may reset temporary preferences.</p>
        </div>
      </article>
    </>
  );
}
