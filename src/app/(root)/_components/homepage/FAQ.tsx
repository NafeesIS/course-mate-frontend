import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqData } from '@/constants/faqData';
import Image from 'next/image';
const FAQ = () => {
  const { content } = faqData;
  return (
    // <section id='faq' className='wrapper mt-8 h-auto'>
    <section id='faq' className='wrapper mt-20 h-auto'>
      <h2 className='section-title'>
        All You Need To Know{' '}
        <span className='block text-primary md:inline'>About FileSure</span>
      </h2>

      <div className='my-8 flex w-full flex-col items-center justify-center gap-8 md:my-16 md:flex-row md:items-start md:gap-12 md:divide-x'>
        <div className=''>
          <Image
            src={faqData.imageSrc}
            alt={faqData.title}
            width={400}
            height={400}
            className='h-full max-h-[300px] min-h-full w-full min-w-[295px] max-w-[350px] md:max-h-[400px] md:max-w-[400px] lg:min-h-[350px] lg:min-w-[300px] lg:max-w-full xl:min-w-96'
          />
        </div>
        <Accordion type='single' collapsible className='w-full md:pl-10'>
          {content.map((item, index) => (
            <div key={index}>
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className='mb-1 gap-2 text-left text-sm font-semibold hover:no-underline md:text-base xl:mb-4 2xl:text-lg'>
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className='text-xs text-muted-foreground md:text-sm lg:text-base'>
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </div>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
export default FAQ;
