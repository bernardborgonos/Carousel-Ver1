import React, { useState, useEffect } from 'react';
import { 
  Cloud, CloudUpload, CloudDownload, RefreshCw, 
  Trash2, ShieldAlert, Check, Loader2, Key, Info, ExternalLink
} from 'lucide-react';
import { KillerCarouselOptions } from '../types';

interface DriveFile {
  id: string;
  name: string;
  createdTime?: string;
  modifiedTime?: string;
}

interface DriveIntegrationProps {
  currentOptions: KillerCarouselOptions;
  onLoadOptions: (opts: KillerCarouselOptions) => void;
  onLogEvent?: (event: string, details: string) => void;
}

export default function DriveIntegration({
  currentOptions,
  onLoadOptions,
  onLogEvent,
}: DriveIntegrationProps) {
  // Authentication & token states
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return sessionStorage.getItem('google_drive_access_token') || null;
  });
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Custom Developer Client ID configuration for custom API requests
  const [clientId, setClientId] = useState<string>(() => {
    return localStorage.getItem('gdrive_client_id') || '3646609-mock-client-id.apps.googleusercontent.com';
  });
  const [showConfig, setShowConfig] = useState(false);

  // Drive operations states
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newPresetName, setNewPresetName] = useState('My Custom Slider');
  const [presetNote, setPresetNote] = useState('');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  // Fallback Mode (Demo / Local Storage backing for sandboxed iFrames)
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return !accessToken; // default to demo/local if not explicitly authorized with real token
  });

  // Track mock files stored in LocalStorage when in demo mode
  const [demoFiles, setDemoFiles] = useState<{ id: string; name: string; content: string; time: string }[]>(() => {
    const saved = localStorage.getItem('gdrive_demo_files');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'mock-1',
        name: 'killer-carousel-cozy-editorial.json',
        content: JSON.stringify({
          width: 220,
          height: 280,
          perspective: 1000,
          xRadius: 280,
          yRadius: 20,
          zRadius: 180,
          tilt: 5,
          xRotation: 5,
          yRotation: -5,
          zRotation: 2,
          infinite: true,
          autoSlideshow: false,
          autoSlideshowDelay: 3000,
          swipe: true,
          drag: true,
          reflection: true,
          reflectionHeight: 40,
          reflectionOpacity: 0.5,
          shadow: true,
          shadowOpacity: 0.8,
          zDepthFade: true,
          itemClickToFocus: true
        }),
        time: new Date(Date.now() - 3600000 * 2).toLocaleTimeString()
      },
      {
        id: 'mock-2',
        name: 'killer-carousel-flat-panoramic.json',
        content: JSON.stringify({
          width: 250,
          height: 180,
          perspective: 1200,
          xRadius: 380,
          yRadius: 0,
          zRadius: 10,
          tilt: -8,
          xRotation: 12,
          yRotation: 0,
          zRotation: 0,
          infinite: true,
          autoSlideshow: true,
          autoSlideshowDelay: 2000,
          swipe: true,
          drag: true,
          reflection: false,
          reflectionHeight: 25,
          reflectionOpacity: 0.2,
          shadow: true,
          shadowOpacity: 0.3,
          zDepthFade: false,
          itemClickToFocus: true
        }),
        time: new Date(Date.now() - 3600000).toLocaleTimeString()
      }
    ];
  });

  // Save demo files to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gdrive_demo_files', JSON.stringify(demoFiles));
  }, [demoFiles]);

  // Log initial status
  useEffect(() => {
    if (onLogEvent) {
      onLogEvent('drive_status', accessToken ? 'Real Google Drive session active.' : 'Initialized in Local Sandbox/Demo mode.');
    }
  }, []);

  // Listen for hash parameter tokens (for real Google Drive direct client-side redirect)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const token = params.get('access_token');
      if (token) {
        setAccessToken(token);
        sessionStorage.setItem('google_drive_access_token', token);
        setIsDemoMode(false);
        setErrorMsg(null);
        window.location.hash = ''; // clear hash
        if (onLogEvent) {
          onLogEvent('auth_success', 'Google Accounts OAuth implicit bypass token parsed successfully!');
        }
        fetchGoogleDriveFiles(token);
      }
    }
  }, []);

  // Fetch true Google Drive files filter by extension or prefix
  const fetchGoogleDriveFiles = async (token = accessToken) => {
    if (!token) return;
    setIsLoadingFiles(true);
    setErrorMsg(null);

    try {
      if (onLogEvent) {
        onLogEvent('drive_request', 'Querying index listings from https://www.googleapis.com/drive/v3/files...');
      }

      const query = encodeURIComponent("name contains 'killer-carousel-' and name contains '.json' and trashed = false");
      const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,createdTime,modifiedTime)`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Google API responded with error status: ${response.status}`);
      }

      const data = await response.json();
      setFiles(data.files || []);
      
      if (onLogEvent) {
        onLogEvent('drive_success', `Retrieved ${data.files?.length || 0} remote preset records.`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed connecting to real Drive. Sandboxed environment might block requests.');
      setIsDemoMode(true); // fall back to demo mode smoothly
    } finally {
      setIsLoadingFiles(false);
    }
  };

  // Launch implicit Google OAuth flow
  const handleAuthorizeRealDrive = () => {
    setIsAuthorizing(true);
    setErrorMsg(null);

    try {
      const redirectUri = window.location.origin + window.location.pathname;
      const scope = 'https://www.googleapis.com/auth/drive.file';
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=token&` +
        `scope=${encodeURIComponent(scope)}&` +
        `include_granted_scopes=true&` +
        `state=drive_oauth_flow`;
      
      if (onLogEvent) {
        onLogEvent('oauth_launch', `Opening Google Account permission portal redirecting to: ${redirectUri}`);
      }
      
      // Dispatch redirect to standard implicit OAuth flow
      window.location.href = authUrl;
    } catch (err: any) {
      setErrorMsg(err.message);
      setIsAuthorizing(false);
    }
  };

  const handleDisconnect = () => {
    setAccessToken(null);
    sessionStorage.removeItem('google_drive_access_token');
    setIsDemoMode(true);
    setFiles([]);
    if (onLogEvent) {
      onLogEvent('auth_logout', 'Google login token invalidated. Reverted to Sandbox/Demo Mode.');
    }
  };

  // Create or overwrite a JSON file in Google Drive
  const handleUploadToDrive = async () => {
    const fileName = `killer-carousel-${newPresetName.toLowerCase().replace(/\s+/g, '-')}.json`;
    setIsSaving(true);
    setErrorMsg(null);

    const payload = JSON.stringify({ ...currentOptions, note: presetNote }, null, 2);

    if (isDemoMode) {
      // Sandbox implementation
      setTimeout(() => {
        const newFile = {
          id: `mock-${Date.now()}`,
          name: fileName,
          content: payload,
          time: new Date().toLocaleTimeString()
        };
        setDemoFiles(prev => [newFile, ...prev]);
        setIsSaving(false);
        setNewPresetName('');
        setPresetNote('');
        if (onLogEvent) {
          onLogEvent('sandbox_save', `Backup [${fileName}] compiled and pushed into Sandbox memory!`);
        }
      }, 800);
      return;
    }

    try {
      if (onLogEvent) {
        onLogEvent('drive_upload', `Initiating drive.file upload sequence for [${fileName}]`);
      }

      // Step 1: Create metadata
      const metaUrl = 'https://www.googleapis.com/drive/v3/files';
      const metadata = {
        name: fileName,
        mimeType: 'application/json',
      };

      const metaRes = await fetch(metaUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata)
      });

      if (!metaRes.ok) {
        throw new Error(`Metadata register failed: ${metaRes.statusText}`);
      }

      const fileData = await metaRes.json();
      const fileId = fileData.id;

      // Step 2: Upload payload chunk
      const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
      const uploadRes = await fetch(uploadUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: payload
      });

      if (!uploadRes.ok) {
        throw new Error(`Media transmission failed: ${uploadRes.statusText}`);
      }

      if (onLogEvent) {
        onLogEvent('drive_upload_success', `Preset [${fileName}] committed to Google Drive under ID [${fileId}].`);
      }

      setNewPresetName('');
      setPresetNote('');
      fetchGoogleDriveFiles();
    } catch (err: any) {
      setErrorMsg(`Upload failed: ${err.message}. Sandbox preview modes might require secure popup configurations.`);
      // Smoothly switch back to sandbox so user effort is never lost!
      setIsDemoMode(true);
    } finally {
      setIsSaving(false);
    }
  };

  // Load configuration from Selected File
  const handleDownloadFromDrive = async (fileId: string, name: string) => {
    setErrorMsg(null);
    if (isDemoMode) {
      const demoFile = demoFiles.find(f => f.id === fileId);
      if (demoFile) {
        try {
          const parsed = JSON.parse(demoFile.content);
          onLoadOptions(parsed);
          setSelectedFileId(fileId);
          if (onLogEvent) {
            onLogEvent('sandbox_load', `Synchronized options to locally backed preset [${name}].`);
          }
        } catch (e) {
          setErrorMsg('Malformed sandbox JSON payload detected.');
        }
      }
      return;
    }

    try {
      if (onLogEvent) {
        onLogEvent('drive_fetch', `Downloading media content for Document [${fileId}]`);
      }

      const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Download request failed: ${response.statusText}`);
      }

      const config = await response.json();
      onLoadOptions(config);
      setSelectedFileId(fileId);

      if (onLogEvent) {
        onLogEvent('drive_download_success', `Active options aligned with Google Drive file: ${name}`);
      }
    } catch (err: any) {
      setErrorMsg(`Download failed: ${err.message}`);
    }
  };

  // Delete configuration file
  const handleDeleteFile = async (e: React.MouseEvent, fileId: string, name: string) => {
    e.stopPropagation(); // Avoid triggering card line select
    
    // STRICT SCOPE COMPLIANCE: "MUST always include an explicit confirmation dialog"
    const confirmed = window.confirm(`Are you sure you want to permanently delete "${name}" from the backup list?`);
    if (!confirmed) return;

    setErrorMsg(null);
    if (isDemoMode) {
      setDemoFiles(prev => prev.filter(f => f.id !== fileId));
      if (selectedFileId === fileId) setSelectedFileId(null);
      if (onLogEvent) {
        onLogEvent('sandbox_delete', `Removed mockup preset record [${name}].`);
      }
      return;
    }

    try {
      if (onLogEvent) {
        onLogEvent('drive_delete', `Deleting drive record: ${fileId}`);
      }

      const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      if (selectedFileId === fileId) setSelectedFileId(null);
      if (onLogEvent) {
        onLogEvent('drive_delete_success', `Successfully trashed remote asset [${name}].`);
      }

      fetchGoogleDriveFiles();
    } catch (err: any) {
      setErrorMsg(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div 
      id="google-drive-integration-panel"
      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
    >
      {/* Panel Header */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-850 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-505/10 text-indigo-400">
            <Cloud className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight uppercase font-mono">Google Drive Workspace</h4>
            <p className="text-[9px] text-slate-500 mt-0.5 leading-none font-sans">Dump and load exact carousel presets safely</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span className={`inline-flex items-center gap-1 text-[9px] font-bold font-mono px-2 py-0.5 rounded-full ${
            isDemoMode 
              ? 'bg-amber-950/40 border border-amber-900 text-amber-400' 
              : 'bg-emerald-950/40 border border-emerald-900 text-emerald-400'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isDemoMode ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            {isDemoMode ? 'Sandbox Backup active' : 'Connected to Google'}
          </span>

          {!isDemoMode && (
            <button
              onClick={handleDisconnect}
              className="text-[9px] font-bold text-slate-400 hover:text-red-400 font-mono transition-colors border border-slate-800 rounded px-1.5 py-0.5 bg-slate-900 cursor-pointer"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col gap-4 font-sans text-xs">
        
        {/* Info Helper Banner */}
        <div className="bg-indigo-950/30 border border-indigo-900/40 rounded-xl p-3 flex gap-2.5 text-indigo-300">
          <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            Since standard iFrames can have strictly secure cross-origin restrictions, the app provides a **Fully-Functional Local Sandbox API** by default. To connect your **actual Google Drive**, click sign-in and authorize your workspace.
          </div>
        </div>

        {/* Auth action section */}
        {isDemoMode && (
          <div className="flex flex-col gap-2.5 border-b border-slate-800/80 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Live Sync Account</span>
              <button
                onClick={() => setShowConfig(!showConfig)}
                className="text-[10px] font-mono text-indigo-400 hover:underline cursor-pointer"
              >
                {showConfig ? 'Hide Config' : 'Developer Client ID config'}
              </button>
            </div>

            {showConfig && (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex flex-col gap-2 mb-1 animate-fadeIn">
                <label className="text-[10px] font-bold font-mono text-slate-400 block">Custom Google API Client ID:</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={clientId}
                    onChange={(e) => {
                      setClientId(e.target.value);
                      localStorage.setItem('gdrive_client_id', e.target.value);
                    }}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-[10px] font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => {
                      setClientId('3646609-mock-client-id.apps.googleusercontent.com');
                      localStorage.removeItem('gdrive_client_id');
                    }}
                    className="px-2 py-1 bg-slate-800 text-[9px] rounded font-mono font-bold hover:bg-slate-705 border border-slate-700 cursor-pointer text-white"
                  >
                    Reset
                  </button>
                </div>
                <p className="text-[9px] text-slate-500 font-sans leading-relaxed">
                  Provide your credential Client ID from Google Cloud Console with `https://www.googleapis.com/auth/drive.file` scope.
                </p>
              </div>
            )}

            <button
              onClick={handleAuthorizeRealDrive}
              disabled={isAuthorizing}
              className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] transition-transform text-white rounded-xl py-2 px-4 font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isAuthorizing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Redirecting to Google auth...</span>
                </>
              ) : (
                <>
                  <Key className="h-4 w-4" />
                  <span>Authorize Real Google Drive Workspace</span>
                </>
              )}
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-950/40 border border-rose-900/60 rounded-xl p-3 flex gap-2.5 text-rose-300">
            <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-[10px]">
              <span className="font-bold uppercase tracking-wider block font-mono mb-0.5">Authorization Notice:</span>
              {errorMsg}
            </div>
          </div>
        )}

        {/* 2. Upload / Create Backup section */}
        <div className="flex flex-col gap-2 py-0.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Create Backup Coordinate Snapshot</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="e.g. My Cozy Editorial preset"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-sans text-slate-200 focus:outline-none focus:border-indigo-500/60 placeholder-slate-600"
            />
            <input
              type="text"
              value={presetNote}
              onChange={(e) => setPresetNote(e.target.value)}
              placeholder="Optional note"
              className="w-1/3 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-sans text-slate-200 focus:outline-none focus:border-indigo-500/60 placeholder-slate-600"
            />
            <button
              onClick={handleUploadToDrive}
              disabled={isSaving || !newPresetName.trim()}
              className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 active:scale-95 transition-transform rounded-xl px-4 py-2 font-bold font-mono tracking-tight flex items-center gap-1.5 cursor-pointer disabled:opacity-30"
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CloudUpload className="h-3.5 w-3.5" />
              )}
              <span>Store</span>
            </button>
          </div>
        </div>

        {/* 3. Listed Backup Preset Snapshots */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Available Preset files ({isDemoMode ? demoFiles.length : files.length})
            </span>
            
            {!isDemoMode && (
              <button
                onClick={() => fetchGoogleDriveFiles()}
                disabled={isLoadingFiles}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Refresh Google Drive files"
              >
                <RefreshCw className={`h-3 w-3 ${isLoadingFiles ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>

          {/* List display */}
          <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1">
            {isDemoMode ? (
              demoFiles.length === 0 ? (
                <div className="text-center py-4 bg-slate-950/40 rounded-xl border border-dashed border-slate-800 text-slate-600 text-[10px]">
                  No sandbox backups stored currently. Insert a name and click Store.
                </div>
              ) : (
                demoFiles.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => handleDownloadFromDrive(file.id, file.name)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                      selectedFileId === file.id
                        ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-300'
                        : 'bg-slate-950/60 border-slate-850 hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-6 w-6 rounded bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-[9px] font-extrabold text-indigo-400 shrink-0">
                        JSON
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-200 block truncate text-[11px] font-mono leading-tight">{file.name}</span>
                        <span className="text-[8px] text-slate-500 font-mono tracking-wide">Saved in sandbox at {file.time}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => handleDeleteFile(e, file.id, file.name)}
                      className="p-1 rounded bg-slate-900/60 hover:bg-red-950 text-slate-500 hover:text-red-400 border border-slate-800 cursor-pointer shrink-0 transition-colors"
                      title="Delete profile preset"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))
              )
            ) : isLoadingFiles ? (
              <div className="flex flex-col items-center justify-center py-6 text-slate-500">
                <RefreshCw className="h-5 w-5 animate-spin text-indigo-500 mb-2" />
                <span className="text-[10px] font-mono font-bold tracking-wider">REFRESHING INDEX...</span>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-4 bg-slate-950/40 rounded-xl border border-dashed border-slate-800 text-slate-600 text-[10px]">
                No backup records found on real google drive. Create your first preset scan!
              </div>
            ) : (
              files.map((file) => (
                <div
                  key={file.id}
                  onClick={() => handleDownloadFromDrive(file.id, file.name)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                    selectedFileId === file.id
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-300'
                      : 'bg-slate-950/80 border-slate-850 hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-6 w-6 rounded bg-indigo-950/50 border border-indigo-900/30 flex items-center justify-center font-mono text-[9px] font-extrabold text-indigo-400 shrink-0">
                      GDR
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-slate-200 block truncate text-[11px] font-mono leading-tight">{file.name}</span>
                      <span className="text-[8px] text-slate-500 font-mono tracking-wide">ID: {file.id.substring(0, 12)}...</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => handleDeleteFile(e, file.id, file.name)}
                    className="p-1 rounded bg-slate-900/60 hover:bg-red-950 text-slate-500 hover:text-red-400 border border-slate-850 cursor-pointer shrink-0 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
