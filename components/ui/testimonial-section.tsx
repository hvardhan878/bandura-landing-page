import Image from "next/image";
import { Button } from "@/components/ui/button";

export function TestimonialSection() {
  return (
    <section className="bg-black text-white w-full overflow-hidden border-t border-white/10">
      <div className="grid lg:grid-cols-2 min-h-[600px]">
        {/* Left Content */}
        <div className="p-12 lg:p-24 flex flex-col justify-center">
            <div className="mb-12">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M10 20H0V0H20V20H10V40H0V20ZM30 20H20V0H40V20H30V40H20V20Z" fill="currentColor"/>
                </svg>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-normal leading-tight mb-16 max-w-2xl text-white tracking-tight">
                "Today as much as 80% of our people are active users, and as high as 30% use DOSA more than ten times a day."
            </h2>

            <div className="mt-auto">
                <p className="font-semibold text-lg text-white">Sarah Chen</p>
                <p className="text-gray-400">Chief Underwriting Officer at Apex Capital</p>
            </div>
        </div>

        {/* Right Image */}
        <div className="relative h-[500px] lg:h-auto bg-gray-900">
             <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2000&auto=format&fit=crop"
                alt="Professional in a suit"
                fill
                className="object-cover opacity-80"
            />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                    size="icon" 
                    className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 transition-all duration-300 group"
                >
                    <svg className="w-8 h-8 text-white fill-white ml-1 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </Button>
            </div>

            {/* Bottom text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                 <p className="text-gray-300 text-sm max-w-xl">
                    Our collaboration with Apex Capital demonstrates how a unified culture, world-class underwriting expertise, and cutting-edge AI can work together to shape the future of risk assessment.
                 </p>
            </div>
        </div>
      </div>
    </section>
  );
}

