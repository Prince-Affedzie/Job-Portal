import { FaLink, FaFilePdf, FaFileImage, FaFileAlt, FaTimes, FaFileWord, FaFileVideo, FaPlay, FaExternalLinkAlt, FaDownload, FaEye } from 'react-icons/fa';

const getFileType = (mediaUrl) => {
  if (/\.(jpg|jpeg|png|gif|webp)$/i.test(mediaUrl)) {
    return 'image';
  } else if (/\.(mp4|webm|mov|avi|wmv)$/i.test(mediaUrl)) {
    return 'video';
  } else if (/\.(pdf)$/i.test(mediaUrl)) {
    return 'pdf';
  } else if (/\.(doc|docx)$/i.test(mediaUrl)) {
    return 'document';
  } else {
    return 'other';
  }
};

const FilePreview = ({ file, index, total }) => {
  const fileType = getFileType(file.publicUrl || file.name);
  
  return (
    <div className="group relative bg-white border border-gray-200 rounded-md overflow-hidden hover:shadow-sm transition-all duration-200 hover:border-blue-300">
      <div className="w-full h-16 bg-gray-50 flex items-center justify-center overflow-hidden">
        {fileType === 'image' ? (
          <img 
            src={file.publicUrl} 
            alt={file.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              const parent = e.target.parentElement;
              parent.innerHTML = `
                <div class="w-full h-full flex items-center justify-center bg-gray-100">
                  <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                  </svg>
                </div>
              `;
            }}
          />
        ) : fileType === 'video' ? (
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <video 
              src={file.publicUrl}
              className="w-full h-full object-cover opacity-70"
              muted
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                <FaPlay className="text-gray-800 text-xs ml-0.5" />
              </div>
            </div>
          </div>
        ) : fileType === 'pdf' ? (
          <div className="flex items-center justify-center text-red-500">
            <FaFilePdf className="text-lg" />
          </div>
        ) : fileType === 'document' ? (
          <div className="flex items-center justify-center text-blue-600">
            <FaFileWord className="text-lg" />
          </div>
        ) : (
          <div className="flex items-center justify-center text-gray-500">
            <FaFileAlt className="text-lg" />
          </div>
        )}
      </div>
      
      {/* File info */}
      <div className="p-2 bg-white">
        <p className="text-xs text-gray-700 font-medium truncate">{file.name}</p>
      </div>
      
      {/* Hover actions */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex space-x-1">
          <button className="w-6 h-6 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200">
            <FaEye className="text-gray-700 text-xs" />
          </button>
          <button className="w-6 h-6 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200">
            <FaDownload className="text-gray-700 text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

const PortfolioPreview = ({ 
  portfolio, 
  onRemove, 
  isEditable = false 
}) => {
  const hasContent = portfolio.title || portfolio.description || portfolio.files?.length > 0 || portfolio.link;
  
  if (!hasContent) return null;

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-200">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            {portfolio.title && (
              <div className="flex items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900 flex-1 mr-4">
                  {portfolio.title}
                </h3>
                {portfolio.link && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaLink className="text-blue-600 text-sm" />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {portfolio.description && (
              <p className="text-gray-600 leading-relaxed mb-4">
                {portfolio.description}
              </p>
            )}
          </div>

          {isEditable && (
            <button 
              onClick={() => onRemove()}
              className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Remove portfolio item"
            >
              <FaTimes className="text-sm" />
            </button>
          )}
        </div>
      </div>

      {/* Link Preview */}
      {portfolio.link && (
        <div className="px-6 pb-4">
          <a 
            href={portfolio.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-lg transition-all duration-200 group/link"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <FaLink className="text-blue-600 text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {new URL(portfolio.link).hostname}
                  </span>
                  <FaExternalLinkAlt className="ml-2 text-blue-600 text-xs group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
                </div>
                <span className="text-xs text-gray-600">Visit project</span>
              </div>
            </div>
          </a>
        </div>
      )}

      {/* Files Preview */}
      {portfolio.files?.length > 0 && (
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900">
              Project Files
            </h4>
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
              {portfolio.files.length} {portfolio.files.length === 1 ? 'file' : 'files'}
            </span>
          </div>
          
          {/* Files Grid */}
          <div className={`grid gap-2 ${
            portfolio.files.length === 1 
              ? 'grid-cols-1 max-w-xs' 
              : portfolio.files.length === 2 
              ? 'grid-cols-2 max-w-md' 
              : portfolio.files.length <= 4
              ? 'grid-cols-2 sm:grid-cols-4'
              : 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6'
          }`}>
            {portfolio.files.slice(0, 12).map((file, index) => (
              <a
                key={index}
                href={file.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <FilePreview 
                  file={file} 
                  index={index}
                  total={portfolio.files.length}
                />
              </a>
            ))}
            
            {/* Show more indicator */}
            {portfolio.files.length > 12 && (
              <div className="h-16 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-gray-400">
                  +{portfolio.files.length - 12}
                </span>
                <span className="text-xs text-gray-500 font-medium">more</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!portfolio.title && !portfolio.description && !portfolio.files?.length && !portfolio.link && (
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaFileAlt className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No content available</p>
        </div>
      )}
    </div>
  );
};

export default PortfolioPreview;