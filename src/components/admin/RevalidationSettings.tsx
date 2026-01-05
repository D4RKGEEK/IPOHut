"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, CheckCircle2, AlertTriangle, Zap, Globe, FileText } from "lucide-react";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const QUICK_PATHS = [
    { label: "Home Page", path: "/", type: "page" },
    { label: "Mainboard IPO List", path: "/mainboard-ipo", type: "page" },
    { label: "SME IPO List", path: "/sme-ipo", type: "page" },
    { label: "Allotment Status", path: "/ipo-allotment-status", type: "page" },
    { label: "GMP Today", path: "/ipo-gmp-today", type: "page" },
    { label: "IPO Calendar", path: "/ipo-calendar", type: "page" },
    { label: "Performance Tracker", path: "/ipo-listing-performance", type: "page" },
];

export function RevalidationSettings() {
    const [isLoading, setIsLoading] = useState(false);
    const [customPath, setCustomPath] = useState("");
    const [pathType, setPathType] = useState<"page" | "layout">("page");

    const handleRevalidate = async (options: { path?: string; type?: "page" | "layout"; revalidateAll?: boolean }) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/revalidate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-revalidation-token": "ipohut-revalidation-token-secure", // Using default dev token, in prod env var should be used
                },
                body: JSON.stringify(options),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(options.revalidateAll ? "Entire site revalidation triggered!" : `Revalidated: ${options.path}`);
            } else {
                toast.error(`Error: ${data.message || "Failed to revalidate"}`);
            }
        } catch (error) {
            toast.error("Failed to connect to revalidation API");
        } finally {
            setIsLoading(false);
        }
    };

    const onCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customPath) return;
        handleRevalidate({ path: customPath, type: pathType });
    };

    return (
        <div className="space-y-6">
            {/* Full Site Revalidation */}
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <Zap className="h-5 w-5" />
                        Full Site Revalidation
                    </CardTitle>
                    <CardDescription>
                        Clears the cache for the entire website. Use this when significant global changes are made (e.g., navigation, footer, global settings).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        className="w-full sm:w-auto gap-2"
                        variant="default"
                        disabled={isLoading}
                        onClick={() => handleRevalidate({ revalidateAll: true })}
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                        {isLoading ? "Revalidating..." : "Revalidate Entire Site"}
                    </Button>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Quick Revalidate
                        </CardTitle>
                        <CardDescription>Instantly refresh common pages</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-2">
                        {QUICK_PATHS.map((item) => (
                            <div key={item.path} className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 transition-colors">
                                <span className="text-sm font-medium">{item.label}</span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={isLoading}
                                    onClick={() => handleRevalidate({ path: item.path, type: item.type as "page" })}
                                >
                                    Refresh
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Custom Path */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Custom Path
                        </CardTitle>
                        <CardDescription>Revalidate any specific URL path</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onCustomSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Path Type</Label>
                                <Select value={pathType} onValueChange={(v: "page" | "layout") => setPathType(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="page">Page (Specific Route)</SelectItem>
                                        <SelectItem value="layout">Layout (Nested Routes)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>URL Path</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="/ipo/example-ipo"
                                        value={customPath}
                                        onChange={(e) => setCustomPath(e.target.value)}
                                    />
                                    <Button type="submit" disabled={!customPath || isLoading}>
                                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Example: <code>/ipo/ola-electric</code> or <code>/tools</code>
                                </p>
                            </div>
                        </form>

                        <div className="mt-6 p-4 rounded-lg bg-warning/10 border border-warning/20">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-warning-foreground">Note on Caching</p>
                                    <p className="text-muted-foreground mt-1">
                                        Revalidation requests are processed by the server. Changes may take a few seconds to propagate to the edge network.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
