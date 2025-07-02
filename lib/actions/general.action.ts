import { db, auth } from "@/firebase/admin";
import { interviewCardsData } from '@/constants/index';
; // make sure this matches your Interview type
import { feedbackSchema } from "@/constants";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { FieldValue } from "firebase-admin/firestore";

export async function getInterviewsByUserId(userId: string): Promise<Interview[] | null> {
  const interviews = await db
    .collection('interviews')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Interview[];
}

// ✅ 2. Get latest interviews (excluding current user's own)
// export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
//   const { userId, limit = 20 } = params;

//   const interviews = await db
//     .collection('interviews')
//     .orderBy('createdAt', 'desc')
//     .where('finalized', '==', true)
//     .where('userId', '!=', userId)
//     .limit(limit)
//     .get();

//   return interviews.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data()
//   })) as Interview[];
// }

// ✅ 3. Get single interview by ID
export async function getInterviewById(id: string): Promise<Interview | null> {
  const interviewDoc = await db
    .collection('interviews')
    .doc(id)
    .get();

  return interviewDoc.exists ? { id: interviewDoc.id, ...interviewDoc.data() } as Interview : null;
}




export async function addInterviewToUser2(userId: string, interviewId: string): Promise<void> {
  const userRef = db.collection("users").doc(userId);

  await userRef.update({
    attendedInterviews: FieldValue.arrayUnion(interviewId),
  });
}


export async function getAttendedInterviewIds(userId: string): Promise<string[]> {
  const userRef = db.collection("users").doc(userId);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    console.warn(`User with ID ${userId} not found.`);
    return [];
  }

  const userData = userSnap.data();
  return userData?.attendedInterviews ?? [];
 
}


export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
You are a highly critical and professional AI interviewer tasked with evaluating a candidate's mock interview performance. Your job is to **honestly assess their abilities**, highlight any **weaknesses or lack of knowledge**, and avoid inflating scores.

📌 Use the transcript below to make your judgment. If the candidate shows confusion, hesitation, or says things like "I don’t know", **deduct points accordingly**.

Transcript:
${formattedTranscript}

🎯 Evaluate the candidate strictly across the following categories (score each from 0 to 100). Be honest — if they performed poorly in any area, score them low and explain why.

- **Communication Skills**: Was the candidate clear and structured in their responses? Were they able to articulate their thoughts effectively?
- **Technical Knowledge**: Did they demonstrate a strong understanding of the required tech stack and key concepts?
- **Problem-Solving**: Could they logically analyze questions and propose working solutions, or did they give vague, uncertain, or incomplete responses?
- **Cultural & Role Fit**: Based on their answers, do they align with the company's values and expectations for the role?
- **Confidence & Clarity**: Did they show confidence and clarity, or were they uncertain, hesitant, or frequently unsure?

🔎 Also provide:
- A realistic **final assessment summary** (1-2 sentences)
- A bullet list of **Strengths** (only if any)
- A bullet list of **Areas for Improvement** (always include, even for strong candidates)

Only use the transcript provided — do not assume any skills that are not explicitly demonstrated.

Keep it short, factual, and judgmental where needed.
`,

system: `
You are an expert interviewer who gives strict, realistic mock interview evaluations. If a candidate gives weak or no responses, you lower their scores and offer constructive but honest feedback. You do not inflate scores.
`,

      
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}


export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getInterviewIdsByUserId(userId: string): Promise<string[]> {
  try {
    const snapshot = await db
      .collection('interviews')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    if (snapshot.empty) return [];

    return snapshot.docs.map((doc) => doc.id);
  } catch (error) {
    console.error("Error fetching interview IDs:", error);
    return [];
  }
}


/**
 * Adds a real Firestore interviewId to a user's attendedInterviews array.
 */
export async function addInterviewToUser(userId: string, interviewId: string): Promise<void> {
  const userRef = db.collection("users").doc(userId);

  await userRef.update({
    attendedInterviews: FieldValue.arrayUnion(interviewId),
  });
}




export async function uploadFamousInterviews() {
  const batch = db.batch();

  interviewCardsData.forEach((interview) => {
    const docRef = db.collection("famousInterviews").doc(interview.id);
    batch.set(docRef, {
      ...interview,
      createdAt: new Date().toISOString(),
    });
  });

  await batch.commit();
  console.log("✅ Famous interviews uploaded");
}
export async function getFamousInterviewById(id: string): Promise<Interview | null> {
  const doc = await db.collection("famousInterviews").doc(id).get();
  return doc.exists ? ({ id: doc.id, ...doc.data() } as Interview) : null;
}
export async function getAllFamousInterviews(): Promise<Interview[]> {
  const snapshot = await db.collection("famousInterviews").orderBy("createdAt", "desc").get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Interview));
}
