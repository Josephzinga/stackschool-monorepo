export type StorageVisibility = 'public' | 'private';

export interface UploadOptions {
  visibility: StorageVisibility;
  folder: string; // "avatars", "students", "documents"
  ownerId: string; // userId, studentId... pour le préfixe de clé
  allowedMimeTypes: string[];
  maxSizeBytes: number;
}

export interface UploadResult {
  key: string;
  url: string; // URL publique OU null si privé (utiliser getSignedUrl séparément)
}
