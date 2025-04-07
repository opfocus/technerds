"use client";

import { useFetchDiscussionJson } from "#/utils.ts/fetch-data";
import { useEffect, useState } from "react";
import * as d3 from "d3";

type Metricitem = {
  average: string;
  median: string;
  percentile: string;
};
type Mterics = {
  responses: Metricitem;
  close: Metricitem;
  answer: Metricitem;
};

export default function Other() {
  const [metrics, setMetrics] = useState<Mterics>();
  const dataFetch = useFetchDiscussionJson("/test-data/test1.json");
  const e = dataFetch?.data.repository.discussions.edges;

  useEffect(() => {
    if (e !== undefined) {
      // declare some array to store minutes
      let responses = [];
      let closes = [];
      let answers = [];

      for (let i = 0; i < e.length; i++) {
        if (e[i].node.comments.edges.length !== 0) {
          const diffMs =
            new Date(e[i].node.comments.edges[0].node.createdAt).getTime() -
            new Date(e[i].node.createdAt).getTime();

          responses.push(Math.floor(diffMs / 1000 / 60));
        }
        if (e[i].node.closedAt != null) {
          const diffMs =
            new Date(e[i].node.closedAt!).getTime() -
            new Date(e[i].node.createdAt).getTime();

          closes.push(Math.floor(diffMs / 1000 / 60));
        }
        if (e[i].node.answerChosenAt != null) {
          const diffMs =
            new Date(e[i].node.answerChosenAt!).getTime() -
            new Date(e[i].node.createdAt).getTime();

          answers.push(Math.floor(diffMs / 1000 / 60));
        }
      }
      const res: Metricitem = {
        average: formattedTime(d3.mean(responses)!),
        median: formattedTime(d3.median(responses)!),
        percentile: formattedTime(
          d3.quantile(responses.sort(d3.ascending), 0.9)!
        ),
      };

      const clo: Metricitem = {
        average: formattedTime(d3.mean(closes)!),
        median: formattedTime(d3.median(closes)!),
        percentile: formattedTime(d3.quantile(closes.sort(d3.ascending), 0.9)!),
      };

      const ans: Metricitem = {
        average: formattedTime(d3.mean(answers)!),
        median: formattedTime(d3.median(answers)!),
        percentile: formattedTime(
          d3.quantile(answers.sort(d3.ascending), 0.9)!
        ),
      };
      setMetrics({
        responses: res,
        close: clo,
        answer: ans,
      });
    }
  }, [dataFetch]);

  if (metrics !== undefined)
    return (
      <table className=" table-auto w-full">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Average</th>
            <th>Median</th>
            <th>90th percentile</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Time to first response</td>
            <td className=" text-right">{metrics.responses.average}</td>
            <td className=" text-right">{metrics.responses.median}</td>
            <td className=" text-right">{metrics.responses.percentile}</td>
          </tr>
          <tr>
            <td>Time to close</td>
            <td className=" text-right">{metrics.close.average}</td>
            <td className=" text-right">{metrics.close.median}</td>
            <td className=" text-right">{metrics.close.percentile}</td>
          </tr>
          <tr>
            <td>Time to answer</td>
            <td className=" text-right">{metrics.answer.average}</td>
            <td className=" text-right">{metrics.answer.median}</td>
            <td className=" text-right">{metrics.answer.percentile}</td>
          </tr>
        </tbody>
      </table>
    );
}

function formattedTime(total: number) {
  const days = Math.floor(total / (60 * 24));
  const hours = Math.floor((total % (60 * 24)) / 60);
  const minutes = Math.floor(total % 60);
  if (days !== 0) return `${days}d ${hours}h ${minutes}m`;
  return `${hours}h ${minutes}m`;
}
