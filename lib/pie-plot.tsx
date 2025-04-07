"use client";

import * as d3 from "d3";
import { useRef, useState, useEffect } from "react";
import { useFetchDiscussionJson } from "#/utils.ts/fetch-data";
import clsx from "clsx";

export default function Pie() {
  return <PieChart />;
}

function PieChart() {
  const [width, setWidth] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const height = 200;

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);
  const dataFetch = useFetchDiscussionJson("/test-data/test1.json");

  useEffect(() => {
    if (svgRef.current) {
      setWidth(svgRef.current.getBoundingClientRect().width);
    }
  }, [dataFetch]);

  let data:
    | {
        name: string;
        value: number;
      }[]
    | undefined = undefined;
  const dataMap = new Map();
  if (dataFetch !== undefined) {
    dataFetch.data.repository.discussions.edges.forEach((item) => {
      if (dataMap.has(item.node.category.name)) {
        let value = dataMap.get(item.node.category.name);
        dataMap.set(item.node.category.name, value + 1);
      } else {
        dataMap.set(item.node.category.name, 1);
      }
    });
    data = Array.from(dataMap, ([key, value]) => ({
      name: key,
      value: value,
    })).sort((a, b) => b.value - a.value);
  }

  if (data === undefined) return null;

  const radius = Math.min(width, height) / 2;

  const pie = d3.pie<{ name: string; value: number }>().value((d) => d.value);

  const arcs = pie(data);
  const arc = d3
    .arc<d3.PieArcDatum<{ name: string; value: number }>>()
    .innerRadius(radius - 30)
    .outerRadius(radius);

  const color = d3
    .scaleOrdinal<string>()
    .domain(data.map((d) => d.name))
    .range(d3.schemeCategory10);

  return (
    <div>
      <svg ref={svgRef} className="w-full" height={height}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {/* Pie slices */}
          {arcs.map((d, i) => {
            const [x, y] = arc.centroid(d);

            return (
              <path
                key={i}
                fill={color(d.data.name)}
                d={arc(d)!}
                className="transition-all duration-300 ease-out hover:opacity-80"
                onMouseEnter={(e) =>
                  setTooltip({
                    x: x + width / 2,
                    y: y + height / 2,
                    text: d.data.name + ": " + d.data.value,
                  })
                }
                onMouseLeave={() => setTooltip(null)}
              >
                {/* <title>{d.data.name + ": " + d.data.value}</title> */}
              </path>
            );
          })}
        </g>
      </svg>

      <div
        className={clsx(
          "absolute rounded-md shadow-lg flex-col text-sm text-white z-20",
          {
            " opacity-100 transition-opacity delay-150 duration-150":
              tooltip !== null,
            " opacity-0": tooltip == null,
          }
        )}
        style={{
          left: tooltip?.x,
          top: tooltip?.y,
        }}
      >
        <div className=" bg-gray-600 px-2 py-1 flex flex-row gap-x-2 ">
          <div className=" p-1 m-auto rounded-full bg-blue-400"></div>
          <div>{tooltip?.text}</div>
        </div>
      </div>
      <div className=" absolute right-1 top-1">
        {arcs.slice(0, 3).map((d, i) => (
          <div key={i} className=" flex flex-row gap-1">
            <div
              className=" p-1"
              style={{
                background: color(d.data.name),
              }}
            ></div>
            <div className=" text-xs">{d.data.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
