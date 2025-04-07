import Area from "#/lib/area-plot";
import Bar from "#/lib/bar-plot";
import Pie from "#/lib/pie-plot";

export default function GithubMonthly() {
  return (
    <div className=" flex flex-row gap-x-6 w-full">
      <div className=" w-2/3 p-4 shadow-md relative bg-gray-50 rounded-md flex flex-col gap-y-4">
        <h3 className="font-semibold">Discussions activity</h3>
        <Bar />
      </div>
      <div className=" w-1/3 flex flex-col gap-y-4">
        <div className=" p-4 shadow-md relative bg-gray-50 rounded-md flex flex-col gap-y-4">
          <h3 className="font-semibold">Monthly Categories</h3>
          <Pie />
        </div>
        <div className=" p-4 shadow-md relative bg-gray-50 rounded-md flex flex-col gap-y-4">
          <h3 className="font-semibold text-red-300">Monthly Discussions(virtual)</h3>
          <Area />
        </div>
      </div>
    </div>
  );
}
