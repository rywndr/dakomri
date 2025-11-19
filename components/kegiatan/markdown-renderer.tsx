"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

/**
 * render markdown dengan aman
 * make react-markdown dengan plugin GFM (GitHub Flavored Markdown)
 * sanitize HTML untuk keamanan
 */
export function MarkdownRenderer({
    content,
    className = "",
}: MarkdownRendererProps) {
    return (
        <div className={`prose prose-lg max-w-none ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                    // Styling untuk headings
                    h1: ({ children }) => (
                        <h1 className="text-4xl font-bold mt-8 mb-4 text-foreground">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">
                            {children}
                        </h3>
                    ),
                    h4: ({ children }) => (
                        <h4 className="text-xl font-semibold mt-6 mb-3 text-foreground">
                            {children}
                        </h4>
                    ),
                    h5: ({ children }) => (
                        <h5 className="text-lg font-semibold mt-4 mb-2 text-foreground">
                            {children}
                        </h5>
                    ),
                    h6: ({ children }) => (
                        <h6 className="text-base font-semibold mt-4 mb-2 text-foreground">
                            {children}
                        </h6>
                    ),

                    // Paragraphs
                    p: ({ children }) => (
                        <p className="my-4 leading-relaxed text-foreground/90">
                            {children}
                        </p>
                    ),

                    // Links
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            className="text-primary hover:underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </a>
                    ),

                    // Lists
                    ul: ({ children }) => (
                        <ul className="my-4 ml-6 list-disc space-y-2">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="my-4 ml-6 list-decimal space-y-2">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="leading-relaxed text-foreground/90">
                            {children}
                        </li>
                    ),

                    // Code blocks
                    code: ({
                        inline,
                        className,
                        children,
                        ...props
                    }: {
                        inline?: boolean;
                        className?: string;
                        children?: React.ReactNode;
                        [key: string]: unknown;
                    }) => {
                        if (inline) {
                            return (
                                <code
                                    className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground"
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <code
                                className={`block bg-muted p-4 rounded-lg overflow-x-auto font-mono text-sm ${className || ""}`}
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                    pre: ({ children }) => (
                        <pre className="my-4 bg-muted rounded-lg overflow-hidden">
                            {children}
                        </pre>
                    ),

                    // Blockquotes
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic text-foreground/80 bg-muted/30 rounded-r">
                            {children}
                        </blockquote>
                    ),

                    // Horizontal rule
                    hr: () => <hr className="my-8 border-border" />,

                    // Tables
                    table: ({ children }) => (
                        <div className="my-6 overflow-x-auto">
                            <table className="min-w-full divide-y divide-border">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="bg-muted">{children}</thead>
                    ),
                    tbody: ({ children }) => (
                        <tbody className="divide-y divide-border bg-background">
                            {children}
                        </tbody>
                    ),
                    tr: ({ children }) => <tr>{children}</tr>,
                    th: ({ children }) => (
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="px-4 py-3 text-sm text-foreground/90">
                            {children}
                        </td>
                    ),

                    // Images
                    img: ({ src, alt }) => (
                        <img
                            src={src}
                            alt={alt || ""}
                            className="rounded-lg my-6 w-full"
                            loading="lazy"
                        />
                    ),

                    // Strong/Bold
                    strong: ({ children }) => (
                        <strong className="font-bold text-foreground">
                            {children}
                        </strong>
                    ),

                    // Emphasis/Italic
                    em: ({ children }) => (
                        <em className="italic text-foreground">{children}</em>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
