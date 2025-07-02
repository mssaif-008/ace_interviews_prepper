'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getInterviewCover } from '@/lib/utils';
import DisplayTechIcons from './DisplayTechIcons';
import { interviewCardsData } from '@/constants/index'; // import from root-level constants/index.ts
import { getInterviewById } from '@/lib/actions/general.action';

interface InterviewCardProps {
  id?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  company: string;
  feedback?: Feedback | null;
}

const InterviewCard = ({ id, userId, role, type, techstack, company, feedback }: InterviewCardProps) => {
  console.log('InterviewCard id:', id);
  const [imgSrc, setImgSrc] = useState(getInterviewCover(company));
  const normalizedType = type.toLowerCase();
  
 
  return (
    <div className='card-border w-[360px] max-sm:w-full min-h-96'>
      <div className='card-interview p-4 flex flex-col gap-4'>

        {/* Badge */}
        <div className='absolute top-0 right-0 px-4 py-2 rounded-bl-lg bg-light-600 z-10'>
          <p className='badge-text'>{normalizedType}</p>
        </div>

        {/* Company Logo and Role */}
        <div className='flex flex-col items-center'>
          <Image
            src={imgSrc}
            alt='cover'
            width={90}
            height={90}
            className='rounded-full object-cover size-[90px]'
            onError={() => setImgSrc('/covers/default.png')}
          />
          <h3 className='mt-4 text-center capitalize font-semibold'>{role} Interview</h3>
          <p className='text-sm text-gray-500 mt-1'>{company}</p>
        </div>

        {/* Message or Feedback */}
        <p className='line-clamp-3 text-sm text-center'>
          {feedback?.finalAssessment || 'You have not taken the interview yet. Take it now to improve your skills.'}
        </p>

        {/* Tech Stack as Text */}
        <p className='text-xs text-primary-400 font-medium mt-2 mb-2 text-center'>
  {techstack && techstack.length > 0
    ? `Tech Stack: ${techstack.slice(0, 3).join(', ')}`
    : 'No tech stack specified'}
</p>


        {/* Tech Stack Icons */}
      

        {/* Button */}
        <div className='flex justify-end mt-auto w-full'>
          <Button className='btn-primary'>
            <Link href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`} className='w-full h-full flex items-center justify-center'>
              {feedback ? 'Check Feedback' : 'Take Interview'}
            </Link>
           
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
