import { Storage } from "@google-cloud/storage";

// const storage = new Storage({ projectId: "applications-dev-111111" });
const storage = new Storage();
const bucketName = "user-feedback-form-bucket1";

export default async function uploadToGoogleBucket(formData: {
  antispam: string;
  name: string;
  email: string;
  company: string;
  satisfaction: string;
  message: "test";
}) {
  return new Promise((resolve, reject) => {
    const bucket = storage.bucket(bucketName);

    // console.log("projectID: ", storage);
    const timestamp = Date.now();
    const fileName = `feedback_${timestamp}.json`;
    const file = bucket.file(fileName);
    const fileStream = file.createWriteStream({
      resumable: false,
      gzip: true,
      contentType: "application/json",
    });
    fileStream.on("error", (err) => {
      console.error("uploadToGoogleBucket error:", err.message);
      reject(err);
    });
    fileStream.on("finish", () => {
      // console.log("uploadToGoogleBucket success:", fileName);
      resolve(true);
    });
    // write form data to file
    fileStream.end(JSON.stringify(formData));
  });
}
