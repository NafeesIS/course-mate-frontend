import { AnimatedDiv } from './AnimatedDiv';
import SearchBarWithPopularSearch from './SearchBarWithPopularSearch';

const DocsHero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className='relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      <AnimatedDiv
        className='wrapper relative mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        // whileHover={{ scale: 1.01 }}
        // transition={{ duration: 0.2 }}
      >
        {/* Main heading with animated elements */}
        <AnimatedDiv className='text-center' variants={itemVariants}>
          <AnimatedDiv
            className='mb-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl md:mb-5 md:text-4xl lg:text-5xl'
            variants={itemVariants}
          >
            <h1>
              {' '}
              <span className='block sm:inline'>Welcome To </span>
              <span className='relative inline-block'>
                <span className='bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                  Filesure
                </span>
                <span className='absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 sm:h-1'></span>
              </span>
              <span className='block sm:inline'> Documentation</span>
            </h1>
          </AnimatedDiv>

          <AnimatedDiv
            className='mx-auto max-w-3xl text-xs leading-relaxed text-slate-600 md:text-lg'
            variants={itemVariants}
          >
            <p>
              {' '}
              Discover insights, tutorials, and expert guidance to help you
              navigate compliance, taxation, and financial management with
              confidence.
            </p>
          </AnimatedDiv>
        </AnimatedDiv>

        {/* Enhanced Search Section */}
        <AnimatedDiv className='mt-5 md:mt-6' variants={itemVariants}>
          <SearchBarWithPopularSearch />
        </AnimatedDiv>
      </AnimatedDiv>
    </div>
  );
};

export default DocsHero;
