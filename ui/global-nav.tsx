"use client";

import Link from "next/link";
import { useState } from "react";
import { demos } from "#/lib/demo";
import { NextLogoDark } from "./next-logo";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import GlobalNavItem from "./global-nav-item";
import clsx from "clsx";

export default function GlobalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <div className=" fixed top-0 z-10 w-full flex-col border-b border-gray-200 lg:bottom-0 lg:w-72 lg:z-auto lg:border-b-0 lg:border-r ">
      <div className=" flex h-14 items-center px-4 py-4 lg:h-auto">
        <Link
          href="/"
          className=" group flex w-full items-center gap-x-2.5"
          onClick={close}
        >
          <div className=" h-7 w-7 rounded-full">
            <NextLogoDark />
          </div>
          <h3 className=" font-semibold tracking-wide text-gray-500 group-hover:text-gray-700">
            Super-devs
          </h3>
        </Link>
      </div>
      <button
        type="button"
        className="group absolute top-0 right-0 flex h-14 items-center gap-x-2 px-4 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className=" font-medium text-gray-500 group-hover:text-gray-700">
          Menu
        </div>
        {isOpen ? (
          <XMarkIcon className=" w-6 h-6  text-gray-500" />
        ) : (
          <Bars3Icon className=" w-6 h-6 text-gray-500" />
        )}
      </button>
      <div
        className={clsx('overflow-y-auto lg:static lg:block lg:h-full', {
          'fixed inset-x-0 bottom-0 top-14 mt-px': isOpen,
          hidden: !isOpen,
        })}
      >
        <nav className="  space-y-6 px-2 pb-24 pt-5">
          {demos.map((section) => (
            <div key={section.name}>
              <div className=" mb-2 px-3 tracking-wide uppercase text-xs font-semibold text-gray-500/80">
                {section.name}
              </div>
              <div className=" space-y-1">
                {section.items.map((item) => (
                  <GlobalNavItem key={item.name} item={item} close={close} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
