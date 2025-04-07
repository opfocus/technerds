import Link from "next/link";

export default function Home() {
  return (
    <Link 
    href={"/develop/github"}
    className=" underline"
    >
      Github discussion Page(test)
    </Link>
  );
}
