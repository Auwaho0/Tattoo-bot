// src/shared/lib/photo.ts
export const getPhotoUrl = (fileId: string) =>
  `${import.meta.env.VITE_API_URL}/api/photo/${fileId}`;