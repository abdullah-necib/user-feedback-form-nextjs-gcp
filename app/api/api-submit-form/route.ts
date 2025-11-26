import { sendEmail } from "@/app/utils/sendEmail";
import uploadToGoogleBucket from "@/app/utils/uploadToGoogleBucket";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // console.log("API received data:", data);
    await uploadToGoogleBucket(data);
    await sendEmail(data);
    return NextResponse.json(
      { message: "Form submitted successfully", data: data },
      { status: 200 }
    );
  } catch (error) {
    console.error(`POST - route.ts: Error submitting form:${error}`);
    return NextResponse.json(
      { message: `POST - route.ts: Error submitting form: ${error}` },
      { status: 500 }
    );
  }
}
