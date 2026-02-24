'use client'

import { useState } from 'react'
import { SignaturePad } from '@/components/ui/signature-pad'
import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function ConsentimientoFirmaDemo() {
    const [signed, setSigned] = useState(false)
    const [signatureData, setSignatureData] = useState('')

    const handleSave = () => {
        if (!signatureData) return alert('Por favor, firme el documento primero.')
        setSigned(true)
    }

    if (signed) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-6 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-lg animate-bounce">
                    <CheckCircle2 size={40} />
                </div>
                <div className="space-y-2">
                    <h1 className="font-heading text-3xl font-bold text-foreground">¡Documento Firmado!</h1>
                    <p className="text-foreground-secondary">
                        El consentimiento para <strong>Botox Preventivo</strong> ha sido guardado con éxito y vinculado a tu historial.
                    </p>
                </div>
                <div className="w-full max-w-xs p-4 bg-blush/20 rounded-2xl border border-primary-100 text-xs text-foreground-muted italic">
                    ID de Integridad: {Math.random().toString(36).substring(7).toUpperCase()} - IP: 186.21.31.2
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-blush/10 p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                        <Shield className="w-8 h-8 text-primary-600" />
                    </div>
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-foreground">Consentimiento Informado</h1>
                        <p className="text-sm text-foreground-secondary">Procedimiento: Botox Facial Preventivo</p>
                    </div>
                </div>

                <div className="card-elevated p-8 space-y-6 text-sm text-foreground-secondary leading-relaxed max-h-[40vh] overflow-y-auto bg-white/80 backdrop-blur">
                    <h3 className="font-bold text-foreground">1. Descripción del Tratamiento</h3>
                    <p>
                        El tratamiento consiste en la aplicación de toxina botulínica mediante micro-inyecciones en zonas específicas para relajar los músculos y prevenir/suavizar arrugas de expresión.
                    </p>
                    <h3 className="font-bold text-foreground">2. Riesgos e Información Importante</h3>
                    <p>
                        Entiendo que pueden aparecer hematomas leves, edema o cefalea transitoria. Se me ha informado que los resultados finales se aprecian a los 14 días.
                    </p>
                    <p>
                        Declaro no estar embarazada, no padecer miastenia gravis ni tener infecciones activas en la zona de aplicación.
                    </p>
                    <p>
                        Autorizo el uso de fotografías previas y posteriores con fines estrictamente médicos y de seguimiento evolutivo en mi ficha clínica.
                    </p>
                </div>

                <div className="card-elevated p-6 bg-white space-y-6">
                    <SignaturePad
                        onSave={(data) => setSignatureData(data)}
                        label="Firme aquí para confirmar su consentimiento"
                    />

                    <button
                        onClick={handleSave}
                        className="w-full btn-primary py-4 text-lg font-bold shadow-rose flex items-center justify-center gap-3 group"
                    >
                        FIRMADO Y CONFIRMAR <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <p className="text-center text-[10px] text-foreground-muted px-10">
                    Al hacer clic en "Confirmar", usted acepta los términos descritos arriba bajo la normativa de protección de datos personales.
                </p>
            </div>
        </div>
    )
}
