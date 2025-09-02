/* eslint-disable indent */
// app/meet-our-team/page.tsx
import HeroWrapper from '@/components/shared/HeroWrapper';
import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata, Viewport } from 'next';
import { FC } from 'react';
import TeamMemberCard from './_components/TeamMemberCard';
import { getTeamMembers } from './_services/getTeamMembers';

interface ITeamMember {
  name: string;
  email?: string;
  designation: string;
  photoUrl: string;
  githubUrl?: string;
  linkedinUrl?: string;
}
export const revalidate = 86400; // cache for 1 day = 60 * 60 * 24
export async function generateMetadata(): Promise<Metadata> {
  const teamData = await getTeamMembers();
  const teamMembers = teamData?.data || [];

  return {
    metadataBase: new URL(`${BASE_URL_FRONTEND}/meet-our-team`),
    title: 'Meet Our Team | FileSure',
    description:
      'Get to know the talented team behind FileSure. Learn more about our team members, their roles, and their professional backgrounds.',
    applicationName: 'FileSure',
    referrer: 'origin-when-cross-origin',
    keywords: [
      'FileSure team',
      'meet our team',
      'FileSure members',
      'FileSure professionals',
      'FileSure developers',
      ...teamMembers.map((member: ITeamMember) => member.name),
    ],
    authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
    creator: 'FileSure',
    publisher: 'FileSure',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      siteName: 'FileSure',
      type: 'website',
      locale: 'en_IN',
      title: 'Meet Our Team | FileSure',
      description: 'Get to know the talented team behind FileSure.',
      url: `${BASE_URL_FRONTEND}/meet-our-team`,
      images: [
        {
          url: `${BASE_URL_FRONTEND}/assets/team-opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: 'FileSure Team',
        },
        ...teamMembers.map((member: ITeamMember) => ({
          url: member.photoUrl,
          width: 800,
          height: 800,
          alt: `${member.name} - ${member.designation}`,
        })),
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@FileSure',
      creator: '@FileSure',
      title: 'Meet Our Team | FileSure',
      description: 'Get to know the talented team behind FileSure.',
      images: [
        `${BASE_URL_FRONTEND}/assets/team-twitter-image.png`,
        ...teamMembers.map((member: ITeamMember) => member.photoUrl),
      ],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
      googleBot: 'index, follow',
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const TeamPage: FC = async () => {
  const teamData = await getTeamMembers();
  const teamMembers = teamData?.data;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FileSure',
    url: `${BASE_URL_FRONTEND}`,
    logo: `${BASE_URL_FRONTEND}/assets/filesure-icon.png`,
    sameAs: [
      'https://www.linkedin.com/company/filesure',
      'https://twitter.com/FileSure',
      'https://github.com/FileSure',
    ],
    member: teamMembers.map((member: ITeamMember) => ({
      '@type': 'Person',
      name: member.name,
      jobTitle: member.designation,
      image: member.photoUrl,
      sameAs: [
        member.linkedinUrl,
        ...(member.githubUrl ? [member.githubUrl] : []),
      ],
    })),
  };
  return (
    <div className=''>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroWrapper className='overflow-hidden pb-16 pt-32'>
        <h1 className='text-3xl font-bold text-background'>Meet Our Team</h1>
      </HeroWrapper>

      <div className='wrapper my-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:my-16 xl:grid-cols-4'>
        {teamMembers?.map((member: ITeamMember) => (
          <TeamMemberCard
            key={member.name}
            name={member.name}
            designation={member.designation}
            photoUrl={member.photoUrl}
            githubUrl={member.githubUrl}
            // twitterUrl={member.twitterUrl}
            linkedinUrl={member.linkedinUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
