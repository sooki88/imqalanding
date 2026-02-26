import Business from "@/components/Business";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Hero2 from "@/components/Hero2";
import News from "@/components/News";
import Observability2 from "@/components/Observability2";
import Solution from "@/components/Solution";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full overflow-hidden">
      <Hero />
      {/* <Hero2 /> */}
      <Observability2 />
      <Business />
      <Features />
      {/* <News /> */}
      <Solution />
    </main>
  );
}
