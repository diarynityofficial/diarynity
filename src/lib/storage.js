import { supabase } from "./supabaseClient";

export async function uploadMemoryFile(file, userId) {
  if (!file || !userId) {
    return {
      url: null,
      error: "Dosya veya kullanıcı bilgisi eksik.",
    };
  }

  const fileExt = file.name.split(".").pop();

  const fileName = `${userId}-${Date.now()}.${fileExt}`;

  const filePath = `memories/photos/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("diarynity-uploads")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return {
      url: null,
      error: uploadError.message,
    };
  }

  const { data } = supabase.storage
    .from("diarynity-uploads")
    .getPublicUrl(filePath);

  return {
    url: data.publicUrl,
    error: null,
  };
}