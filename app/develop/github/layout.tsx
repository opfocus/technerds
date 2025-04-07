

export default function Layout({
  children,
  month
}: {
  children: React.ReactNode
  month: React.ReactNode
}) {
  return (
    <div className=" space-y-6">
    {month}
    {children}
    </div>
  )
}