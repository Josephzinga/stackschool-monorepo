interface AvatarProps {
  photo?: string | null;
  isLoading?: boolean;
  onPhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Spinner: React.FC = () => (
  <svg
    className="animate-spin h-8 w-8 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const Avatar: React.FC<AvatarProps> = ({
  photo,
  isLoading = false,
  onPhotoUpload,
}) => {
  return (
    <div className="relative w-32 h-32" aria-live="polite">
      <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300">
        {photo ? (
          <img
            src={photo}
            alt="Photo de profil"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="text-5xl text-gray-400"
            aria-label="Avatar par défaut">
            👤
          </div>
        )}
      </div>

      {isLoading && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center"
          aria-label="Chargement en cours">
          <Spinner />
        </div>
      )}

      {!isLoading && (
        <label
          className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors duration-300"
          title="Changer la photo de profil">
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={onPhotoUpload}
            className="hidden"
            aria-label="Sélectionner une nouvelle photo de profil"
          />
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </label>
      )}
    </div>
  );
};

export default Avatar;
