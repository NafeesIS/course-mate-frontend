'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import bad from '../../../../../public/assets/new-company-alert/bad.svg';
import best from '../../../../../public/assets/new-company-alert/best.svg';
import better from '../../../../../public/assets/new-company-alert/better.svg';
import good from '../../../../../public/assets/new-company-alert/good.svg';
import worst from '../../../../../public/assets/new-company-alert/worst.svg';

// type Scenario = 'worst' | 'bad' | 'good' | 'better' | 'best' | 'awesome';
type Scenario = 'worst' | 'bad' | 'good' | 'better' | 'best';

type ScenarioConfig = {
  label: string;
  ticketSize: number;
  conversionRatio: number;
  qualifiedLeads: number;
  bgColor: string;
  hoverColor: string;
  icon: string;
};

interface ScenarioSelectorProps {
  // eslint-disable-next-line no-unused-vars
  onScenarioChange: (config: {
    ticketSize: number;
    conversionRatio: number;
    qualifiedLeads: number;
    scenario: string;
  }) => void;
  ticketSize: number;
}

const ScenarioSelector = ({
  onScenarioChange,
  ticketSize,
}: ScenarioSelectorProps) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>('good');

  const scenarioConfigs: Record<Scenario, ScenarioConfig> = {
    worst: {
      label: 'Worst',
      ticketSize: ticketSize,
      conversionRatio: 1,
      qualifiedLeads: 1,
      bgColor: 'bg-red-100',
      hoverColor: 'hover:bg-red-200',
      icon: worst,
    },
    bad: {
      label: 'Bad',
      ticketSize: ticketSize,
      conversionRatio: 3,
      qualifiedLeads: 3,
      bgColor: 'bg-orange-100',
      hoverColor: 'hover:bg-orange-200',
      icon: bad,
    },
    good: {
      label: 'Good',
      ticketSize: ticketSize,
      conversionRatio: 5,
      qualifiedLeads: 5,
      bgColor: 'bg-yellow-100',
      hoverColor: 'hover:bg-yellow-200',
      icon: good,
    },
    better: {
      label: 'Better',
      ticketSize: ticketSize,
      conversionRatio: 7,
      qualifiedLeads: 7,
      bgColor: 'bg-green-100',
      hoverColor: 'hover:bg-green-200',
      icon: better,
    },
    best: {
      label: 'Best',
      ticketSize: ticketSize,
      conversionRatio: 10,
      qualifiedLeads: 10,
      bgColor: 'bg-emerald-200',
      hoverColor: 'hover:bg-emerald-300',
      icon: best,
    },
  };

  const handleScenarioChange = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    const config = scenarioConfigs[scenario];
    onScenarioChange({
      ticketSize: config.ticketSize,
      conversionRatio: config.conversionRatio,
      qualifiedLeads: config.qualifiedLeads,
      scenario: scenario,
    });
  };

  return (
    <div className='flex flex-wrap gap-3'>
      {(Object.keys(scenarioConfigs) as Scenario[]).map((scenario) => (
        <motion.div
          key={scenario}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => handleScenarioChange(scenario)}
            variant='outline'
            className={`
              ${scenarioConfigs[scenario].bgColor}
              ${scenarioConfigs[scenario].hoverColor}
              ${selectedScenario === scenario ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
              flex items-center gap-2
              rounded-full px-4 py-2 font-medium
              text-gray-800 shadow-md transition-all
              duration-200 ease-in-out
            `}
          >
            <Image
              src={scenarioConfigs[scenario].icon}
              alt={scenarioConfigs[scenario].label}
              width={100}
              height={100}
              quality={100}
              className='h-7 w-7'
            />

            {scenarioConfigs[scenario].label}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default ScenarioSelector;
