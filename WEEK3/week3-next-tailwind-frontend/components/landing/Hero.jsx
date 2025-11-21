import Image from "next/image";
import Link from "next/link";
const heroBlur =
  "data:image/svg+xml;utf8," +
  "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'>" +
  "<rect width='10' height='7' fill='%23e6eef6'/>" +
  "</svg>";

  
export default function Hero() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-12">
        <div className="w-full lg:w-1/2">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-slate-900">
            Ship faster with a tiny, performant UI
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-xl">
            Built with Next.js and Tailwind — optimized images, accessible markup,
            and great performance.
          </p>
          <div className="mt-6 flex gap-4">
            <Link href="#features" className="inline-block px-6 py-3 bg-sky-600 text-white rounded-md shadow hover:bg-sky-700">
              Get started
            </Link>
            <Link href="#reviews" className="inline-block px-6 py-3 border rounded-md text-slate-700">
              Reviews
            </Link>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="relative w-full h-64 sm:h-80 lg:h-96">
            <Image
              src="/images/hero.svg"
              alt="Product interface"
              fill
              className="object-cover rounded-xl shadow-lg"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority
              placeholder="blur"
              blurDataURL={heroBlur}
            />
          </div>
        </div>
      </div>
    </section>
  );
}