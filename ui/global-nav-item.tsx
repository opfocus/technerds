'use client'
import clsx from "clsx"

import { Item } from "#/lib/demo"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"

export default function GlobalNavItem ({
  item,
  close,
}: {
  item:Item
  close: ()=>false | void
}) {
  const segment = useSelectedLayoutSegment()
  const isActive = segment === item.slug
  
  return (
    <Link 
      onClick={close}
      href={`/${item.slug}`}
      className={clsx(' block rounded-md px-3 py-2 text-sm font-medium hover:text-gray-600 hover:bg-gray-100', {
        ' text-gray-700':isActive,
        ' text-gray-500': !isActive
      })}
    >
      {item.name}
    </Link>
  )
}