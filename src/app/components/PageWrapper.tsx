"use client"

import React, { ReactNode } from 'react'

interface PageWrapperProps {
  loading: boolean
  error?: string | boolean | null
  children: ReactNode
  className?: string
}

export default function PageWrapper({ loading, error, children, className = '' }: PageWrapperProps) {
  if (loading) {
    return (
      <div className={className || 'flex items-center justify-center min-h-screen'}>
        <div>Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={className || 'flex items-center justify-center min-h-screen'}>
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return <div className={className}> {children} </div>
}
