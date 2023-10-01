// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFileToFirebase(image_url:string,name:string):Promise<string|undefined>{
    try{
        const response = await fetch(image_url);
        const buffer = await response.arrayBuffer();
        const file_name = name.replace(" ", "") + Date.now + ".jpeg";
        const storageRef = ref(storage, file_name);
        await uploadBytes(storageRef, buffer, {
          contentType: "image/jpeg",
        });
        const firebase_url = await getDownloadURL(storageRef);
        return firebase_url;
    }catch(error){
        console.log('[UPLOAD_FILE_TO_FIREBASE_ERROR]: ',error);
    }
}
