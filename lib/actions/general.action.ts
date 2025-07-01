import { db, auth } from "@/firebase/admin";
import { interviewCardsData } from '@/constants/index';
; // make sure this matches your Interview type

import { FieldValue } from "firebase-admin/firestore";
// ✅ 1. Get all interviews by userId
// export async function getInterviewsByUserId(userId: string): Promise<Interview[] | null> {
//   const interviews = await db
//     .collection('interviews')
//     .where('userId', '==', userId)
//     .orderBy('createdAt', 'desc')
//     .get();

//   return interviews.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data()
//   })) as Interview[];
// }

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




export async function addInterviewToUser(userId: string, interviewId: string): Promise<void> {
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


