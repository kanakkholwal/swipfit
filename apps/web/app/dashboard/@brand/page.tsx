import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = [
  {
    value: "overview",
    label: "Overview",
  },
  {
    value: "campaigns",
    label: "Campaigns",
  },
  {
    value: "products",
    label: "Products",
  },
];

export default function BrandDashboard() {
  return (
    <>
      <Tabs defaultValue={TABS[0].value} className="mt-8">
        <TabsList variant="wide">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} variant="fluid">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mx-auto mt-8 max-w-screen-xl rounded-2xl bg-muted/70 p-4 lg:p-10">
          {TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.value}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </>
  );
}
