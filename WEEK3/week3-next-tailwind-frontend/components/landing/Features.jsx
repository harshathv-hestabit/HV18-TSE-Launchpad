import Card from "../ui/Card";

export default function Features() {
    const features = [
        { title: "Fast", desc: "Optimized rendering and images." },
        { title: "Accessible", desc: "Semantic HTML and keyboard-first UI." },
        { title: "Composable", desc: "Small, reusable components." },
        { title: "Deployable", desc: "Works great on Vercel or any host." },
    ];

    return (
        <section id="features" className="py-16">
            <div className="container mx-auto px-6 lg:px-8">
                <h2 className="text-2xl font-semibold mb-6">Features</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((f) => (
                        <Card key={f.title} classProp="p-6 bg-white rounded-xl shadow-sm">
                            <h3 className="font-medium text-lg">{f.title}</h3>
                            <p className="mt-2 text-slate-600">{f.desc}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}