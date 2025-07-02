import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { getAllFamousInterviews } from '@/lib/actions/general.action';



import InterviewCard from '@/components/InterviewCard'
import { getAttendedInterviewIds, getInterviewById, getFeedbackByInterviewId } from '@/lib/actions/general.action'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getFamousInterviewById } from '@/constants/index';

const Page =async () => {

const user = await getCurrentUser();

if (!user?.id) return <p>Loading user...</p>;

  // Get attended interview IDs
  const userInterviewIds = await getAttendedInterviewIds(user.id);
  const famousInterviews = await getAllFamousInterviews();

  // Fetch interview details for each ID
  const userInterviewsData = await Promise.all(
    userInterviewIds.map(async (id) => {
      let interview = await getInterviewById(id);
      if (!interview) {
        const famous = await getFamousInterviewById(id); // Try famous interviews if not found
        interview = famous ? famous : null;
      }
      const feedback = await getFeedbackByInterviewId({ interviewId: id, userId: user.id });
      return interview ? { ...interview, feedback } : null;
    })
  );
  
  // const userInterviews = userInterviewsData.filter((i): i is Interview & { feedback: Feedback | null } => i !== null);
  
  const hasPastInterviews = userInterviewsData.length > 0;

  // Get popular interviews (excluding current user's)
 // const latestInterviews = await getLatestInterviews({ userId: user.id, limit: 50 });

  // const hasUpcomingInterviews = latestInterviews?.length ?? 0 > 0;
  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Get Interview Ready with AI Powered Practice & Feedback</h2>
          <p className='text-lg'>Practice on real interview questions & get instant feedback</p>
         {/* /*{} <Button asChild className='btn-primary max-sm:w-full'>
            <Link href="/interview">Take a custom interview</Link> 
          </Button>} */}
        </div>
        <Image src='/the-bot-green.png' alt='robo' width={400} height={400} className="max-sm:hidden" />
      </section>
      <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Interviews</h2>
        <div className='interviews-section'>
          {hasPastInterviews ? (
           userInterviewsData.map((interview, idx) => (
            interview ? (
              <InterviewCard
                key={interview.id}
                id={interview.id}
                userId={user.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                company={interview.company}
                feedback={interview.feedback}
              />
            ) : (
              <div key={idx}>Interview not found</div>
            )
          ))
          ) : (
            <p>You have not taken any interviews yet</p>
          )}
        </div>
      </section>
      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take the Famous Interviews</h2>
        <div className='interviews-section'>
        {famousInterviews.slice(0, 10).map((card) => (
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
