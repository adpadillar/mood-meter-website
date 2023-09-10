import type { NextPage } from "next";

interface HomeProps {
  children?: React.ReactNode;
}

const Home: NextPage<HomeProps> = () => {
  return (
    <div>
      <h1>This is a page</h1>
    </div>
  );
};

export default Home;
