import type { NextPage } from "next";
import Experiment from "~/components/Experiment";

interface HomeProps {
  children?: React.ReactNode;
}

const Home: NextPage<HomeProps> = () => {
  return (
    <div className="p-10">
      <h1 className="text-4xl font-extrabold">
        ¡Escoge la emoción de esta canción!
      </h1>
      <Experiment category="calm" />
      <Experiment category="happy" />
    </div>
  );
};

export default Home;
