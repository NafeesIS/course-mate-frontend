'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { IUserData } from '@/store/userStoreTypes';
import {
  CalendarClock,
  ExternalLink,
  Linkedin,
  Mail,
  Pencil,
  Phone,
  ShieldAlert,
  ShieldCheck,
  User2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { AiFillFacebook } from 'react-icons/ai';
import { BsGithub } from 'react-icons/bs';
import { IoPersonSharp } from 'react-icons/io5';
import { toast } from 'sonner';
import { MetaData } from '../_types/types';

function getDisplayName(user: IUserData) {
  const md = user.meta_data || {};
  const bd = user.billingDetails?.[0] || {};
  const first = md.firstName || bd.firstName || '';
  const last = md.lastName || bd.lastName || '';
  const name = `${first} ${last}`.trim();
  if (name.length > 0) return name;
  return user.emails?.[0] || 'User';
}

function formatDate(dt?: string | number) {
  if (!dt) return '—';
  const d = typeof dt === 'number' ? new Date(dt) : new Date(dt);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

// ------------------
// Main Page Component
// ------------------

// Profile props
export type ProfilePageProps = {
  userSignInDetails: IUserData;
  refetchUserSignInDetails: (() => void) | null;
  // eslint-disable-next-line no-unused-vars
  onSave?: (updated: {
    meta_data: Pick<
      MetaData,
      'firstName' | 'lastName' | 'mobileNumber' | 'bio' | 'avatarUrl' | '_id'
    >;
    linkedin?: string;
    file?: File | null;
  }) => Promise<void> | void;
};

export default function Profile({
  userSignInDetails,
  refetchUserSignInDetails,
  onSave,
}: ProfilePageProps) {
  const name = useMemo(
    () => getDisplayName(userSignInDetails),
    [userSignInDetails]
  );

  const [editOpen, setEditOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [bio, setBio] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [facebook, setFacebook] = useState('');
  const [github, setGithub] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const baseAvatar =
    userSignInDetails.meta_data.avatarUrl ||
    userSignInDetails.profilePicture ||
    undefined;

  const avatarToShow = previewUrl || baseAvatar; // ⬅️ NEW: show preview when present

  useEffect(() => {
    const md = userSignInDetails.meta_data || {};
    setFirstName(
      md.firstName || userSignInDetails.billingDetails?.[0]?.firstName || ''
    );
    setLastName(
      md.lastName || userSignInDetails.billingDetails?.[0]?.lastName || ''
    );
    setMobileNumber(
      md.mobileNumber ||
        userSignInDetails.billingDetails?.[0]?.mobileNumber ||
        ''
    );
    setBio(md.bio || '');
    setLinkedin(md?.social?.linkedin || '');
    setFacebook(md?.social?.facebook || '');
    setGithub(md?.social?.github || '');
  }, [userSignInDetails]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null);
    const file = e.target.files?.[0] || null;

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate: type image/* and ≤ 1 MB (matches backend limits)
    if (!file.type.startsWith('image/')) {
      setFileError('Please choose an image file.');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }
    const ONE_MB = 1 * 1024 * 1024;
    if (file.size > ONE_MB) {
      setFileError('Image must be 1 MB or smaller.');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  async function handleSave() {
    const updated = {
      // eslint-disable-next-line camelcase
      meta_data: {
        firstName,
        lastName,
        mobileNumber,
        bio: bio || undefined,
        _id: userSignInDetails.meta_data?._id,
        social: {
          linkedin: linkedin || undefined,
          facebook: facebook || undefined,
          github: github || undefined,
        },
      },
      file: selectedFile ?? undefined, // ⬅️ NEW
    };
    try {
      if (onSave) {
        await onSave(updated);
      }

      setEditOpen(false);
      // Optional: cleanup preview URL
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setSelectedFile(null);
      toast.success('Profile Information Updated');
      refetchUserSignInDetails?.();
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  }

  const email =
    userSignInDetails.emails?.[0] ||
    userSignInDetails.billingDetails?.[0]?.email ||
    '—';
  const verified = !!userSignInDetails.emailVerified;

  return (
    <div className='mx-auto max-w-4xl'>
      <Card className='overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-sm'>
        <CardHeader className='border-b border-gray-100 bg-white/80 backdrop-blur-sm'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg font-semibold text-gray-900'>
              Profile Information
            </CardTitle>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-8 border-gray-200 px-3 text-xs font-medium hover:bg-gray-50'
                >
                  <Pencil className='mr-1.5 h-3 w-3' />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-2xl'>
                <DialogHeader>
                  <DialogTitle className='text-lg'>Edit Profile</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <></>
                </DialogDescription>
                <div className='grid grid-cols-1 gap-4 py-4 sm:grid-cols-2'>
                  {/* Avatar Upload */}
                  <div className='space-y-1.5 sm:col-span-2'>
                    <Label
                      htmlFor='avatar'
                      className='text-xs font-medium text-gray-700'
                    >
                      Profile picture
                    </Label>

                    <div className='flex items-center gap-3'>
                      {/* Small live preview */}
                      <div className='h-12 w-12 overflow-hidden rounded-full bg-gray-100'>
                        {avatarToShow ? (
                          <Image
                            src={avatarToShow}
                            alt='Avatar preview'
                            width={48}
                            height={48}
                            className='h-12 w-12 object-cover'
                          />
                        ) : (
                          <div className='flex h-12 w-12 items-center justify-center'>
                            <IoPersonSharp className='h-7 w-7 text-gray-400' />
                          </div>
                        )}
                      </div>

                      <Input
                        id='avatar'
                        type='file'
                        accept='image/*'
                        onChange={handleFileChange}
                        className='h-8 text-sm'
                      />
                    </div>

                    {fileError && (
                      <p className='text-xs text-red-600'>{fileError}</p>
                    )}
                    <p className='text-[10px] text-gray-500'>
                      up to 1&nbsp;MB.
                    </p>
                  </div>

                  <div className='space-y-1.5'>
                    <Label
                      htmlFor='first'
                      className='text-xs font-medium text-gray-700'
                    >
                      First name
                    </Label>
                    <Input
                      id='first'
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder='First name'
                      className='h-8 text-sm'
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <Label
                      htmlFor='last'
                      className='text-xs font-medium text-gray-700'
                    >
                      Last name
                    </Label>
                    <Input
                      id='last'
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder='Last name'
                      className='h-8 text-sm'
                    />
                  </div>
                  <div className='space-y-1.5 sm:col-span-2'>
                    <Label
                      htmlFor='bio'
                      className='text-xs font-medium text-gray-700'
                    >
                      Bio
                    </Label>
                    <Textarea
                      id='bio'
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder='Tell readers about yourself (optional)'
                      rows={3}
                      maxLength={500}
                      className='resize-none text-sm'
                    />
                    <p className='text-[10px] text-gray-500'>
                      {bio.length}/500 characters
                    </p>
                  </div>
                  <div className='space-y-1.5 sm:col-span-2'>
                    <Label
                      htmlFor='linkedin'
                      className='text-xs font-medium text-gray-700'
                    >
                      LinkedIn
                    </Label>
                    <Input
                      id='linkedin'
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder='linkedin.com/in/your-handle'
                      className='h-8 text-sm'
                    />
                  </div>
                  <div className='space-y-1.5 sm:col-span-1'>
                    <Label
                      htmlFor='facebook'
                      className='text-xs font-medium text-gray-700'
                    >
                      Facebook
                    </Label>
                    <Input
                      id='facebook'
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder='facebook.com/in/your-handle'
                      className='h-8 text-sm'
                    />
                  </div>
                  <div className='space-y-1.5 sm:col-span-1'>
                    <Label
                      htmlFor='github'
                      className='text-xs font-medium text-gray-700'
                    >
                      Github
                    </Label>
                    <Input
                      id='github'
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder='github.com/in/your-handle'
                      className='h-8 text-sm'
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant='ghost'
                    onClick={() => setEditOpen(false)}
                    className='h-8 px-3 text-xs'
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className='h-8 bg-gray-900 px-4 text-xs hover:bg-gray-800'
                  >
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className='p-3 md:p-6'>
          {/* Header Section */}
          <div className='mb-6 flex flex-col gap-6 sm:flex-row'>
            <div className='flex flex-col items-center gap-3 sm:items-start'>
              <div className='flex-shrink-0'>
                {avatarToShow ? (
                  <Image
                    src={avatarToShow}
                    alt={name}
                    width={200}
                    height={200}
                    title={name}
                    className='h-20 w-20 rounded-full object-cover'
                  />
                ) : (
                  <div className='flex h-20 w-20 items-center justify-center rounded-full bg-[#AECBFA]'>
                    <IoPersonSharp className='h-12 w-12 text-[#3F6CE1]' />
                  </div>
                )}
              </div>
              <div className='flex flex-wrap justify-center gap-1.5 sm:justify-start'>
                {userSignInDetails.roles?.map((r) => (
                  <Badge
                    key={r}
                    variant='secondary'
                    className='bg-gray-100 px-2 py-0.5 text-xs text-gray-700 hover:bg-gray-200'
                  >
                    {r}
                  </Badge>
                ))}
              </div>
            </div>

            <div className='flex-1 space-y-3'>
              <div>
                <h2 className='mb-1 text-xl font-semibold text-gray-900'>
                  {name}
                </h2>
                <div className='flex flex-nowrap items-center gap-1 text-xs text-gray-600 xs:flex-wrap xs:gap-2 md:text-sm'>
                  <Mail className='max-h-4 min-h-3 min-w-3 max-w-4' />
                  <span>{email}</span>
                  {verified ? (
                    <div className='ml-2 flex items-center gap-1 text-xs md:text-sm'>
                      <ShieldCheck className='h-4 w-4 text-emerald-600' />
                      <span className='text-xs font-medium text-emerald-600 md:text-sm'>
                        Verified
                      </span>
                    </div>
                  ) : (
                    <div className='ml-2 flex items-center gap-1 text-xs md:text-sm'>
                      <ShieldAlert className='h-4 w-4 text-amber-500' />
                      <span className='text-xs font-medium text-amber-600 md:text-sm'>
                        Unverified
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio Section */}
              {userSignInDetails.meta_data?.bio && (
                <div className='rounded-lg border border-gray-100 bg-gray-50 p-3'>
                  <p className='text-sm leading-relaxed text-gray-700'>
                    {userSignInDetails.meta_data?.bio}
                  </p>
                </div>
              )}

              {/* Social Links */}
              <div className='flex items-center justify-start gap-2'>
                {userSignInDetails.meta_data?.social?.linkedin && (
                  <div className='flex items-center gap-2'>
                    <Link
                      className='inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[8px] font-medium text-blue-700 transition-colors hover:bg-blue-100 xs:text-xs sm:px-3 sm:py-1.5'
                      href={userSignInDetails.meta_data?.social?.linkedin}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Linkedin className='h-3 w-3' />
                      LinkedIn
                      <ExternalLink className='h-3 w-3' />
                    </Link>
                  </div>
                )}

                {userSignInDetails.meta_data?.social?.facebook && (
                  <div className='flex items-center gap-2'>
                    <Link
                      className='inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[8px] font-medium text-blue-700 transition-colors hover:bg-blue-100 xs:text-xs sm:px-3 sm:py-1.5'
                      href={userSignInDetails.meta_data?.social?.facebook}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <AiFillFacebook className='h-3 w-3' />
                      Facebook
                      <ExternalLink className='h-3 w-3' />
                    </Link>
                  </div>
                )}

                {userSignInDetails.meta_data?.social?.github && (
                  <div className='flex items-center gap-2'>
                    <Link
                      className='inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[8px] font-medium text-blue-700 transition-colors hover:bg-blue-100 xs:text-xs sm:px-3 sm:py-1.5'
                      href={userSignInDetails.meta_data?.social?.github}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <BsGithub className='h-3 w-3' />
                      GitHub
                      <ExternalLink className='h-3 w-3' />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <div>
              <InfoCard
                icon={<User2 className='h-4 w-4 text-blue-600' />}
                label='First Name'
                value={firstName || '—'}
              />
            </div>
            <div>
              {' '}
              <InfoCard
                icon={<User2 className='h-4 w-4 text-purple-600' />}
                label='Last Name'
                value={lastName || '—'}
              />
            </div>
            <div className='col-span-1 md:col-span-2 lg:col-span-1'>
              <InfoCard
                icon={<Phone className='h-4 w-4 text-green-600' />}
                label='Mobile'
                value={mobileNumber || '—'}
              />
            </div>
          </div>

          {/* Timestamps */}
          <div className='mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2'>
            <InfoCard
              icon={<CalendarClock className='h-4 w-4 text-orange-600' />}
              label='Last Login'
              value={formatDate(userSignInDetails.lastLogin)}
              compact
            />
            <InfoCard
              icon={<User2 className='h-4 w-4 text-indigo-600' />}
              label='Member Since'
              value={formatDate(userSignInDetails.timeJoined)}
              compact
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoCard({
  label,
  value,
  icon,
  mono,
  compact,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  mono?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white ${compact ? 'p-3' : 'p-4'} transition-shadow hover:shadow-sm`}
    >
      <div className='mb-1 flex items-center gap-2'>
        {icon}
        <span className='text-xs font-medium uppercase tracking-wider text-gray-500'>
          {label}
        </span>
      </div>
      <div
        className={`text-sm ${mono ? 'font-mono' : 'font-medium'} text-gray-900 ${compact ? 'truncate' : ''}`}
      >
        {value}
      </div>
    </div>
  );
}
