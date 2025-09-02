import Footer from '@/components/shared/Footer/Footer';
import Header from '@/components/shared/Header/Header';
import PromoBannerWrapper from '@/components/shared/PromoBannerWrapper';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PromoBannerWrapper banner='OfferBannerAtTop' />
      {/* <MaintenanceBanner /> */}
      {/* <McaMaintenanceBanner /> */}

      <div className='relative flex flex-col'>
        <Header />

        <main className='min-h-screen flex-1'>{children}</main>

        {/* <EWebinarCTAGlobalWrapper /> */}

        <Footer />
      </div>
    </>
  );
}
