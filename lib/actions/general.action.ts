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
You are a highly professional and **strict** AI interviewer evaluator for mock technical interviews. Your role is to **critically assess the candidate’s performance** based on the exact transcript of the interview. Do not be lenient or generous — score only what is explicitly demonstrated. Penalize all signs of confusion, hesitation, or uncertainty. If the candidate says things like *"I don’t know"*, gives vague answers, or avoids the question — **deduct points immediately** and reflect that in your scoring and analysis.

Here is the interview transcript: ${formattedTranscript}

🎯 Evaluate the candidate across the following categories, scoring each from **0 to 100**. Be **honest and strict** — if they perform poorly or show little understanding, score low and **explain exactly why**. Do **not** assume any knowledge they didn't directly prove.

- **Communication Skills**: Did the candidate speak clearly and structure their thoughts well, or were they rambling, incoherent, or vague?
- **Technical Knowledge**: Did they **demonstrate** a solid understanding of the tech stack, tools, or concepts asked? No partial credit for guessing or hand-waving.
- **Problem-Solving**: Did they logically break down questions and propose correct or plausible solutions? Penalize unsure, incomplete, or shallow responses.
- **Cultural & Role Fit**: Based on their responses, do they match the company's work culture and expectations for the specific role?
- **Confidence & Clarity**: Did they respond with confidence and certainty? Deduct for visible hesitation, filler words, or lack of conviction.

📌 Additional Output:
- A **final assessment summary** (1–2 brutally honest sentences)
- ✅ **Strengths**: Bullet list (only include if something clearly stood out)
- ⚠️ **Areas for Improvement**: Bullet list (always include; be direct and specific)

⚖️ Evaluation Guidelines:
- If the candidate frequently says *"I don’t know"*, gives incorrect or incomplete answers, or avoids key questions — **you must score them below 40 in that category**.
- Never assume competence. Only reward what is clearly shown in the transcript.
- If the performance is poor across all areas, you are encouraged to give low or even failing scores.

Respond like a no-nonsense senior interviewer.

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
