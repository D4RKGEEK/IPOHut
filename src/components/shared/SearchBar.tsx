"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// This will be populated at build time from the metadata
// You'll need to generate this file during the build process
const IPO_DATA: Array<{ slug: string; name: string }> = [];

// Function to load IPO data from a static JSON file
async function loadIPOData() {
    try {
        const response = await fetch('/ipo-metadata.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to load IPO metadata:', error);
        return [];
    }
}

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Array<{ slug: string; name: string; score?: number }>>([]);
    const [allIPOs, setAllIPOs] = useState<Array<{ slug: string; name: string }>>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    // Load IPO data only when dialog opens for the first time
    useEffect(() => {
        if (isOpen && !dataLoaded) {
            setIsLoading(true);
            loadIPOData().then(data => {
                setAllIPOs(data);
                setDataLoaded(true);
                setIsLoading(false);
            });
        }
    }, [isOpen, dataLoaded]);

    // Simple fuzzy search function
    const fuzzySearch = useCallback((searchQuery: string, items: Array<{ slug: string; name: string }>) => {
        if (!searchQuery.trim()) return [];

        const query = searchQuery.toLowerCase();
        const words = query.split(' ').filter(w => w.length > 0);

        return items
            .map(item => {
                const name = item.name.toLowerCase();
                let score = 0;

                // Exact match gets highest score
                if (name === query) score += 100;

                // Starts with query
                if (name.startsWith(query)) score += 50;

                // Contains query
                if (name.includes(query)) score += 25;

                // All words present
                const allWordsPresent = words.every(word => name.includes(word));
                if (allWordsPresent) score += 10;

                // Individual word matches
                words.forEach(word => {
                    if (name.includes(word)) score += 5;
                });

                return { ...item, score };
            })
            .filter(item => item.score && item.score > 0)
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .slice(0, 10);
    }, []);

    // Handle search
    useEffect(() => {
        if (query.trim() && allIPOs.length > 0) {
            const searchResults = fuzzySearch(query, allIPOs);
            setResults(searchResults);
            setSelectedIndex(0);
        } else {
            setResults([]);
        }
    }, [query, allIPOs, fuzzySearch]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd+K or Ctrl+K to open search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }

            // Escape to close
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
                setQuery("");
            }

            // Arrow navigation
            if (isOpen && results.length > 0) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedIndex(prev => (prev + 1) % results.length);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (results[selectedIndex]) {
                        handleSelect(results[selectedIndex]);
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex]);

    // Focus input when dialog opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSelect = (ipo: { slug: string; name: string }) => {
        router.push(`/ipo/${ipo.slug}`);
        setQuery("");
        setIsOpen(false);
    };

    const clearSearch = () => {
        setQuery("");
        setResults([]);
    };

    return (
        <>
            {/* Search Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
                className="h-9 w-9"
                title="Search IPOs (⌘K)"
            >
                <Search className="h-4 w-4" />
            </Button>

            {/* Search Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[600px] p-0 gap-0">
                    <DialogHeader className="px-4 pt-4 pb-3 border-b">
                        <DialogTitle className="text-base">Search IPOs</DialogTitle>
                    </DialogHeader>

                    <div className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                ref={inputRef}
                                type="text"
                                placeholder="Type to search..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-10 pr-10"
                            />
                            {query && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Keyboard Hint */}
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">↑↓</kbd>
                            <span>Navigate</span>
                            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Enter</kbd>
                            <span>Select</span>
                            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Esc</kbd>
                            <span>Close</span>
                        </div>
                    </div>

                    {/* Results */}
                    <ScrollArea className="max-h-[400px]">
                        {isLoading ? (
                            <div className="p-8 text-center text-sm text-muted-foreground">
                                Loading IPO data...
                            </div>
                        ) : results.length > 0 ? (
                            <div className="px-2 pb-4">
                                {results.map((ipo, index) => (
                                    <button
                                        key={ipo.slug}
                                        onClick={() => handleSelect(ipo)}
                                        className={`w-full text-left px-3 py-2.5 rounded-md transition-colors ${index === selectedIndex
                                            ? 'bg-primary/10 text-primary'
                                            : 'hover:bg-muted'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-sm font-medium truncate">{ipo.name}</span>
                                            <Badge variant="outline" className="text-[10px] shrink-0">
                                                IPO
                                            </Badge>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : query ? (
                            <div className="p-8 text-center text-sm text-muted-foreground">
                                No IPOs found for "{query}"
                            </div>
                        ) : (
                            <div className="p-8 text-center text-sm text-muted-foreground">
                                Start typing to search IPOs...
                            </div>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
}
