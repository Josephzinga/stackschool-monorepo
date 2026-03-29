'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { IconLoader2, IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { useDropzone } from 'react-dropzone';
import { Easing } from 'motion';
import Image from 'next/image';

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
  isImage = true,
  title,
  description,
  url,
  isLoading = false,
}: {
  onChange?: (files: File[]) => void;
  isImage?: boolean;
  title: string;
  description?: string;
  url?: string;
  isLoading?: boolean;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(url || null);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mettre à jour previewUrl quand url change
  useEffect(() => {
    if (url) {
      setPreviewUrl(url);
    }
  }, [url]);
  const handleFileChange = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    // Créer une preview pour l'image
    if (isImage && newFiles?.[0]) {
      const file = newFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    onChange && onChange(newFiles);
  };

  const handleClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onChange && onChange([]);
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
    disabled: isLoading,
  });

  // Variants d'animation
  const mainVariant = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.3,
        ease: 'easeInOut' as Easing,
      },
    },
  };

  const secondaryVariant = {
    animate: {
      opacity: [0, 0.5, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Rendu conditionnel du contenu principal
  const renderContent = () => {
    // État de chargement
    if (isLoading) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex flex-col items-center justify-center gap-4"
        >
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-75"></div>
            <div className="relative rounded-full bg-blue-500 p-4">
              <IconLoader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Chargement en cours...
          </p>
        </motion.div>
      );
    }

    // Affichage de l'image si URL ou preview disponible
    if (previewUrl && isImage) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative group/image"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Image
            src={previewUrl}
            alt="Upload preview"
            className="w-full max-h-80 rounded-lg object-cover shadow-lg"
            width={200}
            height={200}
          />
          <AnimatePresence>
            {isHovering && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleRemoveImage}
                className="absolute right-0 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg transition-colors hover:bg-red-600"
              >
                <IconX className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      );
    }

    // Affichage par défaut avec l'icône et l'animation
    return (
      <>
        {!files.length && (
          <motion.div
            layoutId="file-upload"
            variants={mainVariant}
            whileHover="animate"
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
            className={cn(
              'relative z-40 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md bg-white group-hover/file:shadow-2xl dark:bg-neutral-900',
              'shadow-[0px_10px_50px_rgba(0,0,0,0.1)]',
              isDragActive && 'bg-blue-50 dark:bg-blue-900/20',
            )}
          >
            {isDragActive ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center text-neutral-600"
              >
                Déposer
                <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              </motion.p>
            ) : (
              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <IconPhoto className="h-8 w-8 text-neutral-600 dark:text-neutral-400" />
              </motion.div>
            )}
          </motion.div>
        )}

        {!files.length && (
          <motion.div
            variants={secondaryVariant}
            animate="animate"
            className="absolute inset-0 z-30 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md border border-dashed border-sky-400 bg-transparent"
          />
        )}
      </>
    );
  };

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover={!isLoading && !previewUrl ? 'animate' : undefined}
        className={cn(
          'group/file relative block w-full cursor-pointer overflow-hidden rounded-lg',
          isLoading && 'cursor-wait opacity-70',
          previewUrl && 'cursor-pointer',
        )}
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept={isImage ? 'image/*' : '*/*'}
          className="hidden"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          disabled={isLoading}
        />

        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>

        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans text-base font-bold text-neutral-700 dark:text-neutral-300">
            {title}
          </p>
          {description && (
            <p className="relative z-20 mt-2 font-sans text-base font-normal text-neutral-400 dark:text-neutral-400">
              {description}
            </p>
          )}

          <div className="relative mx-auto mt-10 w-full max-w-xl">
            <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>

            {/* Affichage des fichiers sélectionnés */}
            {files.length > 0 && !previewUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {files.map((file, idx) => (
                  <motion.div
                    key={'file' + idx}
                    layoutId={idx === 0 ? 'file-upload' : 'file-upload-' + idx}
                    className={cn(
                      'relative z-40 mx-auto mt-4 flex w-full flex-col items-start justify-start overflow-hidden rounded-md bg-white p-4 md:h-24 dark:bg-neutral-900',
                      'shadow-sm',
                    )}
                  >
                    <div className="flex w-full items-center justify-between gap-4">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="max-w-xs truncate text-base text-neutral-700 dark:text-neutral-300"
                      >
                        {file.name}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="shadow-input w-fit shrink-0 rounded-lg px-2 py-1 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white"
                      >
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </motion.p>
                    </div>

                    <div className="mt-2 flex w-full flex-col items-start justify-between text-sm text-neutral-600 md:flex-row md:items-center dark:text-neutral-400">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="rounded-md bg-gray-100 px-1 py-0.5 dark:bg-neutral-800"
                      >
                        {file.type}
                      </motion.p>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                      >
                        modifié le{' '}
                        {new Date(file.lastModified).toLocaleDateString()}
                      </motion.p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex shrink-0 scale-105 flex-wrap items-center justify-center gap-x-px gap-y-px bg-gray-100 dark:bg-neutral-900">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`flex h-10 w-10 shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? 'bg-gray-50 dark:bg-neutral-950'
                  : 'bg-gray-50 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:bg-neutral-950 dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]'
              }`}
            />
          );
        }),
      )}
    </div>
  );
}
