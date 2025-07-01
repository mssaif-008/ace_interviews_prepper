import Image from "next/image";
import { redirect } from "next/navigation";
import PredefinedAgent from "@/components/PredefinedAgent";

import {
 
  getFamousInterviewById
} from '@/constants/index';

import { getCurrentUser } from "@/lib/actions/auth.action";


const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();

  const interview = await getFamousInterviewById(id);
  if (!interview) redirect("/");

//   const feedback = await getFeedbackByInterviewId({
//     interviewId: id,
//     userId: user?.id!,
//   });

  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
               src={`/covers/${interview.company}.png`}
              alt="cover-image"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>

          
        </div>

        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
          {interview.type}
        </p>
      </div>

      <PredefinedAgent
        userName={user?.name!}
        userId={user?.id!}
        interviewId={interview.id}
        type={interview.type}
        company={interview.company}
        role={interview.role}
        techStack={interview.techstack}
       
        /*{feedbackId={feedback?.id}}*/
      />
    </>
  );
};

export default InterviewDetails;
// {
  //   id: "12",
  //   userId: "user1",
  //   company: "google",
  //   role: "ML Engineer",
  //   type: "Technical",
  //   techstack: ["Python", "TensorFlow", "Keras", "PyTorch", "Scikit-learn", "MLflow"]
  // },