import './App.css';
import { FormEvent, useState } from 'react';
import { SimulationResult } from '@/models';
import SimulationResults from '@/components/SimulationResults';
import InputNumber from '@/components/InputNumber';
import IconButton from '@/components/IconButton';
import { runSimulation } from '@/utils/simulation';
import InputRange from '@/components/InputRange';
import ExemplaryDayChart from '@/components/ExemplaryDayChart';

function App() {
  const [loading, setLoading] = useState(false);
  const [seed, setSeed] = useState(12345);
  const [numChargepoints, setNumChargepoints] = useState(20);
  const [arrivalProbabilityMultiplier, setArrivalProbabilityMultiplier] =
    useState(100);
  const [consumption, setConsumption] = useState(18);
  const [chargingPower, setChargingPower] = useState(11);
  const [simulationResult, setSimulationResult] =
    useState<SimulationResult | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await runSimulation({
      arrivalProbabilityMultiplier,
      chargingPower,
      consumption,
      numChargepoints,
      seed,
    });
    setSimulationResult(result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="grid gap-4 max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold">EV Chargingpoint Sim</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-4">
            <InputNumber
              label="Seed"
              value={seed}
              onChange={(e) => setSeed(Number(e.target.value))}
              min={1}
              required
            />

            <InputNumber
              label="Number of Charge Points:"
              value={numChargepoints}
              onChange={(e) => setNumChargepoints(Number(e.target.value))}
              min={1}
              required
            />

            <InputRange
              label="Arrival Probability Multiplier (%)"
              value={arrivalProbabilityMultiplier}
              onChange={(e) =>
                setArrivalProbabilityMultiplier(Number(e.target.value))
              }
            />

            <InputNumber
              label="Car Consumption (kWh)"
              value={consumption}
              onChange={(e) => setConsumption(Number(e.target.value))}
              min={1}
              required
            />

            <InputNumber
              label="Charging Power (kWh)"
              value={chargingPower}
              onChange={(e) => setChargingPower(Number(e.target.value))}
              min={1}
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <IconButton
              ariaLabel="Simulate"
              label="Simulate"
              type="submit"
              rightIcon="play_circle"
              disabled={loading}
            />

            {loading && (
              <span className="text-gray-500 font-thin text-sm">
                Processing...
              </span>
            )}
          </div>
        </form>

        {simulationResult && (
          <>
            <SimulationResults simulationResult={simulationResult} />
            <ExemplaryDayChart dailyData={simulationResult.dailyData} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
