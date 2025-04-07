import Recent from "#/app/develop/github/components/recent";
import Top from "#/app/develop/github/components/top";
import Other from "#/ui/other-github";

export default function Page() {
  return (
    <div>
    <div className=" flex flex-row gap-x-6">
      <section className=" w-1/3">
      <Recent />
      </section>
      <section className=" w-2/3">
      <Top />
      </section>

    </div>
    <section>
        <Other />
      </section>
    </div>
  );
}
