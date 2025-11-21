import Image from "next/image";
import Card from "../ui/Card";

const avatar1Blur = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'><rect width='8' height='8' fill='%23f1f5f9'/></svg>";
const avatar2Blur = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'><rect width='8' height='8' fill='%23f8fafc'/></svg>";

export default function Testimonials() {
  const data = [
    { name: "Alex", quote: "Game changer.", avatar: "/images/avatar-1.svg", blur: avatar1Blur },
    { name: "Sam", quote: "Fast and reliable.", avatar: "/images/avatar-2.svg", blur: avatar2Blur },
  ];

  return (
    <section id="reviews" className="py-16 bg-slate-50">
      <div className="container mx-auto px-6 lg:px-8">
        <h2 className="text-2xl font-semibold mb-6">What people say</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {data.map((t) => (
            <Card key={t.name} classProp="p-6 bg-white rounded-xl shadow">
              <div className="flex items-start gap-4">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={56}
                  height={56}
                  className="rounded-full"
                  placeholder="blur"
                  blurDataURL={t.blur}
                />
                <div>
                  <h3 className="font-medium">{t.name}</h3>
                  <p className="mt-2 text-slate-600">"{t.quote}"</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}