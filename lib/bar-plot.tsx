"use client";

import * as d3 from "d3";
import clsx from "clsx";
import { useEffect, useRef, useState, useMemo } from "react";
import { useFetchDiscussionJson } from "#/utils.ts/fetch-data";

type DataItem = {
  Date: string;
  Created: number;
  Closed: number;
};

export default function Bar() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  const height = 400,
    margin = { top: 20, right: 30, bottom: 30, left: 40 };

  const dataFetch = useFetchDiscussionJson("/test-data/test1.json");
  const dataMap = new Map<
    Date,
    {
      created: number;
      closed: number;
    }
  >();

  const weeks = {
    week1: {
      start: new Date("2025-03-03"),
      end: new Date("2025-03-09"),
    },
    week2: {
      start: new Date("2025-03-10"),
      end: new Date("2025-03-17"),
    },
    week3: {
      start: new Date("2025-03-18"),
      end: new Date("2025-03-23"),
    },
    week4: {
      start: new Date("2025-03-24"),
      end: new Date("2025-03-30"),
    },
  };
  dataMap
    .set(weeks.week4.end, {
      created: 0,
      closed: 0,
    })
    .set(weeks.week3.end, {
      created: 0,
      closed: 0,
    })
    .set(weeks.week2.end, {
      created: 0,
      closed: 0,
    })
    .set(weeks.week1.end, {
      created: 0,
      closed: 0,
    });
  if (dataFetch !== undefined) {
    dataFetch.data.repository.discussions.edges.forEach((item) => {
      const createdAt = new Date(item.node.createdAt!.slice(0, 10));
      const closedAt = new Date(
        item.node.closedAt ? item.node.closedAt.slice(0, 10) : ""
      );

      if (createdAt > weeks.week4.end) {
      } else if (createdAt > weeks.week3.end) {
        const { created, closed } = dataMap.get(weeks.week4.end)!;
        dataMap.set(weeks.week4.end, { created: created + 1, closed: closed });
      } else if (createdAt > weeks.week2.end) {
        const { created, closed } = dataMap.get(weeks.week3.end)!;
        dataMap.set(weeks.week3.end, { created: created + 1, closed: closed });
      } else if (createdAt > weeks.week1.end) {
        const { created, closed } = dataMap.get(weeks.week2.end)!;
        dataMap.set(weeks.week2.end, { created: created + 1, closed: closed });
      } else if (createdAt >= weeks.week1.start) {
        const { created, closed } = dataMap.get(weeks.week1.end)!;
        dataMap.set(weeks.week1.end, { created: created + 1, closed: closed });
      } else {
      }
      if (closedAt > weeks.week4.end) {
      } else if (closedAt > weeks.week3.end) {
        const { created, closed } = dataMap.get(weeks.week4.end)!;
        dataMap.set(weeks.week4.end, { created: created, closed: closed + 1 });
      } else if (closedAt > weeks.week2.end) {
        const { created, closed } = dataMap.get(weeks.week3.end)!;
        dataMap.set(weeks.week3.end, {
          created: created,
          closed: closed + 1,
        });
      } else if (closedAt >= weeks.week1.end) {
        const { created, closed } = dataMap.get(weeks.week2.end)!;
        dataMap.set(weeks.week2.end, {
          created: created,
          closed: closed + 1,
        });
      } else if (closedAt >= weeks.week1.start) {
        const { created, closed } = dataMap.get(weeks.week1.end)!;
        dataMap.set(weeks.week1.end, {
          created: created,
          closed: closed + 1,
        });
      }
    });
  }
  const data = Array.from(dataMap, ([key, num]) => ({
    Date: key.toISOString().slice(6, 10),
    Closed: num.closed,
    Created: num.created,
  })).reverse();

  useEffect(() => {
    if (svgRef.current) {
      setWidth(svgRef.current.getBoundingClientRect().width);
    }
  }, [data]);

  const { x, subX, y } = useMemo(() => {
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.Date))
      .range([margin.left, width - margin.right])
      .padding(0.6);

    const subX = d3
      .scaleBand()
      .domain(["Created", "Closed"])
      .range([0, x.bandwidth()])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) => Math.max(d.Closed, d.Created) + 10) ?? 100,
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    return { x, subX, y };
  }, [width]);

  console.warn("data:", data);

  return (
    <div>
      <svg ref={svgRef} className="w-full" height={height}>
        <g transform={`translate(0,${height - margin.bottom})`}>
          {x.domain().map((d) => (
            <text
              key={d}
              x={x(d)! + x.bandwidth() / 2}
              y={15}
              textAnchor="middle"
              fontSize="12px"
              fill="black"
            >
              {d}
            </text>
          ))}
        </g>

        <g transform={`translate(${margin.left},0)`}>
          {y.ticks(5).map((tick) => (
            <g key={tick} transform={`translate(0,${y(tick)})`}>
              <line x2={width - margin.right} stroke="gray" strokeWidth={0.5} />
              <text
                x={-10}
                dy="0.32em"
                textAnchor="end"
                fontSize="12px"
                fill="black"
              >
                {tick}
              </text>
            </g>
          ))}
        </g>

        {data.flatMap((d) =>
          ["Closed", "Created"].map((group) => {
            const value = d[group as keyof DataItem] as number;
            return (
              <g key={`${d.Date}-${group}`}>
                <rect
                  x={x(d.Date)! + subX(group)!}
                  y={y(value)}
                  width={subX.bandwidth()}
                  height={y(0) - y(value)}
                  fill={group === "Closed" ? "steelblue" : "orange"}
                  onMouseEnter={() =>
                    setTooltip({
                      x: x(d.Date)! + subX(group)! + subX.bandwidth() / 2,
                      y: y(value) - 10,
                      text: `${group}: ${value}`,
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                  className=" hover:opacity-80"
                />
              </g>
            );
          })
        )}
      </svg>

      <div
        className={clsx(
          "absolute rounded-md shadow-lg flex-col text-sm text-white",
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
        <div className=" bg-gray-800  px-2 py-1 ">Discussion</div>
        <div className=" bg-gray-600 px-2 py-1 flex flex-row gap-x-2">
          <div className=" p-1 m-auto rounded-full bg-blue-400"></div>
          <div>{tooltip?.text}</div>
        </div>
      </div>
    </div>
  );
}
