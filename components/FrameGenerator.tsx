'use client'

import { useEffect, useRef, useState } from 'react'
import { Download, Upload, LinkIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const TEXT_OPTIONS = [
  'Banned',
  'Desperate',
  'OpentoDrink',
  'Tired',
  'Waitingfor',
  'Inlove'
]

const COLOR_OPTIONS = [
  { name: 'Purple', value: '#9333ea' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Orange', value: '#f97316' },
]

export default function FrameGenerator() {
  const [image, setImage] = useState<string | null>(null)
  const [frameColor, setFrameColor] = useState(COLOR_OPTIONS[0].value)
  const [selectedText, setSelectedText] = useState(TEXT_OPTIONS[0])
  const [imageUrl, setImageUrl] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (imageUrl) {
      setImage(imageUrl)
    }
  }

  const drawFrame = () => {
    const canvas = canvasRef.current
    if (!canvas || !image) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw circular clip path
      ctx.beginPath()
      ctx.arc(400, 400, 400, 0, Math.PI * 2)
      ctx.clip()

      // Draw image
      const size = Math.min(img.width, img.height)
      const x = (img.width - size) / 2
      const y = (img.height - size) / 2
      ctx.drawImage(img, x, y, size, size, 0, 0, 800, 800)

      // Draw frame arc
      ctx.beginPath()
      ctx.arc(400, 400, 400, Math.PI * 0.5, Math.PI * 1.2)
      ctx.lineWidth = 120
      ctx.strokeStyle = frameColor
      ctx.stroke()

      // Draw text
      ctx.font = 'bold 72px Inter'
      ctx.fillStyle = 'white'
      ctx.textAlign = 'center'
      ctx.save()
      ctx.translate(400, 400)
      ctx.rotate(Math.PI * 0.85)
      ctx.fillText(`#${selectedText.toUpperCase()}`, 0, 320)
      ctx.restore()
    }
    img.src = image
  }

  useEffect(() => {
    drawFrame()
  }, [image, frameColor, selectedText])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'linkedin-frame.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="min-h-screen bg-muted/50 py-8">
      <div className="container max-w-6xl space-y-8 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>LinkedIn Frame Generator</CardTitle>
            <CardDescription>
              Create your custom LinkedIn frame by uploading an image and customizing the style
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Tabs defaultValue="upload">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload">Upload Image</TabsTrigger>
                      <TabsTrigger value="url">Image URL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload">
                      <label
                        className="flex h-32 cursor-pointer items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 hover:border-muted-foreground/50"
                        htmlFor="image-upload"
                      >
                        {image ? (
                          <img
                            src={image}
                            alt="Preview"
                            className="h-full w-full rounded-lg object-contain p-2"
                          />
                        ) : (
                          <div className="flex flex-col items-center space-y-2">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Click to upload image
                            </span>
                          </div>
                        )}
                      </label>
                      <input
                        type="file"
                        id="image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </TabsContent>
                    <TabsContent value="url">
                      <form onSubmit={handleUrlSubmit} className="flex space-x-2">
                        <Input
                          type="url"
                          placeholder="Enter image URL"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                        />
                        <Button type="submit">
                          <LinkIcon className="mr-2 h-4 w-4" />
                          Load
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Frame Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_OPTIONS.map((color) => (
                        <button
                          key={color.value}
                          className={`h-8 w-8 rounded-full border-2 ${
                            frameColor === color.value ? 'border-primary' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => setFrameColor(color.value)}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Frame Text</Label>
                    <Select
                      value={selectedText}
                      onValueChange={setSelectedText}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TEXT_OPTIONS.map((text) => (
                          <SelectItem key={text} value={text}>
                            #{text.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleDownload}
                    disabled={!image}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Frame
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Preview</h2>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-background">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={800}
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}