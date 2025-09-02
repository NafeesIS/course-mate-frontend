import Hero from '@/app/(root)/search/_components/Hero';

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Hero />
      {children}

      {/* <GoogleAdUnit>
        <AdsBanner />
      </GoogleAdUnit> */}
    </div>
  );
}
