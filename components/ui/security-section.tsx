import { cn } from "@/lib/utils";

interface CertificationProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function CertificationCard({ title, description, icon }: CertificationProps) {
  return (
    <div className="flex flex-col justify-between p-8 border-l border-white/10 first:border-l-0 min-h-[300px]">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
          {description}
        </p>
      </div>
      <div className="mt-12 text-white/80">
        {icon}
      </div>
    </div>
  );
}

export function SecuritySection() {
  return (
    <section id="security" className="bg-black py-24 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
            <p className="text-xs font-medium tracking-widest text-gray-500 uppercase mb-4">Certified & Compliant</p>
            <h2 className="text-3xl md:text-5xl font-normal text-white max-w-4xl mx-auto leading-tight">
                DOSA is committed to maintaining compliance with the most rigorous international safety and security standards.
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-y border-white/10">
          <CertificationCard
            title="ISO 42001"
            description="ISO 42001 certified, our AI governance framework gives customers confidence in how we build and run AI."
            icon={
                <svg className="w-12 h-12 stroke-[1px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                </svg>
            }
          />
          <CertificationCard
            title="ISO 27001"
            description="DOSA is fully certified with ISO 27001, the internationally recognized standard for information security management."
            icon={
                <svg className="w-12 h-12 stroke-[1px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
            }
          />
          <CertificationCard
            title="SOC Type 2"
            description="We meet SOC 2 requirements to ensure secure and compliant management of data across all our systems."
            icon={
                <svg className="w-12 h-12 stroke-[1px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                </svg>
            }
          />
          <CertificationCard
            title="GDPR"
            description="With our technical team based in Europe, we operate under GDPR — the world's strictest standard for data privacy."
            icon={
                <svg className="w-12 h-12 stroke-[1px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                    <path d="M12 2v20" />
                    <path d="M2 12h20" />
                </svg>
            }
          />
        </div>
      </div>
    </section>
  );
}

