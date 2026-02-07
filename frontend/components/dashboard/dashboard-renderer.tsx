"use client"

import React from 'react'
import { Renderer } from '@json-render/react'
import { registry } from '@/lib/json-render'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DashboardRendererProps {
    spec: any
}

export function DashboardRenderer({ spec }: DashboardRendererProps) {
    if (!spec || !spec.blocks) return null

    const chaos = spec.chaos || {}

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
                    ease: "linear"
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
                    ease: "linear"
                }
            }
        }
        return {}
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
            {spec.blocks.map((block: any, index: number) => (
                <div
                    key={index}
                    className={cn(
                        block.type === 'executive-summary' || block.type === 'line-chart' || block.type === 'event-timeline' || block.type === 'candlestick-chart' || block.type === 'correlation-matrix' ? 'col-span-full' : '',
                        isMatrix ? "border border-[#00FF41] p-2" : ""
                    )}
                >
                    <Renderer
                        spec={block}
                        registry={registry}
                    />
                </div>
            ))}
        </motion.div>
    )
}
