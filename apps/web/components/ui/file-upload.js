'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUpload = void 0;
exports.GridPattern = GridPattern;
const utils_1 = require("@/lib/utils");
const react_1 = __importStar(require("react"));
const react_2 = require("motion/react");
const icons_react_1 = require("@tabler/icons-react");
const react_dropzone_1 = require("react-dropzone");
const image_1 = __importDefault(require("next/image"));
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
const FileUpload = ({ onChange, isImage = true, title, description, url, isLoading = false, }) => {
    const [files, setFiles] = (0, react_1.useState)([]);
    const [previewUrl, setPreviewUrl] = (0, react_1.useState)(url || null);
    const [isHovering, setIsHovering] = (0, react_1.useState)(false);
    const fileInputRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (url) {
            setPreviewUrl(url);
        }
    }, [url]);
    const handleFileChange = (newFiles) => {
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        if (isImage && newFiles?.[0]) {
            const file = newFiles[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
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
    const handleRemoveImage = (e) => {
        e.stopPropagation();
        setPreviewUrl(null);
        setFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onChange && onChange([]);
    };
    const { getRootProps, isDragActive } = (0, react_dropzone_1.useDropzone)({
        multiple: false,
        noClick: true,
        onDrop: handleFileChange,
        onDropRejected: (error) => {
            console.log(error);
        },
        disabled: isLoading,
    });
    const mainVariant = {
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 0.3,
                ease: 'easeInOut',
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
    const renderContent = () => {
        if (isLoading) {
            return (<react_2.motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-75"></div>
            <div className="relative rounded-full bg-blue-500 p-4">
              <icons_react_1.IconLoader2 className="h-8 w-8 animate-spin text-white"/>
            </div>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Chargement en cours...
          </p>
        </react_2.motion.div>);
        }
        if (previewUrl && isImage) {
            return (<react_2.motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative group/image" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
          <image_1.default src={previewUrl} alt="Upload preview" className="w-full max-h-80 rounded-lg object-cover shadow-lg" width={200} height={200}/>
          <react_2.AnimatePresence>
            {isHovering && (<react_2.motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={handleRemoveImage} className="absolute right-0 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg transition-colors hover:bg-red-600">
                <icons_react_1.IconX className="h-4 w-4"/>
              </react_2.motion.button>)}
          </react_2.AnimatePresence>
        </react_2.motion.div>);
        }
        return (<>
        {!files.length && (<react_2.motion.div layoutId="file-upload" variants={mainVariant} whileHover="animate" transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                }} className={(0, utils_1.cn)('relative z-40 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md bg-white group-hover/file:shadow-2xl dark:bg-neutral-900', 'shadow-[0px_10px_50px_rgba(0,0,0,0.1)]', isDragActive && 'bg-blue-50 dark:bg-blue-900/20')}>
            {isDragActive ? (<react_2.motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-neutral-600">
                Déposer
                <icons_react_1.IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400"/>
              </react_2.motion.p>) : (<react_2.motion.div animate={{
                        y: [0, -5, 0],
                    }} transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}>
                <icons_react_1.IconPhoto className="h-8 w-8 text-neutral-600 dark:text-neutral-400"/>
              </react_2.motion.div>)}
          </react_2.motion.div>)}

        {!files.length && (<react_2.motion.div variants={secondaryVariant} animate="animate" className="absolute inset-0 z-30 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md border border-dashed border-sky-400 bg-transparent"/>)}
      </>);
    };
    return (<div className="w-full" {...getRootProps()}>
      <react_2.motion.div onClick={handleClick} whileHover={!isLoading && !previewUrl ? 'animate' : undefined} className={(0, utils_1.cn)('group/file relative block w-full cursor-pointer overflow-hidden rounded-lg', isLoading && 'cursor-wait opacity-70', previewUrl && 'cursor-pointer')}>
        <input ref={fileInputRef} id="file-upload-handle" type="file" accept={isImage ? 'image/*' : '*/*'} className="hidden" onChange={(e) => handleFileChange(Array.from(e.target.files || []))} disabled={isLoading}/>

        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>

        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans text-base font-bold text-neutral-700 dark:text-neutral-300">
            {title}
          </p>
          {description && (<p className="relative z-20 mt-2 font-sans text-base font-normal text-neutral-400 dark:text-neutral-400">
              {description}
            </p>)}

          <div className="relative mx-auto mt-10 w-full max-w-xl">
            <react_2.AnimatePresence mode="wait">{renderContent()}</react_2.AnimatePresence>

            
            {files.length > 0 && !previewUrl && (<react_2.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                {files.map((file, idx) => (<react_2.motion.div key={'file' + idx} layoutId={idx === 0 ? 'file-upload' : 'file-upload-' + idx} className={(0, utils_1.cn)('relative z-40 mx-auto mt-4 flex w-full flex-col items-start justify-start overflow-hidden rounded-md bg-white p-4 md:h-24 dark:bg-neutral-900', 'shadow-sm')}>
                    <div className="flex w-full items-center justify-between gap-4">
                      <react_2.motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout className="max-w-xs truncate text-base text-neutral-700 dark:text-neutral-300">
                        {file.name}
                      </react_2.motion.p>
                      <react_2.motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout className="shadow-input w-fit shrink-0 rounded-lg px-2 py-1 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </react_2.motion.p>
                    </div>

                    <div className="mt-2 flex w-full flex-col items-start justify-between text-sm text-neutral-600 md:flex-row md:items-center dark:text-neutral-400">
                      <react_2.motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout className="rounded-md bg-gray-100 px-1 py-0.5 dark:bg-neutral-800">
                        {file.type}
                      </react_2.motion.p>

                      <react_2.motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
                        modifié le{' '}
                        {new Date(file.lastModified).toLocaleDateString()}
                      </react_2.motion.p>
                    </div>
                  </react_2.motion.div>))}
              </react_2.motion.div>)}
          </div>
        </div>
      </react_2.motion.div>
    </div>);
};
exports.FileUpload = FileUpload;
function GridPattern() {
    const columns = 41;
    const rows = 11;
    return (<div className="flex shrink-0 scale-105 flex-wrap items-center justify-center gap-x-px gap-y-px bg-gray-100 dark:bg-neutral-900">
      {Array.from({ length: rows }).map((_, row) => Array.from({ length: columns }).map((_, col) => {
            const index = row * columns + col;
            return (<div key={`${col}-${row}`} className={`flex h-10 w-10 shrink-0 rounded-[2px] ${index % 2 === 0
                    ? 'bg-gray-50 dark:bg-neutral-950'
                    : 'bg-gray-50 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:bg-neutral-950 dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]'}`}/>);
        }))}
    </div>);
}
//# sourceMappingURL=file-upload.js.map