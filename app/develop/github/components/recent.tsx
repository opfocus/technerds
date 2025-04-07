"use client";

import { useFetchDiscussionJson } from "#/utils.ts/fetch-data";
import Link from "next/link";

export default function Recent() {
  const data = useFetchDiscussionJson("/test-data/test1.json");
  const e = data?.data.repository.discussions.edges.slice(0, 5);

  if (e !== undefined)
    return (
      <div className=" w-full p-4 flex flex-col gap-y-4 shadow-md bg-gray-50 rounded-md">
        <h3 className="font-semibold">Recent Created</h3>
        <ul className=" w-full flex flex-col opacity-80">
          {e.map((item) => (
            <li key={item.node.id} className=" w-full flex flex-row">
              <div className=" w-28 shrink-0 px-4 py-2 text-right text-sm">
                {item.node.createdAt.slice(0,10)}
              </div>
              <div className=" flex flex-col">
                <div className=" p-1 border-2 border-gray-400 border-solid rounded-full my-3"></div>
                <div className=" w-[1px] h-9 bg-gray-200 self-center"></div>
              </div>
              <Link 
              href={item.node.url}
              target="black"
              className=" px-4 py-2  text-sm underline">
                {item.node.title.split("]").slice(1)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
}
