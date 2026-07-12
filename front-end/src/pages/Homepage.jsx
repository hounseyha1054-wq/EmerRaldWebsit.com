import Hero from '../Components/Hero';
import Menu from '../Components/Menu';
import ReservationForm from '../Components/ReservationForm';

const Homepage = ({ onAuthRequired }) => {
  return (
    <div className="bg-zinc-950">
      <Hero onAuthRequired={onAuthRequired} />
      <Menu onAuthRequired={onAuthRequired} />
      <ReservationForm onAuthRequired={onAuthRequired} />
    </div>
  );
};

export default Homepage;
