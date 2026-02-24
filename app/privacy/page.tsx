import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Dosa - Learn how we collect, use, and protect your information when using our AI-powered underwriting tools.",
  alternates: {
    canonical: "https://usedosa.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Dosa",
    description: "Privacy Policy for Dosa - Learn how we collect, use, and protect your information when using our AI-powered underwriting tools.",
    url: "https://usedosa.com/privacy",
  },
}

export default function PrivacyPolicy() {
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
        name: "Privacy Policy",
        item: "https://usedosa.com/privacy",
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
          Privacy Policy
        </h1>
        <p className="text-gray-400 text-sm mb-12">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <p className="mb-6">
              This Privacy Policy explains how DOSA ("the App", "we", "us", or "our") collects, uses, stores, and protects information when you use our services. The App provides tools for automated email review, document analysis, and AI-assisted workflows for business and professional use.
            </p>
            <p>
              By using the App, you agree to the practices described in this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3 mt-4">1.1 Google Account Information</h3>
            <p className="mb-4">
              When you connect your Google account, we may access limited Google user data strictly necessary to provide the App's functionality, including:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>Email message metadata and content</li>
              <li>Email attachments</li>
              <li>Email sender and recipient information</li>
              <li>Gmail account identifiers (e.g. email address)</li>
            </ul>
            <p className="mb-4">
              We access this data only after you explicitly authorize the required Google OAuth scopes.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-4">1.2 Email Content and Attachments</h3>
            <p className="mb-4">
              If you enable email processing features, the App may process:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>Email subject lines and message bodies</li>
              <li>Attachments (e.g. PDFs, spreadsheets, documents)</li>
              <li>Timestamps and message IDs</li>
            </ul>
            <p className="mb-4">
              This data is used solely to:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>Identify relevant emails</li>
              <li>Extract user-requested information</li>
              <li>Assist with automated responses and workflows</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-4">1.3 Uploaded Documents</h3>
            <p className="mb-4">
              For document analysis features, users may upload files such as:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>PDFs</li>
              <li>Word documents</li>
              <li>Spreadsheets (CSV, XLSX)</li>
            </ul>
            <p>
              Uploaded documents are processed to enable search, analysis, and AI-assisted interactions within the App.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-4">1.4 Application Data</h3>
            <p className="mb-4">
              We may collect application-specific data you provide, including:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>Business or company information</li>
              <li>Evaluation criteria and preferences</li>
              <li>Workflow configurations</li>
              <li>Generated reports or outputs</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-4">1.5 Authentication and Usage Data</h3>
            <p className="mb-4">
              We collect limited technical data such as:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>User ID and team/workspace identifiers</li>
              <li>Login timestamps</li>
              <li>Feature usage logs</li>
              <li>Processing status indicators</li>
            </ul>
            <p>
              This data is used for security, auditing, and service reliability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Information</h2>
            <p className="mb-4">
              We use collected information only to:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>Provide and operate the App's features</li>
              <li>Process emails and documents at the user's request</li>
              <li>Generate AI-assisted insights, summaries, or responses</li>
              <li>Validate business information using trusted third-party sources</li>
              <li>Communicate results or required actions to users</li>
              <li>Improve performance, reliability, and security</li>
            </ul>
            <p>
              We do not use Google user data for advertising, profiling, or marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Use of AI and Automated Processing</h2>
            <p className="mb-4">
              The App uses AI systems to:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>Classify emails and documents</li>
              <li>Extract structured information</li>
              <li>Answer questions using document context</li>
              <li>Generate drafts, summaries, or reports</li>
            </ul>
            <p>
              AI processing occurs only in response to user actions and is limited to the scope required to provide requested functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Storage and Retention</h2>
            <p className="mb-4">
              Data is stored securely using industry-standard cloud infrastructure.
            </p>
            <p className="mb-4">
              Email and document data is retained only as long as necessary to provide the service or as configured by the user.
            </p>
            <p className="mb-4">
              Users may delete documents, projects, or connected accounts at any time.
            </p>
            <p>
              Upon account deletion, associated data is permanently removed within a reasonable timeframe unless retention is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Data Sharing and Disclosure</h2>
            <p className="mb-4">
              We do not sell or rent user data.
            </p>
            <p className="mb-4">
              We may share limited data only:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>With trusted service providers acting as data processors (e.g. hosting, authentication, AI processing)</li>
              <li>When required by law or legal process</li>
              <li>To protect the security, integrity, or rights of users or the App</li>
            </ul>
            <p>
              All service providers are contractually obligated to protect data and use it only for authorized purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Google API Data Use Compliance</h2>
            <p className="mb-4">
              Our use of Google user data complies with the Google API Services User Data Policy, including the Limited Use requirements.
            </p>
            <p className="mb-4">
              Specifically:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>Google user data is used only to provide user-facing features</li>
              <li>Data is not transferred to third parties for advertising</li>
              <li>Data is not used to build user profiles beyond the App's functionality</li>
              <li>Human access to Google user data is restricted and logged, and occurs only when necessary for support or security purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Security Measures</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational safeguards, including:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>Encrypted data transmission (HTTPS)</li>
              <li>Secure authentication and access controls</li>
              <li>Restricted internal access to user data</li>
              <li>Monitoring and logging for abuse or unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. User Controls and Rights</h2>
            <p className="mb-4">
              Users may:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              <li>Revoke Google account access at any time via Google Account settings</li>
              <li>Delete uploaded documents and processed data</li>
              <li>Request account deletion and data removal</li>
              <li>Control which features are enabled and what data is processed</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Children's Privacy</h2>
            <p>
              The App is not intended for use by children under the age of 13, and we do not knowingly collect personal data from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be communicated through the App or our website. Continued use of the App after changes indicates acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Information</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or data practices, please contact:
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
