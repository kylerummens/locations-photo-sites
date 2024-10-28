import { createServiceRoleClient } from "../supabase/server";

export async function getSessionById(id: string) {
  const supabase = await createServiceRoleClient();
  const { data } = await supabase.from('sessions').select().match({ id }).maybeSingle();
  return data;
}

export async function getSessionPhotos(sessionId: string) {
  const supabase = await createServiceRoleClient();
  const { data } = await supabase.storage.from('sessions').list(sessionId);

  if (!data) return null;

  return Promise.all(data.map(async file => {
    const { data: signedUrl } = await supabase.storage
      .from('sessions')
      .createSignedUrl(`${sessionId}/${file.name}`, 60 * 60);

    return { ...file, signedUrl: signedUrl?.signedUrl }
  })).then(res => res.filter(_ => _.signedUrl));
}