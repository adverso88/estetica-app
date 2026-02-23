'use client'

import { useRef, useState, useEffect } from 'react'

interface SignaturePadProps {
    onSave: (dataUrl: string) => void
    onClear?: () => void
    label?: string
}

export function SignaturePad({ onSave, onClear, label = "Firme aquí con el dedo o mouse" }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const resizeCanvas = () => {
            const parent = containerRef.current
            if (parent) {
                canvas.width = parent.clientWidth
                canvas.height = 200
            }
        }

        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.strokeStyle = '#2D3748'
            ctx.lineWidth = 2
            ctx.lineJoin = 'round'
            ctx.lineCap = 'round'
        }

        return () => window.removeEventListener('resize', resizeCanvas)
    }, [])

    const startDrawing = (e: any) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const rect = canvas.getBoundingClientRect()
        const x = (e.clientX || e.touches[0].clientX) - rect.left
        const y = (e.clientY || e.touches[0].clientY) - rect.top

        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.beginPath()
            ctx.moveTo(x, y)
            setIsDrawing(true)
        }
    }

    const draw = (e: any) => {
        if (!isDrawing) return
        const canvas = canvasRef.current
        if (!canvas) return
        const rect = canvas.getBoundingClientRect()
        const x = (e.clientX || e.touches[0].clientX) - rect.left
        const y = (e.clientY || e.touches[0].clientY) - rect.top

        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.lineTo(x, y)
            ctx.stroke()
        }
    }

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false)
            const canvas = canvasRef.current
            if (canvas) {
                onSave(canvas.toDataURL())
            }
        }
    }

    const clear = () => {
        const canvas = canvasRef.current
        if (canvas) {
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                if (onClear) onClear()
            }
        }
    }

    return (
        <div className="space-y-3" ref={containerRef}>
            <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">{label}</label>
            <div className="relative border-2 border-dashed border-primary-200 rounded-2xl bg-white overflow-hidden shadow-inner">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full cursor-crosshair touch-none"
                />
                <button
                    type="button"
                    onClick={clear}
                    className="absolute bottom-3 right-3 text-[10px] font-bold text-primary-500 bg-blush px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors"
                >
                    BORRAR
                </button>
            </div>
        </div>
    )
}
