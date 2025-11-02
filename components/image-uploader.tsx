"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ImageUploaderProps {
  onImageCapture: (imageData: string) => void
  isLoading: boolean
}

export default function ImageUploader({ onImageCapture, isLoading }: ImageUploaderProps) {
  const [showCamera, setShowCamera] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        onImageCapture(imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
      }
    } catch (error) {
      console.error("Camera access denied:", error)
      alert("Unable to access camera. Please check permissions.")
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        const imageData = canvasRef.current.toDataURL("image/jpeg")

        // Stop camera
        const stream = videoRef.current.srcObject as MediaStream
        stream?.getTracks().forEach((track) => track.stop())

        setShowCamera(false)
        onImageCapture(imageData)
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream
      stream?.getTracks().forEach((track) => track.stop())
      setShowCamera(false)
    }
  }

  if (showCamera) {
    return (
      <Card className="p-8 bg-card border-border">
        <div className="space-y-4">
          <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg bg-black aspect-video object-cover" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-4 justify-center">
            <Button onClick={capturePhoto} disabled={isLoading} className="gap-2 bg-primary hover:bg-primary/90">
              📷 Capture Photo
            </Button>
            <Button onClick={stopCamera} variant="outline" className="gap-2 bg-transparent">
              ✕ Cancel
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-12 bg-card border-border">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Option */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="text-4xl mx-auto mb-4">📤</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Upload Photo</h3>
            <p className="text-sm text-muted-foreground">Click to select an image from your device</p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          </div>

          {/* Camera Option */}
          <div
            onClick={startCamera}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all"
          >
            <div className="text-4xl mx-auto mb-4">📷</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Use Camera</h3>
            <p className="text-sm text-muted-foreground">Take a photo with your device camera</p>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <p className="mt-4 text-muted-foreground">Analyzing your skin...</p>
          </div>
        )}
      </div>
    </Card>
  )
}
