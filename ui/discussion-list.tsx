"use client";

import { useFetchDiscussionJson } from "#/utils.ts/fetch-data";
import Link from "next/link";

export default function DiscussionList() {

  const data = useFetchDiscussionJson("test-data/test1.json") 
  const e = data?.data.repository.discussions.edges
  if (e !== undefined)
  return (
    <div className="mx-auto bg-gray-50 p-6">
      <table className=" table-auto opacity-80">
        <caption className=" text-lg font-semibold p-6">
          Discussion_March List
        </caption>
        <thead>
          <tr className=" text-sm">
            <th>id</th>
            <th>title</th>
            <th>url</th>
            <th>Author</th>
            <th>category</th>
            <th>createdAt</th>
            <th>closedAt</th>
            <th>answerChosenAt</th>
            <th>answer</th>
            <th>Participants</th>
          </tr>
        </thead>
        <tbody>
          {e.map((item, i) => (
            <tr
              key={item.node.id}
              className=" text-sm border-b border-solid border-gray-200"
            >
              <td className=" p-2">{i}</td>
              <td className=" p-2 w-1/4">{item.node.title}</td>
              <td className=" p-2">
                <Link
                  className=" underline"
                  href={item.node.url}
                  target="black"
                >
                  Link
                </Link>
              </td>
              <td className=" p-2">
                <Link
                  className=" underline"
                  target="black"
                  href={`https://github.com/${item.node.author.login}`}
                >
                  {item.node.author.login}
                </Link>
              </td>
              <td className=" p-2">{item.node.category.name}</td>
              <td className="p-2">
                {new Date(item.node.createdAt)
                  .toISOString()
                  .slice(0, 16)
                  .replace("T", " ")}
              </td>
              <td className=" p-2">
                {item.node.closedAt
                  ? new Date(item.node.closedAt)
                      .toISOString()
                      .slice(0, 16)
                      .replace("T", " ")
                  : ""}
              </td>
              <td className=" p-2">
                {item.node.answerChosenAt
                  ? new Date(item.node.answerChosenAt)
                      .toISOString()
                      .slice(0, 16)
                      .replace("T", " ")
                  : ""}
              </td>
              <td className=" p-2">{item.node.answer?.author.login}</td>
              <td className=" p-2">
                {item.node.comments?.edges
                  .map((i) => i.node.author.login)
                  .join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}

