"use client"

interface ComponentPreviewProps {
  htmlContent: string
}

export function ComponentPreview({ htmlContent }: ComponentPreviewProps) {
  const iframeContent = `
    <html>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          body { 
            background-color: transparent;
            font-family: sans-serif;
          }
        </style>
      </head>
      <body>
        <div class="p-4">${htmlContent}</div>
      </body>
    </html>
  `

  return (
    <iframe
      srcDoc={iframeContent}
      title="Component Preview"
      className="w-full h-full border-0"
    />
  )
}
