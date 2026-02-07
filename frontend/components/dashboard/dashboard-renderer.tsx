"use client"

import React from 'react'
import { Renderer } from '@json-render/react'
import { registry } from '@/lib/json-render'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { DashboardSpec, Block } from '@/lib/types'
import { validateBlock } from '@/lib/validate'

const FULL_WIDTH_TYPES = new Set([
    'executive-summary',
    'line-chart',
    'event-timeline',
    'candlestick-chart',
    'correlation-matrix',
])

interface DashboardRendererProps {
    spec: DashboardSpec
}

function BlockErrorFallback({ errors }: { errors: string[] }) {
    return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Could not render this block</p>
            <ul className="mt-1 list-disc pl-4 text-xs">
                {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
        </div>
    )
}

export function DashboardRenderer({ spec }: DashboardRendererProps) {
    if (!spec || !Array.isArray(spec.blocks)) return null

    const chaos = spec.chaos ?? {}
    const isMatrix = chaos.theme === 'matrix'

    const getAnimationProps = () => {
        if (chaos.animation === 'wobble') {
            return {
                animate: {
                    x: [0, -10, 10, -10, 10, 0],
                    rotate: [0, -2, 2, -2, 2, 0],
                },
                transition: {
                    duration: 0.5,
                    repeat: Infinity,
                    ease: "linear" as const,
                }
            }
        }
        if (chaos.animation === 'rainbow') {
            return {
                animate: {
                    filter: [
                        'hue-rotate(0deg)',
                        'hue-rotate(360deg)'
                    ],
                },
                transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear" as const,
                }
            }
        }
        return {} as { animate?: Record<string, unknown>; transition?: Record<string, unknown> }
    }

    const animationProps = getAnimationProps()

    return (
        <motion.div
            className={cn(
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 rounded-xl",
                isMatrix ? "bg-black text-[#00FF41] font-mono border-2 border-[#00FF41]" : ""
            )}
            animate={{
                rotate: chaos.rotation || 0,
                fontFamily: chaos.fontFamily || 'inherit',
                ...animationProps.animate
            }}
            transition={{
                duration: 2,
                ...animationProps.transition
            }}
        >
            {spec.blocks.map((block: Block, index: number) => {
                const errors = validateBlock(block, index)
                if (errors.length > 0) {
                    return (
                        <div key={index} className="col-span-full">
                            <BlockErrorFallback errors={errors} />
                        </div>
                    )
                }

                return (
                    <div
                        key={index}
                        className={cn(
                            FULL_WIDTH_TYPES.has(block.type) ? 'col-span-full' : '',
                            isMatrix ? "border border-[#00FF41] p-2" : ""
                        )}
                    >
                        <Renderer
                            spec={block}
                            registry={registry}
                        />
                    </div>
                )
            })}
        </motion.div>
    )
}
