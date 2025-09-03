'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Plus, Image as ImageIcon, CheckCircle, Clock, X, Edit, Save } from 'lucide-react'
import { imageStore } from '../../../lib/imageStore'
import { notificationStore } from '../../../lib/notificationStore'

type FileStatus = 'uploading' | 'analyzing' | 'completed' | 'submitting' | 'submitted' | 'quality-testing' | 'approved' | 'published'

interface FileWithMetadata extends File {
  id: string
  preview: string
  status: FileStatus
  progress: number
  metadata?: {
    title: string
    caption: string
    keywords: string[]
    tags: string[]
    category: string
  }
  isEditingMetadata?: boolean
}

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<FileWithMetadata[]>([])
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    // Send a welcome notification on first visit to upload page
    const hasSeenUploadWelcome = localStorage.getItem('hasSeenUploadWelcome')
    if (!hasSeenUploadWelcome) {
      setTimeout(() => {
        notificationStore.createNotification({
          type: 'ACCOUNT_UPDATE',
          title: 'Welcome to Image Upload! 🎉',
          message: 'Ready to start earning from your photography? Upload up to 5 images and our AI will help generate metadata for better discoverability.',
          channels: ['email']
        })
        localStorage.setItem('hasSeenUploadWelcome', 'true')
      }, 2000) // Delay to avoid overwhelming the user
    }
  }, [])

  const analyzeImageWithAI = async (imageFile: File): Promise<FileWithMetadata['metadata']> => {
    return new Promise((resolve) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Create object URL
      const objectUrl = URL.createObjectURL(imageFile)
      
      img.onload = () => {
        // Set canvas size
        canvas.width = 224
        canvas.height = 224
        
        // Draw and analyze the image
        ctx?.drawImage(img, 0, 0, 224, 224)
        
        // Get image data for analysis
        const imageData = ctx?.getImageData(0, 0, 224, 224)
        
        // Analyze colors, composition, and content
        const metadata = analyzeImageContent(imageData, imageFile.name)
        
        // Cleanup
        URL.revokeObjectURL(objectUrl)
        resolve(metadata)
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        resolve(generateFallbackMetadata(imageFile.name))
      }
      
      // Load image
      img.src = objectUrl
    })
  }

  const analyzeImageContent = (imageData: ImageData | undefined, fileName: string): FileWithMetadata['metadata'] => {
    if (!imageData) {
      return generateFallbackMetadata(fileName)
    }

    const data = imageData.data
    const pixels = data.length / 4
    
    // Enhanced color and composition analysis
    let totalR = 0, totalG = 0, totalB = 0, totalBrightness = 0
    let redPixels = 0, greenPixels = 0, bluePixels = 0
    let darkPixels = 0, lightPixels = 0, midTonePixels = 0
    let saturatedPixels = 0, grayPixels = 0
    
    const colorRegions = new Map()
    const skinTonePixels: { r: number; g: number; b: number; index: number }[] = []
    // const objectPatterns = []
    
    // Enhanced pixel analysis with pattern detection
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1] 
      const b = data[i + 2]
      
      totalR += r
      totalG += g
      totalB += b
      
      const pixelBrightness = (r + g + b) / 3
      totalBrightness += pixelBrightness
      
      // Brightness classification
      if (pixelBrightness < 80) darkPixels++
      else if (pixelBrightness > 180) lightPixels++
      else midTonePixels++
      
      // Color dominance analysis
      const maxChannel = Math.max(r, g, b)
      const minChannel = Math.min(r, g, b)
      const saturation = maxChannel > 0 ? (maxChannel - minChannel) / maxChannel : 0
      
      if (saturation > 0.3) {
        saturatedPixels++
        if (r > g && r > b) redPixels++
        else if (g > r && g > b) greenPixels++
        else if (b > r && b > g) bluePixels++
      } else {
        grayPixels++
      }
      
      // Improved skin tone detection (much stricter criteria)
      const isSkinTone = (
        // More restrictive ranges for actual skin tones
        (r >= 120 && r <= 255 && g >= 80 && g <= 220 && b >= 60 && b <= 200) &&
        // Red must be dominant but not too much
        (r > g && r > b) &&
        // Reasonable differences between channels
        (r - g >= 10 && r - g <= 80) &&
        (r - b >= 15 && r - b <= 100) &&
        (g - b >= 0 && g - b <= 50) &&
        // Must have reasonable saturation (not gray)
        (Math.max(r, g, b) - Math.min(r, g, b) > 25)
      )
      if (isSkinTone) {
        skinTonePixels.push({ r, g, b, index: i / 4 })
      }
      
      // Color region mapping (simplified)
      const regionKey = `${Math.floor(r/64)*64}-${Math.floor(g/64)*64}-${Math.floor(b/64)*64}`
      colorRegions.set(regionKey, (colorRegions.get(regionKey) || 0) + 1)
    }
    
    // Calculate percentages and averages
    const avgR = totalR / pixels
    const avgG = totalG / pixels  
    const avgB = totalB / pixels
    const avgBrightness = totalBrightness / pixels
    
    const darkRatio = darkPixels / pixels
    const lightRatio = lightPixels / pixels
    const saturatedRatio = saturatedPixels / pixels
    const redRatio = redPixels / pixels
    const greenRatio = greenPixels / pixels
    const blueRatio = bluePixels / pixels
    
    // Advanced color analysis
    const isWarmToned = (avgR > avgB + 15) && (redRatio > 0.1)
    const isCoolToned = (avgB > avgR + 15) && (blueRatio > 0.1)
    const isNaturalGreen = (avgG > Math.max(avgR, avgB) + 10) && (greenRatio > 0.15)
    
    // Composition analysis
    const isHighContrast = (lightRatio > 0.3 && darkRatio > 0.3)
    const isLowKey = darkRatio > 0.6
    const isHighKey = lightRatio > 0.6
    const isVibrant = saturatedRatio > 0.4
    const isMuted = saturatedRatio < 0.2
    
    // Object and people detection (extremely strict thresholds + additional validation)
    const skinToneRatio = skinTonePixels.length / pixels
    
    // Additional validation: check for spatial distribution and realistic face/body proportions
    const hasRealisticSkinDistribution = () => {
      if (skinTonePixels.length < pixels * 0.05) return false // Too few skin pixels
      
      // Check if skin pixels are reasonably clustered (not scattered)
      // Simple heuristic: skin pixels should have some spatial coherence
      const width = 224 // Canvas width
      const clusters = new Set()
      
      skinTonePixels.forEach(pixel => {
        const row = Math.floor(pixel.index / width)
        const col = pixel.index % width
        // Group into 8x8 pixel regions
        const clusterKey = `${Math.floor(row/8)}-${Math.floor(col/8)}`
        clusters.add(clusterKey)
      })
      
      // Too many scattered clusters = probably not people
      if (clusters.size > skinTonePixels.length / 20) return false
      
      return true
    }
    
    // Ultra-conservative people detection with additional validation
    const skinDistributionValid = hasRealisticSkinDistribution()
    const hasMultiplePeople = skinToneRatio > 0.35 && skinDistributionValid // Extremely high skin tone presence required
    const hasSinglePerson = skinToneRatio > 0.20 && skinToneRatio <= 0.35 && skinDistributionValid // Very substantial skin presence
    const hasMinimalPeople = skinToneRatio > 0.10 && skinToneRatio <= 0.20 && skinDistributionValid // Some skin presence
    
    // Simple pattern detection for common objects
    const hasBlueWater = blueRatio > 0.3 && avgB > 120
    const hasGreenVegetation = greenRatio > 0.25 && avgG > 100
    const hasGrayStructures = grayPixels / pixels > 0.4 && midTonePixels > pixels * 0.4
    const hasBrightSky = lightRatio > 0.6 && avgBrightness > 180
    const hasFood = isWarmToned && saturatedRatio > 0.3 && avgBrightness > 100
    
    // Generate metadata based on enhanced analysis
    return generateMetadataFromAnalysis({
      avgR, avgG, avgB, avgBrightness, 
      isWarmToned, isCoolToned, isNaturalGreen,
      isHighContrast, isLowKey, isHighKey, isVibrant, isMuted,
      darkRatio, lightRatio, saturatedRatio,
      redRatio, greenRatio, blueRatio,
      hasMultiplePeople, hasSinglePerson, hasMinimalPeople,
      hasBlueWater, hasGreenVegetation, hasGrayStructures, hasBrightSky, hasFood,
      skinToneRatio, skinTonePixels, pixels, skinDistributionValid,
      fileName
    })
  }

  const generateMetadataFromAnalysis = (analysis: {
    avgR: number, avgG: number, avgB: number, avgBrightness: number,
    isWarmToned: boolean, isCoolToned: boolean, isNaturalGreen: boolean,
    isHighContrast: boolean, isLowKey: boolean, isHighKey: boolean,
    isVibrant: boolean, isMuted: boolean,
    darkRatio: number, lightRatio: number, saturatedRatio: number,
    redRatio: number, greenRatio: number, blueRatio: number,
    hasMultiplePeople: boolean, hasSinglePerson: boolean, hasMinimalPeople: boolean,
    hasBlueWater: boolean, hasGreenVegetation: boolean, hasGrayStructures: boolean, 
    hasBrightSky: boolean, hasFood: boolean,
    skinToneRatio: number, skinTonePixels: { r: number; g: number; b: number; index: number }[], pixels: number, skinDistributionValid: boolean,
    fileName: string
  }): FileWithMetadata['metadata'] => {
    const { 
      avgBrightness, isWarmToned, isCoolToned, isNaturalGreen,
      isHighContrast, isLowKey, isHighKey, isVibrant, isMuted,
      darkRatio, lightRatio, saturatedRatio,
      // redRatio, 
      greenRatio, blueRatio,
      hasMultiplePeople, hasSinglePerson, hasMinimalPeople,
      hasBlueWater, hasGreenVegetation, hasGrayStructures, 
      // hasBrightSky, 
      hasFood,
      skinToneRatio, skinTonePixels, pixels, skinDistributionValid,
      fileName
    } = analysis
    
    // Add some randomization to prevent identical results
    const randomSeed = Math.random()
    
    // Debug logging to see detection results
    console.log('🔍 AI Image Analysis Results for:', fileName, {
      '👥 People Detection': { 
        skinToneRatio: (skinToneRatio * 100).toFixed(2) + '%', 
        skinPixelsFound: skinTonePixels.length,
        totalPixels: pixels,
        distributionValid: skinDistributionValid,
        hasMultiplePeople, 
        hasSinglePerson, 
        hasMinimalPeople,
        reason: skinToneRatio < 0.10 ? 'Too few skin pixels' : 
               !skinDistributionValid ? 'Skin pixels too scattered/unrealistic' : 
               'Passed all checks'
      },
      '🌊 Water/Ocean': { detected: hasBlueWater, blueRatio: (blueRatio * 100).toFixed(1) + '%' },
      '🌿 Vegetation': { detected: hasGreenVegetation, greenRatio: (greenRatio * 100).toFixed(1) + '%' }, 
      '🏗️ Structures': hasGrayStructures,
      '🍎 Food': hasFood,
      '🌡️ Color Tone': { isWarmToned, isCoolToned, isNaturalGreen },
      '🎨 Composition': { avgBrightness: avgBrightness.toFixed(1), saturatedRatio: (saturatedRatio * 100).toFixed(1) + '%' }
    })
    
    // Generate contextual metadata based on enhanced analysis
    let category = "General"
    let baseKeywords: string[] = []
    let baseTags: string[] = []
    let titlePrefix = ""
    let captionTheme = ""
    
    // Enhanced categorization logic with object/people detection
    
    // People/Portrait detection (highest priority)
    if (hasMultiplePeople) {
      category = "People & Lifestyle"
      baseKeywords = ["people", "group", "social", "lifestyle", "human", "portrait", "community"]
      baseTags = ["people", "group", "lifestyle", "social"]
      titlePrefix = "Group"
      captionTheme = "engaging group composition with multiple people"
    }
    else if (hasSinglePerson) {
      category = "People & Lifestyle"
      baseKeywords = ["portrait", "person", "human", "lifestyle", "individual", "character"]
      baseTags = ["portrait", "person", "lifestyle", "human"]
      titlePrefix = "Portrait"
      captionTheme = "compelling portrait composition featuring a person"
    }
    else if (hasMinimalPeople) {
      category = "People & Lifestyle"
      baseKeywords = ["lifestyle", "human", "candid", "everyday", "real-life"]
      baseTags = ["lifestyle", "candid", "everyday"]
      titlePrefix = "Lifestyle"
      captionTheme = "authentic lifestyle scene with human presence"
    }
    // Food detection
    else if (hasFood || fileName.toLowerCase().includes('food')) {
      category = "Food & Beverage"
      baseKeywords = ["food", "cuisine", "meal", "delicious", "culinary", "dining", "taste"]
      baseTags = ["food", "cuisine", "meal", "culinary"]
      titlePrefix = "Culinary"
      captionTheme = "appetizing food composition with rich colors and textures"
    }
    // Water/Ocean detection  
    else if (hasBlueWater && hasGreenVegetation) {
      category = "Nature & Landscape"
      baseKeywords = ["ocean", "water", "coastal", "nature", "seascape", "blue", "marine"]
      baseTags = ["ocean", "water", "coastal", "nature"]
      titlePrefix = "Coastal"
      captionTheme = "beautiful coastal scene with blue waters and natural elements"
    }
    else if (hasBlueWater) {
      category = "Nature & Landscape" 
      baseKeywords = ["water", "blue", "aquatic", "liquid", "reflection", "serene"]
      baseTags = ["water", "blue", "aquatic", "serene"]
      titlePrefix = "Aquatic"
      captionTheme = "serene water composition with beautiful blue tones"
    }
    // Architecture/Urban detection
    else if (hasGrayStructures && !isNaturalGreen) {
      category = "Urban & Architecture"
      baseKeywords = ["architecture", "building", "urban", "structure", "concrete", "modern", "city"]
      baseTags = ["architecture", "building", "urban", "structure"]
      titlePrefix = "Architectural"
      captionTheme = "striking architectural composition with modern structures"
    }
    // Natural/Landscape detection
    else if (isNaturalGreen && hasGreenVegetation) {
      category = "Nature & Landscape"
      baseKeywords = ["nature", "landscape", "outdoor", "green", "natural", "environment", "scenic"]
      baseTags = ["nature", "landscape", "outdoor", "scenic"]
      titlePrefix = "Natural"
      captionTheme = "beautiful natural landscape with vibrant greenery"
    }
    // Sunset/Golden hour detection  
    else if (isWarmToned && (avgBrightness > 120) && (lightRatio > 0.4)) {
      category = "Nature & Landscape"
      baseKeywords = ["sunset", "golden-hour", "warm", "light", "atmospheric", "scenic", "evening"]
      baseTags = ["sunset", "golden-hour", "warm-light", "atmospheric"]
      titlePrefix = "Golden Hour"
      captionTheme = "stunning golden hour lighting with warm atmospheric tones"
    }
    // Cool/Urban detection
    else if (isCoolToned && !isNaturalGreen) {
      category = "Urban & Architecture"
      baseKeywords = ["urban", "modern", "cool", "blue", "contemporary", "architecture", "city"]
      baseTags = ["urban", "modern", "cool-tones", "contemporary"]  
      titlePrefix = "Urban"
      captionTheme = "modern urban scene with cool blue tones"
    }
    // High contrast/dramatic
    else if (isHighContrast && isVibrant) {
      category = "Artistic & Creative"
      baseKeywords = ["dramatic", "contrast", "artistic", "bold", "striking", "creative", "vivid"]
      baseTags = ["dramatic", "high-contrast", "artistic", "bold"]
      titlePrefix = "Dramatic" 
      captionTheme = "striking high-contrast composition with dramatic visual impact"
    }
    // Low-key/Dark mood
    else if (isLowKey || (darkRatio > 0.5)) {
      category = "Artistic & Creative"
      baseKeywords = ["dark", "moody", "atmospheric", "mysterious", "shadow", "dramatic", "noir"]
      baseTags = ["dark", "moody", "atmospheric", "dramatic"]
      titlePrefix = "Moody"
      captionTheme = "dark atmospheric composition with mysterious mood"
    }
    // High-key/Bright
    else if (isHighKey || (lightRatio > 0.6)) {
      category = "Lifestyle & Wellness" 
      baseKeywords = ["bright", "clean", "minimal", "fresh", "light", "airy", "lifestyle", "pure"]
      baseTags = ["bright", "clean", "minimal", "lifestyle"]
      titlePrefix = "Bright"
      captionTheme = "bright, clean composition with minimalist aesthetic"
    }
    // Vibrant colors
    else if (isVibrant && !isMuted) {
      category = "Artistic & Creative"
      baseKeywords = ["vibrant", "colorful", "bold", "vivid", "energetic", "dynamic", "bright"]
      baseTags = ["vibrant", "colorful", "bold", "dynamic"]
      titlePrefix = "Vibrant"
      captionTheme = "vibrant and colorful composition with bold visual appeal"
    }
    // Muted/Soft tones
    else if (isMuted) {
      category = "Lifestyle & Wellness"
      baseKeywords = ["soft", "muted", "gentle", "subtle", "pastel", "calm", "peaceful"]
      baseTags = ["soft", "muted", "gentle", "calm"]
      titlePrefix = "Soft"
      captionTheme = "soft, muted composition with gentle tonal palette"
    }
    
    // Add filename-based context
    const fileNameLower = fileName.toLowerCase()
    if (fileNameLower.includes('food') || fileNameLower.includes('meal')) {
      category = "Food & Beverage"
      baseKeywords.push("food", "cuisine", "meal", "delicious")
      baseTags.push("food", "cuisine")
    }
    if (fileNameLower.includes('portrait') || fileNameLower.includes('people')) {
      category = "People & Lifestyle"
      baseKeywords.push("portrait", "people", "lifestyle", "human")
      baseTags.push("portrait", "people", "lifestyle")
    }
    if (fileNameLower.includes('business') || fileNameLower.includes('office')) {
      category = "Business & Technology"
      baseKeywords.push("business", "professional", "office", "work")
      baseTags.push("business", "professional", "work")
    }
    
    // Generate more varied titles and captions
    const titleVariations = [
      `${titlePrefix} ${category.split(' ')[0]} Photography`,
      `${titlePrefix} ${category.split(' ')[0]} Image`,
      `Professional ${category.split(' ')[0]} Shot`,
      `${titlePrefix} ${category.split(' ')[0]} Capture`
    ]
    
    const captionVariations = [
      `Professional ${category.toLowerCase()} photograph featuring ${captionTheme}`,
      `High-quality ${category.toLowerCase()} image showcasing ${captionTheme}`,
      `Stock photo capturing ${captionTheme} in ${category.toLowerCase()} style`,
      `Commercial ${category.toLowerCase()} photography with ${captionTheme}`
    ]
    
    const title = titleVariations[Math.floor(randomSeed * titleVariations.length)]
    const caption = captionVariations[Math.floor(randomSeed * captionVariations.length)]
    
    // Add varied photography keywords
    const commonKeywords = ["photography", "professional", "high-quality", "stock-photo", "commercial"]
    const additionalKeywords = ["creative", "artistic", "visual", "design", "composition", "aesthetic", "contemporary", "stylish"]
    const selectedAdditional = additionalKeywords.slice(0, Math.floor(randomSeed * 4) + 1)
    
    const allKeywords = [...baseKeywords, ...commonKeywords.slice(0, 3), ...selectedAdditional]
    const allTags = [...baseTags, "photography", "stock", randomSeed > 0.5 ? "professional" : "creative"]
    
    const result = {
      title,
      caption,
      keywords: allKeywords.slice(0, 10), // Limit to 10 keywords
      tags: allTags.slice(0, 6), // Limit to 6 tags  
      category
    }
    
    console.log('✅ AI Generated Metadata for', fileName + ':', {
      '📝 Title': result.title,
      '📖 Category': result.category,
      '🏷️ Keywords': result.keywords.join(', '),
      '🔖 Tags': result.tags.join(', ')
    })
    
    return result
  }

  const generateFallbackMetadata = (fileName: string): FileWithMetadata['metadata'] => {
    // Fallback to filename-based analysis if image analysis fails
    const fileNameLower = fileName.toLowerCase()
    
    if (fileNameLower.includes('nature') || fileNameLower.includes('landscape')) {
      return {
        title: "Nature Landscape Photography", 
        caption: "Beautiful natural landscape captured in high quality",
        keywords: ["nature", "landscape", "outdoor", "scenic", "natural", "environment", "photography"],
        tags: ["nature", "landscape", "outdoor", "scenic"],
        category: "Nature & Landscape"
      }
    } else if (fileNameLower.includes('portrait') || fileNameLower.includes('people')) {
      return {
        title: "Professional Portrait Photography",
        caption: "High-quality portrait photograph with professional composition", 
        keywords: ["portrait", "people", "professional", "photography", "lifestyle", "human"],
        tags: ["portrait", "people", "lifestyle", "professional"],
        category: "People & Lifestyle"
      }
    } else {
      return {
        title: "Professional Stock Photography",
        caption: "High-quality stock photograph suitable for commercial use",
        keywords: ["stock", "photography", "professional", "commercial", "high-quality"],
        tags: ["stock", "photography", "professional"],
        category: "General"
      }
    }
  }

  const simulateProcessing = async (fileId: string, imageFile: File) => {
    // Phase 1: Upload
    setTimeout(() => {
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'uploading', progress: 30 } : f
      ))
      imageStore.updateImageStatus(fileId, 'uploading')
    }, 500)

    // Phase 2: AI Analysis
    setTimeout(() => {
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'analyzing', progress: 60 } : f
      ))
      imageStore.updateImageStatus(fileId, 'analyzing')
    }, 1500)

    // Phase 3: Generate Metadata with real analysis
    setTimeout(async () => {
      try {
        const metadata = await analyzeImageWithAI(imageFile)
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { 
            ...f, 
            status: 'completed', 
            progress: 100,
            metadata 
          } : f
        ))
        imageStore.updateImageStatus(fileId, 'completed')
        imageStore.updateImageMetadata(fileId, metadata)
      } catch (error) {
        console.error('Image analysis failed:', error)
        // Fallback to filename-based metadata
        const metadata = generateFallbackMetadata(imageFile.name)
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { 
            ...f, 
            status: 'completed', 
            progress: 100,
            metadata 
          } : f
        ))
        imageStore.updateImageStatus(fileId, 'completed')
        imageStore.updateImageMetadata(fileId, metadata)
      }
    }, 2500)
  }

  const handleFileSelect = (selectedFiles: FileList) => {
    setUploadError('')
    
    const imageFiles = Array.from(selectedFiles)
      .filter(file => file.type.startsWith('image/'))
    
    // Check if adding these files would exceed the limit
    if (files.length + imageFiles.length > 5) {
      const remainingSlots = 5 - files.length
      if (remainingSlots <= 0) {
        setUploadError('Maximum 5 images allowed. Please remove some images first.')
        return
      } else {
        setUploadError(`You can only add ${remainingSlots} more image(s). Maximum 5 images allowed.`)
        // Only take the files that fit within the limit
        imageFiles.splice(remainingSlots)
      }
    }
    
    const processedFiles = imageFiles.map(file => {
      const fileWithMetadata: FileWithMetadata = Object.assign(file, {
        id: Math.random().toString(36).substr(2, 9),
        preview: URL.createObjectURL(file),
        status: 'uploading' as const,
        progress: 0
      })
      return fileWithMetadata
    })
    
    setFiles(prev => [...prev, ...processedFiles])
    
    // Add to global image store
    imageStore.addImages(processedFiles.map(file => ({
      id: file.id,
      name: file.name,
      preview: file.preview,
      status: file.status,
      progress: file.progress
    })))
    
    // Mark that user has uploaded images
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasUploadedImages', 'true')
    }
    
    // Start processing each file
    processedFiles.forEach(file => {
      simulateProcessing(file.id, file)
    })
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files)
    }
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const onDragLeave = useCallback(() => {
    setDragActive(false)
  }, [])

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId)
      // Clean up preview URL
      const removed = prev.find(f => f.id === fileId)
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview)
      }
      return updated
    })
  }

  const toggleMetadataEdit = (fileId: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, isEditingMetadata: !f.isEditingMetadata } : f
    ))
  }

  const updateMetadata = (fileId: string, field: string, value: string | string[]) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId && f.metadata ? { 
        ...f, 
        metadata: { ...f.metadata, [field]: value }
      } : f
    ))
  }

  const addKeyword = (fileId: string, keyword: string) => {
    if (!keyword.trim()) return
    setFiles(prev => prev.map(f => 
      f.id === fileId && f.metadata ? { 
        ...f, 
        metadata: { 
          ...f.metadata, 
          keywords: [...f.metadata.keywords, keyword.trim()]
        }
      } : f
    ))
  }

  const removeKeyword = (fileId: string, index: number) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId && f.metadata ? { 
        ...f, 
        metadata: { 
          ...f.metadata, 
          keywords: f.metadata.keywords.filter((_, i) => i !== index)
        }
      } : f
    ))
  }

  const addTag = (fileId: string, tag: string) => {
    if (!tag.trim()) return
    setFiles(prev => prev.map(f => 
      f.id === fileId && f.metadata ? { 
        ...f, 
        metadata: { 
          ...f.metadata, 
          tags: [...f.metadata.tags, tag.trim()]
        }
      } : f
    ))
  }

  const removeTag = (fileId: string, index: number) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId && f.metadata ? { 
        ...f, 
        metadata: { 
          ...f.metadata, 
          tags: f.metadata.tags.filter((_, i) => i !== index)
        }
      } : f
    ))
  }

  const getStatusText = (status: FileStatus) => {
    switch (status) {
      case 'uploading': return 'Uploading...'
      case 'analyzing': return 'AI analyzing image...'
      case 'completed': return 'Ready to submit!'
      case 'submitting': return 'Submitting for review...'
      case 'submitted': return 'Submitted for quality testing'
      case 'quality-testing': return 'Under quality review'
      case 'approved': return 'Approved - Awaiting publication'
      case 'published': return 'Live and earning!'
      default: return ''
    }
  }

  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case 'uploading':
      case 'analyzing':
      case 'submitting':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-400" />
      case 'submitted':
      case 'quality-testing':
        return <Clock className="h-5 w-5 text-orange-400" />
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'published':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return null
    }
  }

  const renderStatusIndicator = (status: FileStatus) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center space-x-2 text-blue-400">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Ready to submit</span>
          </div>
        )
      case 'submitted':
        return (
          <div className="flex items-center space-x-2 text-orange-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Submitted for review</span>
          </div>
        )
      case 'quality-testing':
        return (
          <div className="flex items-center space-x-2 text-orange-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Under quality review</span>
          </div>
        )
      case 'approved':
        return (
          <div className="flex items-center space-x-2 text-blue-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Approved - Content team will publish soon</span>
          </div>
        )
      case 'published':
        return (
          <div className="flex items-center space-x-2 text-green-500">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Live and earning!</span>
          </div>
        )
      case 'submitting':
        return (
          <div className="flex items-center space-x-2 text-yellow-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Submitting...</span>
          </div>
        )
      default:
        return null
    }
  }

  const submitAllImages = async () => {
    const completedImages = files.filter(f => f.status === 'completed')
    if (completedImages.length === 0) return

    // Set all completed images to submitting status
    setFiles(prev => prev.map(f => 
      f.status === 'completed' ? { ...f, status: 'submitting' as const } : f
    ))
    completedImages.forEach(f => imageStore.updateImageStatus(f.id, 'submitting'))

    // Simulate submission process
    setTimeout(() => {
      setFiles(prev => prev.map(f => 
        f.status === 'submitting' ? { ...f, status: 'submitted' as const } : f
      ))
      completedImages.forEach(f => imageStore.updateImageStatus(f.id, 'submitted'))
      
      // Notify user about successful submission
      notificationStore.createNotification({
        type: 'ACCOUNT_UPDATE',
        title: 'Images Submitted Successfully! 📤',
        message: `${completedImages.length} image${completedImages.length > 1 ? 's' : ''} submitted for quality review. You'll be notified once the review is complete.`,
        channels: ['email']
      })
    }, 1500)

    // Simulate quality testing process
    setTimeout(() => {
      setFiles(prev => prev.map(f => 
        f.status === 'submitted' ? { ...f, status: 'quality-testing' as const } : f
      ))
      completedImages.forEach(f => imageStore.updateImageStatus(f.id, 'quality-testing'))
    }, 3000)

    // Simulate approval (for demo - in real app this would be done by quality team)
    setTimeout(() => {
      setFiles(prev => prev.map(f => 
        f.status === 'quality-testing' ? { ...f, status: 'approved' as const } : f
      ))
      completedImages.forEach(f => imageStore.updateImageStatus(f.id, 'approved'))
      
      // Auto-publish after approval (for demo - simulate content team publishing)
      setTimeout(() => {
        completedImages.forEach(f => {
          imageStore.publishImage(f.id)
          setFiles(prev => prev.map(file => 
            file.id === f.id ? { ...file, status: 'published' as const } : file
          ))
        })
      }, 10000) // 10 seconds after approval - content team publishes
      
    }, 8000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Upload Images</h1>
        <p className="mt-2 text-gray-300">
          Upload your photos to start earning from your photography
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl shadow-lg p-8" style={{ backgroundColor: '#1a1a1a' }}
      >
        <div className="text-center">
          <div 
            className={`border-2 border-dashed rounded-xl p-12 transition-colors cursor-pointer ${dragActive ? 'border-green-400 bg-green-900/10' : ''}`}
            style={{ borderColor: dragActive ? '#00ff66' : '#404040' }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Upload className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Upload Your Images
            </h3>
            <p className="text-gray-300 mb-4">
              Drag and drop your images here, or click to browse
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Maximum 5 images allowed
            </p>
            <button className="px-8 py-3 rounded-xl font-semibold transition-colors" style={{ backgroundColor: '#00ff66', color: '#000000' }}>
              <div className="flex items-center space-x-2">
                <Plus className="h-5 w-5" style={{ color: '#000000' }} />
                <span style={{ color: '#000000' }}>Choose Files</span>
              </div>
            </button>
            
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>
          
          {/* Upload Error Message */}
          {uploadError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-lg border border-red-500 bg-red-500/10"
            >
              <p className="text-red-400 text-sm font-medium">{uploadError}</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Uploaded Images with Metadata */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-100">Processing Images ({files.length})</h2>
          
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl shadow-lg p-6"
              style={{ backgroundColor: '#1a1a1a' }}
            >
              <div className="flex gap-6">
                {/* Image Preview */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-800 relative">
                    <img 
                      src={file.preview} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFile(file.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* File Info & Progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-100 truncate">
                        {file.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(file.status)}
                      <span className="text-sm text-gray-300">
                        {getStatusText(file.status)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                    <motion.div
                      className="h-2 rounded-full"
                      style={{ backgroundColor: file.status === 'completed' ? '#00ff66' : '#3b82f6' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${file.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  {/* Generated Metadata - New Design */}
                  {file.metadata && file.status === 'completed' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4"
                    >
                      {/* Compact Metadata UI */}
                      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                        {/* Compact Header */}
                        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-b border-gray-700/30 px-4 py-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                className="w-6 h-6 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center"
                              >
                                <span className="text-white font-bold text-xs">AI</span>
                              </motion.div>
                              <div>
                                <h4 className="text-sm font-semibold text-gray-100">AI-Analyzed Metadata</h4>
                                <p className="text-xs text-green-400">✓ Image analysis complete</p>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleMetadataEdit(file.id)}
                              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                file.isEditingMetadata 
                                  ? 'bg-green-500 hover:bg-green-400 scale-105' 
                                  : 'bg-gray-700 hover:bg-gray-600'
                              }`}
                            >
                              {file.isEditingMetadata ? (
                                <>
                                  <Save className="h-3 w-3" style={{ color: '#000000' }} />
                                  <span style={{ color: '#000000' }}>Save</span>
                                </>
                              ) : (
                                <>
                                  <Edit className="h-3 w-3 text-gray-300" />
                                  <span className="text-gray-300">Edit</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Compact Content */}
                        <div className="p-4 space-y-3">
                          {/* Title */}
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Title</label>
                            {file.isEditingMetadata ? (
                              <input
                                type="text"
                                value={file.metadata.title}
                                onChange={(e) => updateMetadata(file.id, 'title', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 text-sm placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                placeholder="Enter title..."
                              />
                            ) : (
                              <p className="text-gray-100 text-sm font-medium leading-tight">{file.metadata.title}</p>
                            )}
                          </div>
                          
                          {/* Caption */}
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Caption</label>
                            {file.isEditingMetadata ? (
                              <textarea
                                value={file.metadata.caption}
                                onChange={(e) => updateMetadata(file.id, 'caption', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 text-sm placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 resize-none"
                                placeholder="Describe image..."
                              />
                            ) : (
                              <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{file.metadata.caption}</p>
                            )}
                          </div>

                          {/* Category & Tags in same row */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Category */}
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
                              {file.isEditingMetadata ? (
                                <select
                                  value={file.metadata.category}
                                  onChange={(e) => updateMetadata(file.id, 'category', e.target.value)}
                                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 text-sm focus:ring-1 focus:ring-green-500"
                                >
                                  <option value="General">General</option>
                                  <option value="Nature & Landscape">Nature & Landscape</option>
                                  <option value="Urban & Architecture">Urban & Architecture</option>
                                  <option value="People & Lifestyle">People & Lifestyle</option>
                                  <option value="Food & Beverage">Food & Beverage</option>
                                  <option value="Business & Technology">Business & Technology</option>
                                  <option value="Artistic & Creative">Artistic & Creative</option>
                                  <option value="Lifestyle & Wellness">Lifestyle & Wellness</option>
                                </select>
                              ) : (
                                <span className="inline-block px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: '#f3e8ff', color: '#3c1361' }}>
                                  {file.metadata.category}
                                </span>
                              )}
                            </div>

                            {/* Tags */}
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">Tags</label>
                              <div className="flex flex-wrap gap-2">
                                {file.metadata.tags.map((tag, idx) => (
                                  <span key={idx} className={`inline-flex items-center gap-1 px-3 py-1.5 bg-gray-700 rounded-full text-xs font-medium border border-gray-600 hover:bg-gray-600 transition-colors ${file.isEditingMetadata ? 'group cursor-pointer' : ''}`} style={{ color: '#ffffff' }}>
                                    #{tag}
                                    {file.isEditingMetadata && (
                                      <button
                                        onClick={() => removeTag(file.id, idx)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    )}
                                  </span>
                                ))}
                                {file.isEditingMetadata && (
                                  <input
                                    type="text"
                                    placeholder="Add tag..."
                                    className="px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-full text-gray-200 text-xs placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                        addTag(file.id, e.currentTarget.value.trim())
                                        e.currentTarget.value = ''
                                      }
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Keywords */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-medium text-gray-400">Keywords</label>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {file.metadata.keywords.map((keyword, idx) => (
                                <span
                                  key={idx}
                                  className={`inline-flex items-center gap-1 px-3 py-1.5 bg-gray-600 rounded-lg text-xs font-medium border border-gray-500 hover:bg-gray-500 transition-colors ${file.isEditingMetadata ? 'group cursor-pointer' : ''}`}
                                  style={{ color: '#ffffff' }}
                                >
                                  {keyword}
                                  {file.isEditingMetadata && (
                                    <button
                                      onClick={() => removeKeyword(file.id, idx)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  )}
                                </span>
                              ))}
                              {file.isEditingMetadata && (
                                <input
                                  type="text"
                                  placeholder="Add keyword..."
                                  className="px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 text-xs placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                      addKeyword(file.id, e.currentTarget.value.trim())
                                      e.currentTarget.value = ''
                                    }
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div className="mt-4 flex items-center justify-center py-2">
                        {renderStatusIndicator(file.status)}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Submit All Button */}
      {files.length > 0 && files.some(f => f.status === 'completed') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <motion.button
            onClick={submitAllImages}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={files.every(f => f.status !== 'completed')}
            className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#00ff66',
              color: '#000000'
            }}
          >
            Submit for Quality Review ({files.filter(f => f.status === 'completed').length})
          </motion.button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#1a1a1a' }}
        >
          <ImageIcon className="h-8 w-8 text-blue-400 mb-4" />
          <h3 className="font-bold text-gray-100 mb-2">High Quality</h3>
          <p className="text-gray-300 text-sm">
            Upload high-resolution images with excellent technical quality
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#1a1a1a' }}
        >
          <ImageIcon className="h-8 w-8 text-green-400 mb-4" />
          <h3 className="font-bold text-gray-100 mb-2">AI Metadata</h3>
          <p className="text-gray-300 text-sm">
            Our AI will automatically generate keywords, tags, and descriptions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#1a1a1a' }}
        >
          <ImageIcon className="h-8 w-8 text-purple-400 mb-4" />
          <h3 className="font-bold text-gray-100 mb-2">Quick Approval</h3>
          <p className="text-gray-300 text-sm">
            Fast review process to get your images live and earning quickly
          </p>
        </motion.div>
      </div>
    </div>
  )
}