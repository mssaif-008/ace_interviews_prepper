
import { _success } from "zod/v4/core";
import { db,auth } from "@/firebase/admin";
import {cookies} from 'next/headers';
import { use } from "react";

export async function getInterviewsByUserId(userId: string): Promise<Interview[] | null> {
    const interviews = await db
      .collection('interviews') // CollectionReference<DocumentData, DocumentData>
      .where('userId', '==', userId) // Query<DocumentData, DocumentData>
      .orderBy('createdAt', 'desc')
      .get();
  
    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as Interview[];
  }


  export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
    
    const{userId,limit=20}=params;
    
    
    const interviews = await db
      .collection('interviews')
      .orderBy('createdAt', 'desc') // CollectionReference<DocumentData, DocumentData>
      .where('finalized', '==', true) // Query<DocumentData, DocumentData>
      .where('userId','!=',userId)
      .limit(limit)
      .get();
  
    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as Interview[];
  }

  export async function getInterviewById(id: string): Promise<Interview | null> {
    const interviews = await db
      .collection('interviews') // CollectionReference<DocumentData, DocumentData>
      .doc(id)
      .get();
  
    return interviews.data() as Interview | null ;}