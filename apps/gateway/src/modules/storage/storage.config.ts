import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  endpoint: process.env.MINIO_ENDPOINT!,
  publicUrl: process.env.MINIO_PUBLIC_URL,
  accessKeyId: process.env.MINIO_ROOT_USER!,
  secretAccessKey: process.env.MINIO_ROOT_PASSWORD!,
  region: 'us-east-1',
  buckets: {
    public: 'stackschool-public', // avatars, logos d'école
    private: 'stackschool-private', // documents, photos élèves
  },

  forcePathStyle: true,
}));
