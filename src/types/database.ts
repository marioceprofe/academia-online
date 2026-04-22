export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      perfiles: {
        Row: {
          id: string
          nombre: string | null
          apellidos: string | null
          avatar_url: string | null
          plan: 'gratuito' | 'basico' | 'premium'
          creado_en: string
          actualizado_en: string
        }
        Insert: {
          id: string
          nombre?: string | null
          apellidos?: string | null
          avatar_url?: string | null
          plan?: 'gratuito' | 'basico' | 'premium'
        }
        Update: {
          nombre?: string | null
          apellidos?: string | null
          avatar_url?: string | null
          plan?: 'gratuito' | 'basico' | 'premium'
        }
      }
      cursos: {
        Row: {
          id: string
          titulo: string
          descripcion: string | null
          imagen_url: string | null
          precio: number
          plan_requerido: 'gratuito' | 'basico' | 'premium'
          publicado: boolean
          orden: number
          creado_en: string
        }
        Insert: {
          titulo: string
          descripcion?: string | null
          imagen_url?: string | null
          precio?: number
          plan_requerido?: 'gratuito' | 'basico' | 'premium'
          publicado?: boolean
          orden?: number
        }
        Update: {
          titulo?: string
          descripcion?: string | null
          imagen_url?: string | null
          precio?: number
          plan_requerido?: 'gratuito' | 'basico' | 'premium'
          publicado?: boolean
          orden?: number
        }
      }
      lecciones: {
        Row: {
          id: string
          curso_id: string
          titulo: string
          descripcion: string | null
          video_url: string | null
          duracion_segundos: number | null
          orden: number
          es_preview: boolean
          creado_en: string
        }
        Insert: {
          curso_id: string
          titulo: string
          descripcion?: string | null
          video_url?: string | null
          duracion_segundos?: number | null
          orden?: number
          es_preview?: boolean
        }
        Update: {
          titulo?: string
          descripcion?: string | null
          video_url?: string | null
          duracion_segundos?: number | null
          orden?: number
          es_preview?: boolean
        }
      }
      matriculas: {
        Row: {
          id: string
          usuario_id: string
          curso_id: string
          creado_en: string
        }
        Insert: { usuario_id: string; curso_id: string }
        Update: Record<string, never>
      }
      progreso_lecciones: {
        Row: {
          id: string
          usuario_id: string
          leccion_id: string
          completado: boolean
          creado_en: string
        }
        Insert: { usuario_id: string; leccion_id: string; completado?: boolean }
        Update: { completado?: boolean }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      plan_tipo: 'gratuito' | 'basico' | 'premium'
    }
  }
}

// Tipos derivados útiles
export type Perfil = Database['public']['Tables']['perfiles']['Row']
export type Curso  = Database['public']['Tables']['cursos']['Row']
export type Leccion = Database['public']['Tables']['lecciones']['Row']
export type Matricula = Database['public']['Tables']['matriculas']['Row']
