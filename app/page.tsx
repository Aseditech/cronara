import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { WeekCalendar } from "@/components/WeekCalendar";

export default function Home() {
  return (
    <div className="flex h-screen flex-col bg-zinc-50">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-hidden">
          <WeekCalendar />
        </main>
      </div>
    </div>
  );
}
