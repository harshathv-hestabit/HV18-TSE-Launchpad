"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Table from "@/components/ui/Table";

import AreaChart from "@/components/charts/Area-chart";
import BarChart from "@/components/charts/Bar-chart";
import { FaAngleRight, FaChartArea, FaChartBar, FaTable } from "react-icons/fa";


export default function Home() {
  return (
    <div className="space-y-8">

      <h1 className="text-3xl text-gray-700 font-semibold">Dashboard</h1>

      <div className="bg-white shadow rounded p-3 text-gray-600">
        Dashboard
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* <div className="flex gap-6 justify-between lg:flex-nowrap md:flex-wrap"> */}
        <Card classProp="w-full h-full bg-blue-600 text-white" variant="primary" title="Primary Card">
          <Button variant="primary">
            View Details
            <FaAngleRight/>
          </Button>
        </Card>

        <Card classProp="w-full h-full bg-yellow-500 text-white" variant="warning" title="Warning Card">
          <Button variant="warning">
            View Details
            <FaAngleRight/>
          </Button>
        </Card>

        <Card classProp='w-full h-full bg-green-600 text-white' variant="success" title="Success Card">
          <Button variant="success">
            View Details
            <FaAngleRight/>
          </Button>
        </Card>

        <Card classProp='w-full h-full bg-red-600 text-white' variant="danger" title="Danger Card">
          <Button variant="danger">
            View Details
            <FaAngleRight/>
          </Button>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card classProp={"text-gray-700"} title="Area Chart Example" icon={<FaChartArea/>}>
          <AreaChart />
        </Card>

        <Card classProp={"text-gray-700"} title="Bar Chart Example" icon={<FaChartBar/>}>
          <BarChart />
        </Card>

      </div>

      <Card classProp={"text-gray-700"} title="DataTable Example" icon={<FaTable/>}>
        <Table
          columns={[]}
          data={[]}
        />
      </Card>
    </div>
  );
}