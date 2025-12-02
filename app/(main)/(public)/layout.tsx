import { Footer } from "@/components/layout/footer";

/**
 * Public layout - wraps public pages (non-admin) with Footer
 * The Navbar is already rendered in the parent (main) layout
 */
export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            <Footer />
        </>
    );
}
