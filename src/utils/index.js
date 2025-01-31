import { useLocation } from "react-router-dom";
import { app } from "./firebase"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"

export const API_URI = "https://blogging-api-iota.vercel.app";
// export const API_URI = "http://localhost:8800";

export const uploadFile = (setFileURL, file) => {
    const storage = getStorage(app);

    const name = new Date().getTime() + file.name
    const storageRef = ref(storage, name);

    const uploadTask =  uploadBytesResumable(storageRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done")

            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case'running':
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
        
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log("Successfully Uploaded")
                setFileURL(downloadURL)
            })
        }
    )
}


export function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  }

export function getInitials(fullName) {
    const names = fullName.split(" ");
    const initials = names.slice(0, 2).map((name) => name[0].toUpperCase());
    const initialsStr = initials.join("");
    return initialsStr;
}

export function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "")
        .replace(/^-+/, "")
        .replace(/-+$/, "");

}

export const updateURL = ({ page, navigate, location}) => {
    const params = new URLSearchParams();

    if (page && page > 1) {
        params.set("page", page)

    }

    const newURL = `${location.pathname}?${params.toString()}`;
    navigate(newURL, { replace: true });

    return newURL;
}
