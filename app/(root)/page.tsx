import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { interviewCardsData } from '@/constants/index'; 
import InterviewCard from '@/components/InterviewCard'
import { getAttendedInterviewIds, getInterviewById } from '@/lib/actions/general.action'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getFamousInterviewById } from '@/constants/index';

const Page =async () => {

const user = await getCurrentUser();

if (!user?.id) return <p>Loading user...</p>;

  // Get attended interview IDs
  const userInterviewIds = await getAttendedInterviewIds(user.id);

  // Fetch interview details for each ID
  const userInterviews = userInterviewIds
    .map((id) => getFamousInterviewById(id))
    .filter((interview): interview is Interview => interview != null);

  const hasPastInterviews = userInterviews.length > 0;

  // Get popular interviews (excluding current user's)
 // const latestInterviews = await getLatestInterviews({ userId: user.id, limit: 50 });

  // const hasUpcomingInterviews = latestInterviews?.length ?? 0 > 0;
  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Get Interview Ready with AI Powered Practice & Feedback</h2>
          <p className='text-lg'>Practice on real interview questions & get instant feedback</p>
          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href="/interview">Take a custom interview</Link> 
          </Button>
        </div>
        <Image src='/robot.png' alt='robo' width={400} height={400} className="max-sm:hidden" />
      </section>
      <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Interviews</h2>
        <div className='interviews-section'>
          {hasPastInterviews ? (
            userInterviews.map((interview) => (
              <InterviewCard
                key={interview.company + interview.role}
                id={interview.id}
                userId={user.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                company={interview.company}
              />
            ))
          ) : (
            <p>You have not taken any interviews yet</p>
          )}
        </div>
      </section>
      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take the Famous Interviews</h2>
        <div className='interviews-section'>
          {interviewCardsData.slice(0,10).map((card, idx) => (
            <InterviewCard
              key={card.company + card.role}
              id={card.id}
              userId="famous"
              role={card.role}
              type={card.type}
              techstack={card.techstack}
              company={card.company}
              
            />
          ))}
        </div>
      </section>
    </>
  )
}

export default Page
