'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Card, Badge, Button, Spinner } from '@/components/ui';
import { 
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  File,
  Image as ImageIcon,
  Download,
  Trash2,
  Eye
} from 'lucide-react';

interface Document {
  id: string;
  type: string;
  fileName: string;
  fileSize: number;
  filePath: string;
  status: string;
  participantId: string | null;
  participant: {
    id: string;
    fullName: string;
    relationship: string;
  } | null;
  uploadedAt: string;
  verifiedAt: string | null;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const DOCUMENT_TYPES = [
  { value: 'PASSPORT', label: 'Passport' },
  { value: 'NATIONAL_ID', label: 'National ID Card' },
  { value: 'BIRTH_CERTIFICATE', label: 'Birth Certificate' },
  { value: 'IMMIGRATION_DOCUMENT', label: 'Immigration Document' },
  { value: 'COURT_ORDER', label: 'Court Order' },
  { value: 'MEDICAL_RECORD', label: 'Medical Record' },
  { value: 'CONSENT_FORM', label: 'Consent Form' },
  { value: 'OTHER', label: 'Other Document' },
];

export default function DocumentsPage() {
  const params = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState('PASSPORT');
  const [caseNumber, setCaseNumber] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchDocuments();
      fetchCaseInfo();
    }
  }, [params.id]);

  const fetchCaseInfo = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return;
      }

      const response = await fetch(`/api/cases/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setCaseNumber(result.data.caseNumber);
      }
    } catch (err) {
      console.error('Failed to fetch case info:', err);
    }
  };

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setError('Please log in to view documents');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/cases/${params.id}/documents`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (result.success) {
        setDocuments(result.data);
      } else {
        setError(result.error || 'Failed to load documents');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Documents fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        alert(`File type not supported: ${file.name}. Please upload PDF or image files.`);
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        alert(`File too large: ${file.name}. Maximum size is 10MB.`);
        return;
      }

      // Add to uploading queue
      const uploadingFile: UploadingFile = {
        id: Math.random().toString(36).substring(7),
        file,
        progress: 0,
        status: 'uploading',
      };

      setUploadingFiles(prev => [...prev, uploadingFile]);
      uploadFile(uploadingFile);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async (uploadingFile: UploadingFile) => {
    try {
      // Simulate file upload with progress
      // In production, this would use a proper file upload service
      // with chunked upload and progress tracking
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadingFiles(prev =>
          prev.map(f =>
            f.id === uploadingFile.id && f.progress < 90
              ? { ...f, progress: f.progress + 10 }
              : f
          )
        );
      }, 200);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearInterval(progressInterval);

      // In production, the file would be uploaded to cloud storage (S3, etc.)
      // and the path would be returned. For now, we'll use a mock path
      const mockFilePath = `/uploads/${params.id}/${uploadingFile.file.name}`;

      // Create document record
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/cases/${params.id}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: selectedDocumentType,
          fileName: uploadingFile.file.name,
          fileSize: uploadingFile.file.size,
          filePath: mockFilePath,
          participantId: null, // Could be selected from a dropdown
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update uploading file status
        setUploadingFiles(prev =>
          prev.map(f =>
            f.id === uploadingFile.id
              ? { ...f, progress: 100, status: 'success' }
              : f
          )
        );

        // Refresh documents list
        fetchDocuments();

        // Remove from uploading list after delay
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f.id !== uploadingFile.id));
        }, 2000);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadingFiles(prev =>
        prev.map(f =>
          f.id === uploadingFile.id
            ? { ...f, status: 'error', error: 'Upload failed. Please try again.' }
            : f
        )
      );
    }
  };

  const removeUploadingFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; icon: any }> = {
      PENDING: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
      VERIFIED: { label: 'Verified', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
      REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle },
    };
    return configs[status] || configs.PENDING;
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension || '')) {
      return ImageIcon;
    }
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Loading documents...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <Container>
          {/* Back Button */}
          <div className="mb-6">
            <Link href={`/dashboard/cases/${params.id}`}>
              <Button variant="outline" size="sm" className="group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Case
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-navy-900">
                  Document Management
                </h1>
                {caseNumber && (
                  <p className="text-gray-600 mt-1">
                    Case: <span className="font-mono font-semibold text-navy-900">{caseNumber}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-white border border-blue-300 rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy-900 mb-1">
                    Secure Document Upload
                  </p>
                  <p className="text-sm text-gray-700">
                    Accepted formats: PDF, JPG, PNG. Maximum file size: 10MB. All documents are encrypted and stored securely.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Upload Section */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-navy-900">Upload Document</h2>
                </div>
                <div className="p-6 space-y-4">
                  {/* Document Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document Type
                    </label>
                    <select
                      value={selectedDocumentType}
                      onChange={(e) => setSelectedDocumentType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      {DOCUMENT_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Upload Area */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-teal-500 hover:bg-teal-50 transition-all cursor-pointer group"
                  >
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-teal-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-navy-900 mb-2">
                      Click to upload
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      or drag and drop files here
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* Requirements */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-sm font-semibold text-navy-900 mb-2">
                      Required Documents
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Valid government-issued ID for each participant</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Birth certificate for minors</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Immigration documents if applicable</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Documents List */}
            <div className="lg:col-span-2 space-y-6">
              {/* Uploading Files */}
              {uploadingFiles.length > 0 && (
                <Card>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-navy-900">Uploading...</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {uploadingFiles.map(file => {
                      const FileIcon = getFileIcon(file.file.name);
                      return (
                        <div key={file.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-navy-900 truncate mb-1">
                                {file.file.name}
                              </h3>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm text-gray-600">
                                  {formatFileSize(file.file.size)}
                                </span>
                                {file.status === 'uploading' && (
                                  <span className="text-sm text-blue-600 font-medium">
                                    {file.progress}%
                                  </span>
                                )}
                                {file.status === 'success' && (
                                  <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" />
                                    Complete
                                  </span>
                                )}
                                {file.status === 'error' && (
                                  <span className="text-sm text-red-600 font-medium">
                                    {file.error}
                                  </span>
                                )}
                              </div>
                              {file.status === 'uploading' && (
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                                    style={{ width: `${file.progress}%` }}
                                  />
                                </div>
                              )}
                            </div>
                            {file.status === 'error' && (
                              <button
                                onClick={() => removeUploadingFile(file.id)}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                              >
                                <X className="w-5 h-5 text-gray-600" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

              {/* Uploaded Documents */}
              <Card>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-navy-900">
                      Uploaded Documents ({documents.length})
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  {documents.length > 0 ? (
                    <div className="space-y-4">
                      {documents.map(doc => {
                        const statusConfig = getStatusConfig(doc.status);
                        const StatusIcon = statusConfig.icon;
                        const FileIcon = getFileIcon(doc.fileName);

                        return (
                          <div key={doc.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all group">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileIcon className="w-6 h-6 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-navy-900 truncate mb-1">
                                      {doc.fileName}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                      <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                                        {DOCUMENT_TYPES.find(t => t.value === doc.type)?.label || doc.type}
                                      </Badge>
                                      <span>•</span>
                                      <span>{formatFileSize(doc.fileSize)}</span>
                                      {doc.participant && (
                                        <>
                                          <span>•</span>
                                          <span>{doc.participant.fullName}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <Badge className={statusConfig.color}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusConfig.label}
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    Uploaded {new Date(doc.uploadedAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}
                                  </span>
                                  {doc.verifiedAt && (
                                    <>
                                      <span>•</span>
                                      <span>
                                        Verified {new Date(doc.verifiedAt).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                        })}
                                      </span>
                                    </>
                                  )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="outline" size="sm" className="text-xs">
                                    <Eye className="w-3 h-3 mr-1" />
                                    View
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-xs">
                                    <Download className="w-3 h-3 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-navy-900 mb-2">No Documents Yet</h3>
                      <p className="text-gray-600 mb-6">
                        Upload your first document to get started
                      </p>
                      <Button 
                        variant="primary" 
                        onClick={() => fileInputRef.current?.click()}
                        className="group"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
