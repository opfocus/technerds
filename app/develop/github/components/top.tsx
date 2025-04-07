"use client";

import Link from "next/link";
import {
  useFetchDiscussionJson,
  sortDiscussionsByUniqueCommenters,
} from "#/utils.ts/fetch-data";

export default function Top() {
  const data = useFetchDiscussionJson("/test-data/test1.json");
  const e = data
    ? sortDiscussionsByUniqueCommenters(data).slice(0, 5)
    : undefined;
  if (e !== undefined)
    return (
      <div className=" w-full p-4 flex flex-col gap-y-4 shadow-md bg-gray-50 rounded-md">
        <h3 className=" font-semibold">Most Participants</h3>
        <table className=" table-auto text-sm opacity-80">
          <thead>
            <tr>
              <th className=" p-4">Title</th>
              <th className="  p-4">Author</th>
              <th className="  p-4">Participants</th>
            </tr>
          </thead>
          <tbody>
            {e.map((item) => (
              <tr key={item.id}>
                <td className=" text-left p-4">
                  <Link href={item.url} target="black"
                  className=" underline"
                  >
                    {item.title.split("]").slice(1)}
                  </Link>
                </td>
                <td className=" text-left p-4">
                  <Link
                    className=" underline"
                    target="black"
                    href={`https://github.com/${item.author.login}`}
                  >
                    {item.author.login}
                  </Link>
                </td>
                <td className=" text-left p-4">
                  {item.comments?.edges
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
