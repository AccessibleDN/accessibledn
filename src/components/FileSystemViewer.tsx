import React, { useCallback } from 'react';
import { useQuery } from "@tanstack/react-query";
import { FaFileAlt, FaFilePdf, FaFolder, FaChartBar } from 'react-icons/fa';
import { SiJavascript, SiTypescript, SiCss3, SiHtml5, SiJson } from 'react-icons/si';
import { BsFiletypeJpg, BsFiletypePng, BsFiletypeGif, BsFiletypeSvg } from 'react-icons/bs';
import { IMapper } from '~/utils/cdnmapper';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import NavLink from './NavLink';

const MIME_TYPES = {
  txt: 'text/plain',
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  json: 'application/json',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  pdf: 'application/pdf'
} as const;

const FILE_ICONS = {
  jpg: <BsFiletypeJpg />,
  jpeg: <BsFiletypeJpg />,
  png: <BsFiletypePng />,
  gif: <BsFiletypeGif />,
  svg: <BsFiletypeSvg />,
  pdf: <FaFilePdf />,
  txt: <FaFileAlt />,
  js: <SiJavascript />,
  ts: <SiTypescript />,
  tsx: <SiTypescript />,
  jsx: <SiJavascript />,
  css: <SiCss3 />,
  html: <SiHtml5 />,
  json: <SiJson />
} as const;

const DEFAULT_FILE_ICON = <FaFileAlt />;
const FOLDER_ICON = <FaFolder />;

const LoadingCard = React.memo(() => (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 animate-pulse border border-white/20">
    <div className="h-7 w-32 bg-white/20 rounded-lg mb-3"></div>
    <div className="h-5 w-24 bg-white/20 rounded-lg"></div>
  </div>
));

const formatFileSize = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

const getFileIcon = (fileName: string, isDirectory: boolean) => {
  if (isDirectory) return FOLDER_ICON;
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? FILE_ICONS[extension as keyof typeof FILE_ICONS] || DEFAULT_FILE_ICON : DEFAULT_FILE_ICON;
};

const FileItem = React.memo(({ file, index, onClick }: { 
  file: IMapper<boolean>, 
  index: number, 
  onClick: () => void 
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    transition={{ duration: 0.2, delay: index * 0.03 }}
    onClick={onClick}
    className="p-4 rounded-xl flex items-center gap-4 cursor-pointer 
               bg-white/10 backdrop-blur-lg
               hover:bg-white/20
               transition-all duration-200 shadow-sm hover:shadow-md"
  >
    <span className="text-gray-300 text-2xl">
      {getFileIcon(file.name, file.isDirectory)}
    </span>
    <div className="flex-1 min-w-0">
      <p className="font-semibold truncate text-white">
        {file.name}
      </p>
      <p className="text-sm text-gray-300 font-medium">
        {file.isDirectory ? 'Folder' : formatFileSize(file.size)}
      </p>
    </div>
  </motion.div>
));

const FileSystemViewer: React.FC<{ path: string[] }> = ({ path }) => {
  const router = useRouter();

  const { data: files, error, isLoading } = useQuery<IMapper<boolean>[]>({
    queryKey: ['filesystem', path],
    queryFn: async () => {
      const res = await fetch(`/api/filesystem/${path.join('/')}`);
      if (!res.ok) throw new Error('Failed to fetch files');
      return res.json();
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const sortedFiles = React.useMemo(() => 
    files?.sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
      return a.name.localeCompare(b.name);
    }), 
    [files]
  );

  const handleFileClick = useCallback(async (file: IMapper<boolean>) => {
    if (file.isDirectory) {
      router.push(`/filesystem/${[...path, file.name].join('/')}`);
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    const mimeType = extension && extension in MIME_TYPES 
      ? MIME_TYPES[extension as keyof typeof MIME_TYPES]
      : 'application/octet-stream';
      
    const content = file.content instanceof Buffer ? file.content : new TextEncoder().encode(file.content as string);
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }, [path, router]);

  if (error) {
    return (
      <div className="text-red-400 p-6 rounded-2xl bg-red-900/20 backdrop-blur-lg border border-red-800">
        {error instanceof Error ? error.message : 'An error occurred'}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 backdrop-blur-sm min-h-screen flex gap-6">
      <motion.aside 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-72 bg-white/10 p-5 rounded-2xl shadow-xl"
      >
        <nav className="space-y-2.5">
          <NavLink href="/filesystem" icon={FaFolder}>Files</NavLink>
          <NavLink href="/analytics" icon={FaChartBar}>Analytics</NavLink>
        </nav>
      </motion.aside>
      <main className="flex-1 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl sm:text-5xl font-bold tracking-tight text-white"
              >
                Files
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-gray-400"
              >
                Browse and manage your CDN files
              </motion.p>
            </div>
          </div>

          <LayoutGroup>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {sortedFiles?.map((file, index) => (
                  <FileItem 
                    key={file.name}
                    file={file}
                    index={index}
                    onClick={() => handleFileClick(file)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </LayoutGroup>
        </motion.div>
      </main>
    </div>
  );
};

export default React.memo(FileSystemViewer);
