import MainLayout from "../layouts/MainLayout";
import FilterBar from "../components/FilterBar";
import Dashboard from "../components/Dashboard";
import StudentTable from "../components/StudentTable";

function Home() {
  return (
    <MainLayout>
      <FilterBar />

      <Dashboard />

      <StudentTable />
    </MainLayout>
  );
}

export default Home;