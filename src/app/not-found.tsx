"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Home, TrendingUp, Calendar, AlertCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Redirect to mainboard list as a fallback search destination
            // Ideally we would have a dedicated search page
            router.push(`/mainboard-ipo?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans">
            <Header />

            <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
                    <div className="absolute top-10 left-10 text-9xl font-bold">IPO</div>
                    <div className="absolute bottom-20 right-20 text-9xl font-bold">404</div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-3xl rounded-full" />
                </div>

                <div className="relative z-10 max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">

                    {/* 404 Graphic */}
                    <div className="relative inline-block">
                        <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/10 select-none">
                            404
                        </h1>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground text-sm font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg rotate-[-5deg]">
                            Delisted
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                            Listing Not Found
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto">
                            The page you're looking for seems to have withdrawn its DRHP or never existed in the first place.
                        </p>
                    </div>

                    {/* Interactive Search */}
                    <Card className="max-w-md mx-auto p-4 border-2 border-muted hover:border-primary/50 transition-colors">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search for an IPO..."
                                    className="pl-9 h-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button type="submit" size="sm" className="h-9">
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </form>
                    </Card>

                    {/* Quick Links Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mx-auto max-w-3xl pt-8">
                        <Link href="/" className="group">
                            <QuickLinkCard
                                icon={<Home className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />}
                                title="Market Watch"
                                desc="Return Home"
                            />
                        </Link>
                        <Link href="/mainboard-ipo" className="group">
                            <QuickLinkCard
                                icon={<TrendingUp className="h-5 w-5 text-success group-hover:scale-110 transition-transform" />}
                                title="Active IPOs"
                                desc="Mainboard"
                            />
                        </Link>
                        <Link href="/ipo-calendar" className="group">
                            <QuickLinkCard
                                icon={<Calendar className="h-5 w-5 text-warning group-hover:scale-110 transition-transform" />}
                                title="Calendar"
                                desc="Upcoming Dates"
                            />
                        </Link>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}

function QuickLinkCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex flex-col items-center p-4 rounded-xl bg-card border hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 cursor-pointer h-full">
            <div className="mb-3 p-3 rounded-full bg-background shadow-sm border">
                {icon}
            </div>
            <div className="font-semibold text-sm">{title}</div>
            <div className="text-xs text-muted-foreground mt-1">{desc}</div>
        </div>
    );
}

import { Card } from "@/components/ui/card";
