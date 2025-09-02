/* eslint-disable indent */
import HeroWrapper from '../../../../components/shared/HeroWrapper';
import SearchBar from '../../../../components/shared/SearchBar/SearchBar';
import TypewriterEffect from '../../../../components/shared/TypewriterEffect';
import RecentSearches from './RecentSearches';

const Hero = () => {
  return (
    <HeroWrapper className='pb-8 pt-32 md:pb-16 md:pt-36 lg:pt-40 xl:pt-44'>
      <>
        {/* HEADLINE */}
        <div>
          <h1 className='text-left text-3xl font-bold leading-snug text-gray-100 lg:text-4xl xl:text-5xl'>
            Get insights about <br className='sm:hidden' /> Indian{' '}
            <TypewriterEffect
              words={['Companies', 'Directors']}
              className='font-extrabold text-primary'
              cursorClassName='text-primary text-2xl md:text-3xl lg:text-5xl font-medium'
            />
          </h1>
        </div>

        {/* SEARCH BAR */}
        <SearchBar className='mt-10 md:mt-14' />

        {/* LATEST SEARCHES */}
        <RecentSearches className='mt-8 md:mt-12' />

        {/* SUBHEAD */}
        <h2 className='mx-auto mt-8 max-w-4xl text-center text-base font-medium tracking-wide text-gray-200 md:mt-12 md:text-lg'>
          Check out profiles of over 3M+ companies and 5M+ directors. Discover
          additional information about company financials, compliances, director
          details, GST, and more…
        </h2>

        {/* ANALYTICS / LINKS */}
        {/* <FilteredLinks className='mt-8 md:mt-12' /> */}
      </>
    </HeroWrapper>
  );
};

export default Hero;
