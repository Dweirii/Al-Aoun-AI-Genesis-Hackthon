"use client";

import { PricingTable } from "../components/pricing-table";

export const BillingView = () => {
  return (
    <div className="flex min-h-screen flex-col bg-muted p-6 md:p-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold md:text-4xl">Plans & Billing</h1>
          <p className="text-muted-foreground">
            Choose the plan that&apos;s right for you
          </p>
        </div>

        <PricingTable />
      </div>
    </div>
  )
}