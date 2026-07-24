import { createClient } from '@supabase/supabase-js'

// Saca BOM (﻿) y espacios invisibles que a veces quedan al pegar
// la variable de entorno desde un .env guardado como "UTF-8 con BOM" en
// Windows — ese caracter rompe la creación de headers HTTP en el navegador.
const clean = (value) => value?.replace(/^﻿/, '').trim()

const supabaseUrl = clean(import.meta.env.VITE_SUPABASE_URL)
const supabaseAnonKey = clean(import.meta.env.VITE_SUPABASE_ANON_KEY)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase. Revisá .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
