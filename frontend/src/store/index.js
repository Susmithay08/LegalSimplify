import { create } from 'zustand'

const API = '/api'

export const useStore = create((set) => ({
  result: null,
  loading: false,
  error: null,

  analyze: async (text) => {
    set({ loading: true, error: null, result: null })
    try {
      const r = await fetch(`${API}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      if (!r.ok) {
        const err = await r.json()
        throw new Error(err.detail || 'Analysis failed')
      }
      const data = await r.json()
      set({ result: data, loading: false })
    } catch (e) {
      set({ error: e.message, loading: false })
    }
  },

  reset: () => set({ result: null, error: null }),
}))
