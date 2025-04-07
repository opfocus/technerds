"use client"

import * as d3 from "d3"
import { chatSizeProps } from "./type"
import { useEffect, useRef, useState } from "react"
type dataProps = {
  date: Date;
  close: number
}

export default function Area() {
  const [data, setData] = useState<dataProps[]>()

  useEffect(() => {
    d3.csv("/test-data/aapl.csv")
      .then(d => {
        const fomattedData: dataProps[] = d.map(row => ({
          date: new Date(row.date),
          close: parseFloat(row.close),
        }))
        setData(mergeData(fomattedData))
      })
  }, [])
  

  if (data === undefined)
    return null

  return (
    <AreaPlot data={data} />
  )
}



const mergeData = (data: dataProps[]): dataProps[] => {
  const grouped = new Map<string, { sum: number; count: number }>();

  data.forEach(({ date, close }) => {
    const key = date.toISOString().slice(0, 7) + '-01'; 
    if (!grouped.has(key)) {
      grouped.set(key, { sum: close, count: 1 });
    } else {
      const entry = grouped.get(key)!;
      entry.sum += close;
      entry.count += 1;
    }
  });

  return Array.from(grouped, ([date, { sum}]) => ({
    date: new Date(date),
    close: sum , 
  }));
};

function AreaPlot({
  data,
  marginTop = 20,
  marginRight = 30,
  marginBottom = 30,
  marginLeft = 40
}: { data: dataProps[] } & chatSizeProps) {
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)
  const gx = useRef<SVGSVGElement>(null)
  const gy = useRef<SVGSVGElement>(null)

  
  useEffect(() => {
    if (svgRef.current) {
      setHeight(svgRef.current.getBoundingClientRect().height);
      setWidth(svgRef.current.getBoundingClientRect().width);
    }
  }, []);

  const x = d3.scaleUtc(d3.extent(data, d => d.date) as [Date, Date], [marginLeft, width - marginRight])
  // const y = d3.scaleLinear(d3.extent(data, d => d.close) as [number, number], [height - marginBottom, marginTop])
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d=> d.close) as number])
    .range([height - marginBottom, marginTop])
  const area = d3.line<dataProps>()
    .x(d => x(d.date))
    .y(d => y(d.close))
    .curve(d3.curveCatmullRom.alpha(0.5))

  useEffect(() => {
    if (gx.current)
      d3.select(gx.current).call(d3.axisBottom(x))
  }, [gx, x])
  // useEffect(() => {
  //   if (gy.current)
  //     d3.select(gy.current).call(d3.axisLeft(y))
  // }, [gy, y])

  return (
    <svg ref={svgRef} className=" text-blue-400 w-full">
      <g ref={gx} transform={`translate(0, ${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft}, 0)`} />
      <path className=" fill-none stroke-blue-400 "  strokeWidth={3} d={area(data) as string | undefined} />
    </svg>
  )
}