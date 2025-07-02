'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { getVapi } from '@/lib/vapi.sdk';
 import { addInterviewToUser } from "@/lib/actions/general.action"; // adjust path based on your file structure
 import { createFeedback } from '@/lib/actions/general.action'; // Adjust this path as needed


enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface SavedMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}
// {
  //   id: "12",
  //   userId: "user1",
  //   company: "google",
  //   role: "ML Engineer",
  //   type: "Technical",
  //   techstack: ["Python", "TensorFlow", "Keras", "PyTorch", "Scikit-learn", "MLflow"]
  // },
  interface PredefinedAgentProps {
    userName: string;
    userId: string;
    interviewId: string;
    type: string;
    company: string;
    role: string;
    techStack: string[]; // or string, depending on how you're passing it
  }

const PredefinedAgent = ({ userName, userId, interviewId,type,company,role,techStack }: PredefinedAgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const assistantOverrides = {
    variableValues: {
      companyName: company,
      role:role,
      techStack: techStack,
      interviewType: type,
      
      
      
      
    },
  };

  useEffect(() => {


    

    const vapi = getVapi();

    const onCallStart = async () => {
        console.log('✅ VAPI Call Started');
        setCallStatus(CallStatus.ACTIVE);
      
        try {
          const res = await fetch('/api/add-interview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, interviewId }),
          });
      
          if (!res.ok) throw new Error('Failed to add interview');
      
          console.log("📌 Interview ID added to user successfully.");
        } catch (error) {
          console.error("❌ Failed to add interview to user:", error);
        }
      };
      

      const onCallEnd = async () => {
        setCallStatus(CallStatus.FINISHED);
      
        try {
          const res = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              interviewId,
              userId,
              transcript: messages,
            }),
          });
      
          const data = await res.json();
      
          if (data.success) {
            console.log('✅ Feedback generated:', data.feedbackId);
            router.push(`/interview/${interviewId}/feedback`);
          } else {
            console.error('❌ Feedback generation failed');
          }
        } catch (error) {
          console.error('❌ Error calling feedback API:', error);
        }
      };
      
      

    const onMessage = (message: any) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        setMessages((prev) => [...prev, { role: message.role, content: message.transcript }]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: any) => {
      console.error('VAPI Error:', error);
      if(typeof error === 'object' && error !== null) {
        console.error('VAPI Error Details:', JSON.stringify(error, null, 2));
      }
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    };
  }, []);

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      router.push('/');
    }
  }, [callStatus]);

  const handleCall = async () => {
    const vapi = getVapi();
    const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID_2;

    if (!workflowId) {
      console.error('VAPI Workflow ID is missing.');
      return;
    }

    setCallStatus(CallStatus.CONNECTING);

    try {
      await vapi.start(workflowId,assistantOverrides);
    } catch (error) {
      console.error('Error starting VAPI call:', error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = async () => {
    const vapi = getVapi();
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
    await fetch('/api/dev/upload-famous-interviews');
   
  };

  const lastMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image src={`/covers/${company}.png`} alt="avatar" width={65} height={54} className="object-cover" />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>{company} Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/the-mass-user-96.png"
              alt="user avatar"
              width={540}
              height={540}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div>
            <div className="transcript">
              <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                {lastMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== CallStatus.CONNECTING && 'hidden')}
            />
            <span>{isCallInactiveOrFinished ? 'Call' : '. . .'}</span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default PredefinedAgent;
