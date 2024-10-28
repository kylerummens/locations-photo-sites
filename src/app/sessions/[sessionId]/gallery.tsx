import { getSessionById, getSessionPhotos } from "@/lib/db/sessions";
import Image from "next/image";

type Props = {
  sessionId: string;
};

export async function Gallery({ sessionId }: Props) {
  const [session, photos] = await Promise.all([
    getSessionById(sessionId),
    getSessionPhotos(sessionId),
  ]);

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>;
      <div className="grid grid-cols-4 gap-4">
        {photos?.map((photo) => (
          <Image
            key={photo.id}
            src={photo.signedUrl!}
            alt={photo.name || "Gallery image"}
            width={300}
            height={300}
            className="w-full h-[300px] object-cover transition-all hover:scale-105"
          />
        ))}
      </div>
    </div>
  );
}
