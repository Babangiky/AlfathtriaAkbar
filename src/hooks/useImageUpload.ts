import { useState } from "react";
import { supabase } from "@/src/integrations/supabase/client";
import { toast } from "sonner";

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  async function uploadImage(file: File, folder: string = "general"): Promise<string | null> {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("portfolio-images")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (error) {
        toast.error("Upload gagal: " + error.message);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from("portfolio-images")
        .getPublicUrl(fileName);

      toast.success("Gambar berhasil diupload!");
      return urlData.publicUrl;
    } catch (err: any) {
      toast.error("Upload error: " + err.message);
      return null;
    } finally {
      setUploading(false);
    }
  }

  return { uploadImage, uploading };
}
