/*
  accepte les messages utilisateur et fait les requêtes adaptées à l’API Mistral
*/

import { NextResponse } from "next/server";

 
export async function GET(request, { params }) {
  //const { slug } = await params;
  return NextResponse.json({ message: `Hello!` });
}

export async function POST(request) {
  try {
    const body = await request.json()
    console.log(body)
    return Response.json({ success: true })
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected error'
 
    return new Response(message, { status: 500 })
  }
}