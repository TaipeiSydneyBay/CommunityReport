import axios from "axios";

/**
 * Upload a file directly to S3 using a pre-signed URL
 * 
 * @param file The file to upload
 * @returns The public URL of the uploaded file
 */
export async function uploadFileToS3(file: File): Promise<string> {
  try {
    // 1. Get a pre-signed URL from the server
    const urlResponse = await axios.get("/api/presigned-url", {
      params: {
        fileName: file.name,
        fileType: file.type
      }
    });
    
    const { presignedUrl } = urlResponse.data;
    
    // 2. Upload the file directly to S3 using the pre-signed URL
    await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
        "Access-Control-Allow-Origin": "*"
      }
    });
    
    // 3. Return the public URL (removing query parameters from presigned URL)
    const publicUrl = presignedUrl.split("?")[0];
    return publicUrl;
    
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("檔案上傳失敗");
  }
}

/**
 * Upload a file to S3 through the server
 * 
 * @param file The file to upload
 * @returns The public URL of the uploaded file
 */
export async function uploadFileViaServer(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("photo", file);
    
    const response = await axios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    
    return response.data.url;
    
  } catch (error) {
    console.error("Error uploading file via server:", error);
    throw new Error("檔案上傳失敗");
  }
}
