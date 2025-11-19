"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Edit, Info } from "lucide-react";
import { MarkdownRenderer } from "./markdown-renderer";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function MarkdownEditor({
    value,
    onChange,
    placeholder = "Tulis konten dalam format markdown...",
    className = "",
}: MarkdownEditorProps) {
    const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

    return (
        <div className={className}>
            <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as "edit" | "preview")}
                className="w-full"
            >
                <div className="flex items-center justify-between border-b pb-2 mb-4">
                    <TabsList>
                        <TabsTrigger value="edit" className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="gap-2">
                            <Eye className="h-4 w-4" />
                            Preview
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="edit" className="mt-0">
                    <div className="space-y-4">
                        <Textarea
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            className="min-h-[500px] font-mono text-base resize-y focus-visible:ring-1"
                            rows={20}
                        />

                        {/* Markdown Tips */}
                        <div className="rounded-lg border bg-muted/50 p-4">
                            <div className="flex items-start gap-2 mb-3">
                                <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div className="space-y-2 text-sm">
                                    <p className="font-semibold text-foreground">
                                        Tips Markdown:
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-muted-foreground">
                                        <div>
                                            <code className="bg-background px-1.5 py-0.5 rounded border">
                                                # Heading 1
                                            </code>
                                        </div>
                                        <div>
                                            <code className="bg-background px-1.5 py-0.5 rounded border">
                                                **bold text**
                                            </code>
                                        </div>
                                        <div>
                                            <code className="bg-background px-1.5 py-0.5 rounded border">
                                                ## Heading 2
                                            </code>
                                        </div>
                                        <div>
                                            <code className="bg-background px-1.5 py-0.5 rounded border">
                                                *italic text*
                                            </code>
                                        </div>
                                        <div>
                                            <code className="bg-background px-1.5 py-0.5 rounded border">
                                                ### Heading 3
                                            </code>
                                        </div>
                                        <div>
                                            <code className="bg-background px-1.5 py-0.5 rounded border">
                                                [link](url)
                                            </code>
                                        </div>
                                        <div>
                                            <code className="bg-background px-1.5 py-0.5 rounded border">
                                                - list item
                                            </code>
                                        </div>
                                        <div>
                                            <code className="bg-background px-1.5 py-0.5 rounded border">
                                                `inline code`
                                            </code>
                                        </div>
                                        <div>
                                            <code className="bg-background px-1.5 py-0.5 rounded border">
                                                1. numbered list
                                            </code>
                                        </div>
                                        <div>
                                            <code className="bg-background px-1.5 py-0.5 rounded border">
                                                &gt; blockquote
                                            </code>
                                        </div>
                                        <div className="md:col-span-2">
                                            <code className="bg-background px-1.5 py-0.5 rounded border">
                                                ```code block```
                                            </code>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="preview" className="mt-0">
                    <div className="min-h-[500px] rounded-lg border bg-background p-8">
                        {value.trim() ? (
                            <MarkdownRenderer content={value} />
                        ) : (
                            <div className="flex items-center justify-center min-h-[400px]">
                                <p className="text-muted-foreground text-center">
                                    Tidak ada konten untuk ditampilkan.
                                    <br />
                                    <span className="text-sm">
                                        Tulis sesuatu di tab Edit untuk melihat
                                        preview.
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
