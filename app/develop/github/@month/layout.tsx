import Tab from "#/ui/tab"


export default function Layout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className=" space-y-6">
      <Tab />
      {children}
    </div>
  )
}