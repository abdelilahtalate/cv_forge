import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, FileText, Maximize2, RefreshCw } from 'lucide-react'
import { useCVStore } from '@/store/cvStore'
import { Document, Page, pdfjs } from 'react-pdf'

// Set up pdf.js worker using CDN to avoid Vite build configuration issues
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export const CVPreviewPanel: React.FC = () => {
  const { showCVPreview, setShowCVPreview, activePdfUrl, setActivePdfUrl } = useCVStore()
  const [numPages, setNumPages] = useState<number>(0)
  const [pdfDataUri, setPdfDataUri] = useState<string | null>(null)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (!activePdfUrl) {
      setPdfDataUri(null)
      return
    }

    const filename = activePdfUrl.split('/').pop() || ''
    
    // We intentionally request base64 JSON from the backend so IDM does not hijack the PDF stream
    const fetchUrl = `http://localhost:8000/api/v1/chat/view-base64/${filename}`
    
    setLoadingPdf(true)
    setFetchError(null)

    fetch(fetchUrl)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch PDF data")
        return res.json()
      })
      .then(data => {
        setPdfDataUri(data.data) // This contains 'data:application/pdf;base64,...'
        setLoadingPdf(false)
      })
      .catch(err => {
        setFetchError(err.message)
        setLoadingPdf(false)
      })

  }, [activePdfUrl])

  if (!showCVPreview) return null

  const handleClose = () => {
    setShowCVPreview(false)
    setActivePdfUrl(null)
  }

  const filename = activePdfUrl?.split('/').pop() || ''

  return (
    <AnimatePresence>
      {showCVPreview && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-screen w-1/2 bg-gray-900 border-l border-white/10 z-50 flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <FileText className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">CV Preview</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                  Generated LaTeX Document
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activePdfUrl && (
                <a
                  href={`http://localhost:8000/api/v1/chat/download/${filename}`}
                  download
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
                  title="Download PDF"
                >
                  <Download className="w-5 h-5" />
                </a>
              )}
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="flex-1 bg-gray-950 p-4 overflow-y-auto relative group flex flex-col items-center">
            {loadingPdf && (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm mt-20">
                Fetching PDF securely...
              </div>
            )}
            
            {fetchError && (
              <div className="flex items-center justify-center h-full text-red-500 text-sm mt-20">
                {fetchError}
              </div>
            )}

            {pdfDataUri && !loadingPdf && !fetchError ? (
              <Document
                file={pdfDataUri}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={
                  <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                    Rendering PDF...
                  </div>
                }
                error={
                  <div className="flex items-center justify-center h-64 text-red-400 text-sm">
                    Failed to load document into canvas.
                  </div>
                }
                className="flex flex-col items-center w-full"
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="mb-6 shadow-xl rounded overflow-hidden"
                    width={500} 
                  />
                ))}
              </Document>
            ) : null}

            {!activePdfUrl && !loadingPdf && !fetchError && (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 mt-20">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-gray-600" />
                </div>
                <h4 className="text-white font-medium mb-1">No PDF Available</h4>
                <p className="text-sm text-gray-400 max-w-[200px]">
                  Generate a CV using the LaTeX agent to see it here.
                </p>
              </div>
            )}

            {pdfDataUri && (
              <div className="absolute top-8 right-8 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Downloading the base64 URL will work nicely for opening a custom tab */}
                <button
                  onClick={() => {
                    const win = window.open();
                    if(win) win.document.write(`<iframe src="${pdfDataUri}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`)
                  }}
                  className="p-3 bg-gray-800/90 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg hover:bg-gray-700 transition-colors"
                  title="Open in new tab"
                >
                  <Maximize2 className="w-5 h-5 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-900 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <RefreshCw className="w-3 h-3 animate-spin-slow" />
              <span>Last updated just now</span>
            </div>
            <p className="text-[10px] text-gray-600 font-mono">PDF_RENDERER_V1.0</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}