"use client";

import { FileText, Shield, Zap, TrendingUp, Search, Target, Users, BarChart3, Cloud } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

export function GlowingEffectDemo() {
  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<Target className="h-4 w-4" />}
        title="Win probability analysis"
        description="Assess your likelihood of winning before the ITT exists. Bandura analyses competitor positioning, past performance, and market signals to give you months of strategic advantage."
      />
      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<Users className="h-4 w-4" />}
        title="Competitor intelligence"
        description="Know exactly who you're up against before they know you're watching. Bandura builds live competitor matrices covering strengths, weaknesses, and historical win rates across your target pipeline."
      />
      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={<FileText className="h-4 w-4" />}
        title="Full capture plans"
        description="Bandura generates complete capture plans — stakeholder maps, win themes, and strategic recommendations — fully automated and available on every bid, 6–9 months before ITT."
      />
      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        icon={<Cloud className="h-4 w-4" />}
        title="Built for M365 & SharePoint"
        description="No new infrastructure. No migrations. Bandura deploys directly into your existing Microsoft 365 and SharePoint environment so your bid teams work exactly where they already do."
      />
      <GridItem
        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
        icon={<Shield className="h-4 w-4" />}
        title="Institutional knowledge, retained"
        description="When consultants leave, their insight goes with them. Bandura captures and preserves every capture planning decision, making that knowledge available on every future bid."
      />
    </ul>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-white/10 p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] border-white/10 bg-black/50 p-6 shadow-sm shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-white/10 bg-white/5 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-white">
                {title}
              </h3>
              <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-gray-400">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

