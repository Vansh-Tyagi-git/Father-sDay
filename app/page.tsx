import React from 'react'
import CanvasScroller from '../components/CanvasScroller'

export default function Page() {
  return (
    <main>
      <CanvasScroller />

      <section className="min-h-screen flex items-center justify-center bg-softBeige">
        <div className="max-w-3xl text-center py-24">
          <h3 className="text-4xl font-semibold text-heading">Celebrate Every Memory</h3>
          <p className="mt-4 text-lg text-body">A tribute to every father who inspires, guides, and supports unconditionally.</p>
          <div className="mt-8 flex gap-4 justify-center">
            <button className="px-6 py-3 rounded-full cta">Watch Again</button>
            <button className="px-6 py-3 rounded-full border border-gray-200">Share This Story</button>
          </div>
        </div>
      </section>
    </main>
  )
}
