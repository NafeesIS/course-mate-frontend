import { Shield, User } from 'lucide-react';

interface DirectorPersonalInfoProps {
  directorInfo: any; // Replace 'any' with the correct type from your IDirector interface
}

export function DirectorPersonalInfo({
  directorInfo,
}: DirectorPersonalInfoProps) {
  return (
    <div className='grid gap-4 px-4 text-xs sm:grid-cols-2 md:text-sm'>
      {/* <div className='flex items-center space-x-2'>
        <Calendar className='size-4 text-primary md:size-5' />
        <span>
          <strong>Born:</strong> {directorInfo.dob}
        </span>
      </div> */}
      <div className='flex items-center space-x-2'>
        <User className='size-4 text-primary md:size-5' />
        <span>
          <strong>Gender:</strong> {directorInfo.gender}
        </span>
      </div>
      {/* <div className='flex items-center space-x-2'>
        <Flag className='size-4 text-primary md:size-5' />
        <span>
          <strong>Nationality:</strong> {directorInfo.nationality}
        </span>
      </div> */}
      <div className='flex items-center space-x-2'>
        <Shield className='size-4 text-primary md:size-5' />
        <span>
          <strong>Status:</strong> {directorInfo.status}
        </span>
      </div>
    </div>
  );
}
