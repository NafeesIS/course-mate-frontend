// app/_components/TeamMemberCard.tsx
import Image from 'next/image';
import { FC } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { RiUser2Fill } from 'react-icons/ri';

interface ITeamMember {
  name: string;
  email?: string;
  designation: string;
  photoUrl: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

const TeamMemberCard: FC<ITeamMember> = ({
  name,
  designation,
  photoUrl,
  githubUrl,
  linkedinUrl,
}) => {
  return (
    <div className='group transform rounded-2xl bg-white text-center shadow-lg transition-transform duration-200 hover:scale-105'>
      <div className='rounded-t-2xl bg-gradient-to-r from-navy-blue to-midnight-blue'>
        {' '}
        <div className='flex-center mx-auto mb-4 h-36 w-36 translate-y-14 overflow-hidden rounded-full border-2 border-primary bg-accent object-cover'>
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={name}
              width={180}
              height={180}
              quality={100}
              className='h-36 w-36 rounded-full object-cover p-2 duration-200 group-hover:scale-110'
            />
          ) : (
            <RiUser2Fill className='size-16 text-gray-800' />
          )}
        </div>
      </div>

      <h3 className='mt-16 text-xl font-semibold text-gray-800'>{name}</h3>
      <p className='mb-4 text-gray-500'>{designation}</p>
      <div className='mb-4 flex justify-center space-x-4'>
        {githubUrl && (
          <a href={githubUrl} target='_blank' rel='noopener noreferrer'>
            <FaGithub className='text-gray-800 transition-colors hover:text-blue-600' />
          </a>
        )}
        {/* {twitterUrl && (
          <a href={twitterUrl} target='_blank' rel='noopener noreferrer'>
            <FaTwitter className='text-blue-400 transition-colors hover:text-blue-600' />
          </a>
        )} */}
        {linkedinUrl && (
          <a href={linkedinUrl} target='_blank' rel='noopener noreferrer'>
            <FaLinkedin className='text-blue-600 transition-colors hover:text-blue-800' />
          </a>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;
