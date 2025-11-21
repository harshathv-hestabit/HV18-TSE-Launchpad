export default function Footer() {
    return (
        <footer className="border-t bg-white mt-16">
            <div className="container mx-auto px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600">© {new Date().getFullYear()} StartBootstrap. All rights reserved.</div>
                <nav className="flex gap-4 text-sm">
                    <a href="/privacy" className="text-slate-600 hover:text-slate-900">Privacy</a>
                    <a href="/terms" className="text-slate-600 hover:text-slate-900">Terms</a>
                    <a href="/contact" className="text-slate-600 hover:text-slate-900">Contact</a>
                </nav>
            </div>
        </footer>
    );
}