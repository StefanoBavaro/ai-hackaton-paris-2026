import type { UIBlock } from "@/lib/types"
import { MetricCard } from "./blocks/metric-card"
import { MetricGrid } from "./blocks/metric-grid"
import { GeoMap } from "./blocks/geo-map"
import { BarChartBlock } from "./blocks/bar-chart"
import { DataTable } from "./blocks/data-table"
import { RichText } from "./blocks/rich-text"
import { SparklineTable } from "./blocks/sparkline-table"
import { TwoColumnText } from "./blocks/two-column-text"
import { DistributionTable } from "./blocks/distribution-table"
import { RankingTable } from "./blocks/ranking-table"

interface RenderBlockProps {
  block: UIBlock
}

export function RenderBlock({ block }: RenderBlockProps) {
  switch (block.type) {
    case "metric_card":
      return <MetricCard {...block} />
    case "metric_grid":
      return <MetricGrid {...block} />
    case "map":
      return <GeoMap {...block} />
    case "bar_chart":
      return <BarChartBlock {...block} />
    case "table":
      return <DataTable {...block} />
    case "rich_text":
      return <RichText {...block} />
    case "sparkline_table":
      return <SparklineTable {...block} />
    case "two_column_text":
      return <TwoColumnText {...block} />
    case "distribution_table":
      return <DistributionTable {...block} />
    case "ranking_table":
      return <RankingTable {...block} />
    default:
      return null
  }
}
