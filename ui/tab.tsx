

import Link from "next/link";
import { months } from "#/lib/github-data";

export default function Tab() {
  const path = "/develop/github"

  return (
      <nav className=" space-x-2">
        {months.map(month => (
          <TabItem key={month.name} name={month.name} href={path+"/" + month.slug}/>
        ))}
      </nav>
  );
}


export function TabItem({
  name,
  href
}: {
  name:string 
  href:string
}) {
  return (
    <Link
    href={href}
    className=" px-2 py-1 text-sm bg-cyan-200 hover:bg-cyan-400 opacity-80 ring-cyan-400 ring-1"
  >
    {name}
  </Link>
  )
}