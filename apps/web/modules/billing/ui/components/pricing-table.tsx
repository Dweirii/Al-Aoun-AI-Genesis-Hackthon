"use client";

import { PricingTable as ClerkPricingTable } from "@clerk/nextjs";

export const PricingTable = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <ClerkPricingTable
        for="organization"
        appearance={{
          baseTheme: "dark" as any, // TypeScript workaround if baseTheme does not accept string "dark"
          variables: {
            colorPrimary: "#0CA94C",
            colorBackground: "hsl(var(--background))",
            colorInputBackground: "hsl(var(--background))",
            colorText: "hsl(var(--foreground))",
            colorTextSecondary: "hsl(var(--foreground))",
            colorInputText: "hsl(var(--foreground))",
            borderRadius: "0.5rem",
          },
          elements: {
            pricingTableCard: "shadow-none! border! rounded-lg! bg-card!",
            pricingTableCardHeader: "bg-[#171717]! text-card-foreground!",
            pricingTableCardBody: "bg-[#171717]! text-card-foreground!",
            pricingTableCardFooter: "bg-[#171717]! text-card-foreground!",
            pricingTableButton: "bg-primary! text-primary-foreground! hover:bg-primary/90!",
            pricingTableBadge: "bg-primary! text-primary-foreground!",
          }
        }}
      />
    </div>
  )
};