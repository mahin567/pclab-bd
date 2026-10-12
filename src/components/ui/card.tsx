import * as React from "react"
import { cn } from "@/lib/utils"

const mk = <T extends HTMLElement>(Tag: any, base: string, name: string) => {
  const C = React.forwardRef<T, React.HTMLAttributes<T>>(({ className, ...props }, ref) => (
    <Tag ref={ref} className={cn(base, className)} {...props} />
  ))
  C.displayName = name
  return C
}
const Card = mk<HTMLDivElement>("div", "rounded-lg border bg-card text-card-foreground shadow-sm", "Card")
const CardHeader = mk<HTMLDivElement>("div", "flex flex-col space-y-1.5 p-6", "CardHeader")
const CardTitle = mk<HTMLHeadingElement>("h3", "text-2xl font-semibold leading-none tracking-tight", "CardTitle")
const CardDescription = mk<HTMLParagraphElement>("p", "text-sm text-muted-foreground", "CardDescription")
const CardContent = mk<HTMLDivElement>("div", "p-6 pt-0", "CardContent")
const CardFooter = mk<HTMLDivElement>("div", "flex items-center p-6 pt-0", "CardFooter")
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
