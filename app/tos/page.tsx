import { Button } from "@/components/ui/button"
import { LiquidButton } from "@/components/ui/liquid-glass-button"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Dosa - Read our terms and conditions for using our AI-powered underwriting platform.",
  alternates: {
    canonical: "https://usedosa.com/tos",
  },
  openGraph: {
    title: "Terms of Service | Dosa",
    description: "Terms of Service for Dosa - Read our terms and conditions for using our AI-powered underwriting platform.",
    url: "https://usedosa.com/tos",
  },
}

export default function TermsOfService() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://usedosa.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Terms of Service",
        item: "https://usedosa.com/tos",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-gray-400 text-sm mb-12">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <p className="mb-4">
              These Terms of Service ("Terms") govern your access to and use of DOSA (the "App", "Service", "we", "us", or "our"). The App provides tools for email review, document analysis, and AI-assisted workflows for professional and business use.
            </p>
            <p>
              By accessing or using the App, you agree to be bound by these Terms. If you do not agree, you must not use the App.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Eligibility and Account Registration</h2>
            <p className="mb-4">
              You must be legally able to enter into a binding agreement to use the App.
            </p>
            <p className="mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring that any information you provide is accurate and up to date</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Description of the Service</h2>
            <p className="mb-4">
              The App enables users to:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>Connect email accounts to review, process, and respond to messages</li>
              <li>Upload and analyze documents using AI-assisted tools</li>
              <li>Extract structured data, generate summaries, and produce reports</li>
              <li>Manage projects, workflows, and team-based access</li>
            </ul>
            <p>
              The Service operates based on user configuration and authorization and does not act independently without user initiation or consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Google Account and Third-Party Integrations</h2>
            <p className="mb-4">
              If you connect your Google account:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>You authorize the App to access Google data strictly within the scopes you approve</li>
              <li>Access is used solely to provide the Service's features</li>
              <li>You may revoke access at any time via your Google Account settings</li>
            </ul>
            <p>
              The App's use of Google user data complies with the Google API Services User Data Policy, including the Limited Use requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. User Responsibilities</h2>
            <p className="mb-4">
              You agree that you will not:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>Use the App for unlawful, deceptive, or fraudulent purposes</li>
              <li>Upload content you do not have the right to use or process</li>
              <li>Interfere with or disrupt the App's security or infrastructure</li>
              <li>Attempt to reverse engineer or misuse the Service</li>
            </ul>
            <p>
              You are solely responsible for ensuring that your use of the App complies with applicable laws, regulations, and contractual obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. User Content</h2>
            <p className="mb-4">
              You retain ownership of all content you upload or process through the App, including:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>Emails and attachments</li>
              <li>Uploaded documents</li>
              <li>Generated outputs and reports</li>
            </ul>
            <p className="mb-4">
              By using the App, you grant us a limited, non-exclusive license to process your content solely to provide the Service.
            </p>
            <p>
              We do not claim ownership over your content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. AI-Generated Outputs</h2>
            <p className="mb-4">
              The App uses automated systems and artificial intelligence to generate outputs.
            </p>
            <p className="mb-4">
              You acknowledge that:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>AI-generated content may contain errors or omissions</li>
              <li>Outputs are provided for informational and operational assistance only</li>
              <li>You are responsible for reviewing and validating all outputs before use</li>
            </ul>
            <p>
              The App does not provide legal, financial, or professional advice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Data Storage and Security</h2>
            <p className="mb-4">
              We implement reasonable technical and organizational measures to protect your data.
            </p>
            <p className="mb-4">
              However, you acknowledge that:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>No system can guarantee absolute security</li>
              <li>You use the Service at your own risk</li>
              <li>Data retention and deletion are governed by our Privacy Policy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Subscription, Fees, and Availability (If Applicable)</h2>
            <p className="mb-4">
              Some features may require payment or be subject to usage limits.
            </p>
            <p className="mb-4">
              We reserve the right to:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>Modify or discontinue features</li>
              <li>Change pricing with reasonable notice</li>
              <li>Impose limits to prevent abuse or ensure service stability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Termination</h2>
            <p className="mb-4">
              You may stop using the App at any time.
            </p>
            <p className="mb-4">
              We may suspend or terminate access if:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>You violate these Terms</li>
              <li>Your use poses security or legal risks</li>
              <li>Required by law or regulatory obligations</li>
            </ul>
            <p>
              Upon termination, access to the Service will cease, and data handling will follow the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Disclaimers</h2>
            <p className="mb-4">
              The Service is provided "as is" and "as available."
            </p>
            <p className="mb-4">
              We disclaim all warranties, including:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>Merchantability</li>
              <li>Fitness for a particular purpose</li>
              <li>Accuracy or reliability of outputs</li>
            </ul>
            <p>
              We do not guarantee uninterrupted or error-free operation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>We are not liable for indirect, incidental, or consequential damages</li>
              <li>We are not responsible for losses resulting from reliance on AI-generated outputs</li>
              <li>Our total liability will not exceed the amount paid for the Service in the prior 12 months (if applicable)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">12. Indemnification</h2>
            <p className="mb-4">
              You agree to indemnify and hold us harmless from claims arising out of:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>Your use of the App</li>
              <li>Content you upload or process</li>
              <li>Violation of these Terms or applicable laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">13. Changes to the Terms</h2>
            <p className="mb-4">
              We may update these Terms from time to time.
            </p>
            <p>
              Material changes will be communicated through the App or website. Continued use of the App constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">14. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of England, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">15. Contact Information</h2>
            <p className="mb-4">
              For questions regarding these Terms, contact:
            </p>
            <ul className="list-none space-y-2 ml-4">
              <li>Email: <a href="mailto:hello@usedosa.com" className="text-white hover:text-purple-300 underline">hello@usedosa.com</a></li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}

