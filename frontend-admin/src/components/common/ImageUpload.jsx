import { useState, useRef } from 'react';

const ImageUpload = ({ onUploadSuccess, multiple = false, existingImages = [] }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const formData = new FormData();

      if (multiple) {
        // Multiple file upload
        Array.from(files).forEach(file => {
          formData.append('files', file);
        });

        const response = await fetch('/api/upload/tour-images', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('bt-admin-token') || ''}`,
          },
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();

        if (data.imageUrls && data.imageUrls.length > 0) {
          onUploadSuccess(data.imageUrls);
          alert(`Uploaded ${data.successCount} image(s) successfully!${data.errorCount > 0 ? ` ${data.errorCount} failed.` : ''}`);
        } else {
          throw new Error('No images uploaded');
        }
      } else {
        // Single file upload
        formData.append('file', files[0]);

        const response = await fetch('/api/upload/tour-image', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('bt-admin-token') || ''}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const data = await response.json();
        setPreview(data.imageUrl);
        onUploadSuccess(data.imageUrl);
        alert('Upload successful!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    handleFileChange(files);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-slate-300 hover:border-primary-400 bg-slate-50'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!uploading ? handleButtonClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          multiple={multiple}
          onChange={handleInputChange}
          disabled={uploading}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-sm text-slate-600">Đang upload...</p>
          </div>
        ) : (
          <>
            <svg
              className="mx-auto h-12 w-12 text-slate-400 mb-4"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm text-slate-600 font-medium mb-1">
              Click để chọn ảnh hoặc kéo thả vào đây
            </p>
            <p className="text-xs text-slate-500">
              PNG, JPG, JPEG, WEBP (tối đa 5MB)
            </p>
            {multiple && (
              <p className="text-xs text-slate-500 mt-1">
                Có thể chọn nhiều ảnh cùng lúc
              </p>
            )}
          </>
        )}
      </div>

      {/* Preview for Single Upload */}
      {!multiple && preview && (
        <div className="relative rounded-lg overflow-hidden border border-slate-200">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <button
            onClick={clearPreview}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
            type="button"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Existing Images Preview (for multiple) */}
      {multiple && existingImages.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">
            Ảnh hiện tại ({existingImages.length})
          </p>
          <div className="grid grid-cols-3 gap-4">
            {existingImages.map((imgUrl, idx) => (
              <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={imgUrl}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-32 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          <strong>Lưu ý:</strong> Ảnh sẽ được tự động tối ưu kích thước và chất lượng khi upload.
          Chỉ chấp nhận file ảnh định dạng PNG, JPG, JPEG, WEBP với dung lượng tối đa 5MB.
        </p>
      </div>
    </div>
  );
};

export default ImageUpload;
