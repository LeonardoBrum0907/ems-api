import { db } from "../drizzle/client"
import { reports } from "../drizzle/schema/reports"

interface CreateReportParams {
   date: string
   line?: string
   tag?: string
   problem: string
   cause?: string
   correctiveAction?: string
   preventiveAction?: string
   fullReport: string
   originalData: any
}

export async function createReport(params: CreateReportParams) {
   const [{ reportId }] = await db.insert(reports).values({
      ...params,
      originalData: params.originalData
   }).returning({ reportId: reports.id })

   const score = calculateReportScore({ ...params })

   return { reportId, score }
}

function calculateReportScore({
   date,
   line,
   tag,
   problem,
   cause,
   correctiveAction,
   preventiveAction
}: {
   date?: string
   line?: string
   tag?: string
   problem?: string
   cause?: string
   correctiveAction?: string
   preventiveAction?: string
}) {
   let score = 0

   if (date) score += 10
   if (line) score += 10
   if (tag) score += 10
   if (problem) score += 10
   if (cause) score += 10
   if (correctiveAction) score += 10
   if (preventiveAction) score += 10

   return score
}