"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Clock3, HelpCircle, Mail, MapPin, Phone, Send } from "lucide-react";
import Link from "next/link";
import PageHeader from "../_components/PageHeader";

export default function ContactPage() {
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 6000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reset();
    setNotice("Message sent successfully!");
  }

  return (
    <>
      <PageHeader kind="contact" title="Contact Us" subtitle="We'd love to hear from you. Get in touch with our team." />
      <div className="container-main grid gap-8 py-12 lg:grid-cols-[minmax(260px,1fr)_minmax(0,1.7fr)]">
        <aside className="space-y-5">
          <div className="panel p-6">
            <Phone className="text-green-600" />
            <h2 className="mt-3 font-bold">Phone</h2>
            <p className="mt-1 text-sm text-gray-500">Mon–Fri, 8am–6pm</p>
            <a className="mt-3 inline-block text-green-700" href="tel:+18001234567">+1 (800) 123-4567</a>
          </div>
          <div className="panel p-6">
            <Mail className="text-green-600" />
            <h2 className="mt-3 font-bold">Email</h2>
            <a className="mt-3 inline-block text-green-700" href="mailto:support@freshcart.com">support@freshcart.com</a>
          </div>
          <div className="panel p-6">
            <MapPin className="text-green-600" />
            <h2 className="mt-3 font-bold">Office</h2>
            <p className="mt-2 text-sm text-gray-500">123 Commerce Street<br />New York, NY 10001</p>
          </div>
          <div className="panel p-6">
            <Clock3 className="text-green-600" />
            <h2 className="mt-3 font-bold">Business Hours</h2>
            <p className="mt-2 text-sm text-gray-500">
              Monday – Friday: 8am – 6pm<br />Saturday: 9am – 4pm<br />Sunday: Closed
            </p>
          </div>
        </aside>

        <section className="panel p-7">
          <h2 className="text-xl font-bold">Send us a Message</h2>
          <p className="mb-6 mt-2 text-sm text-gray-500">Fill out the form and we&apos;ll get back to you.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            {notice && (
              <div role="status" className="mb-6 flex items-center gap-4 rounded-xl border border-green-100 bg-green-50 p-5 text-green-800">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-green-100 text-green-600">
                  <Check size={24} />
                </span>
                <div>
                  <p className="font-semibold">{notice}</p>
                  <p className="text-sm text-green-600">We&apos;ll get back to you as soon as possible.</p>
                </div>
              </div>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <label>
                <span className="field-label">Full Name</span>
                <input className="field" name="name" placeholder="John Doe" required minLength={2} />
              </label>
              <label>
                <span className="field-label">Email Address</span>
                <input className="field" name="email" type="email" placeholder="john@example.com" required />
              </label>
            </div>
            <label className="block">
              <span className="field-label">Subject</span>
              <select className="field" name="subject" required defaultValue="">
                <option value="" disabled>Choose a subject</option>
                <option>Order question</option>
                <option>Product question</option>
                <option>Shipping and delivery</option>
                <option>Returns and refunds</option>
                <option>Other</option>
              </select>
            </label>
            <label className="block">
              <span className="field-label">Message</span>
              <textarea className="field min-h-40" name="message" required minLength={10} placeholder="How can we help?" />
            </label>
            <button className="btn" type="submit"><Send size={17} /> Send Message</button>
          </form>
          <div className="mt-7 flex items-start gap-3 rounded-xl bg-green-50 p-5">
            <HelpCircle className="shrink-0 text-green-700" />
            <div>
              <h3 className="font-semibold">Looking for quick answers?</h3>
              <p className="mt-1 text-sm text-gray-600">Check our help information about orders, shipping and returns.</p>
              <Link href="/support#help" className="mt-2 inline-block text-green-700">Visit Help Center →</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
